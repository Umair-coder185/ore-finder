import {
  Xoroshiro128PlusPlus,
  deriveChunkDecorationSeed,
  deriveFeatureSeed,
} from "../seed/seedEngine.js";
import {
  computeSearchBoundaries,
  computeCoordinateDistances,
  sortCoordinateResults,
} from "../coordinates/coordinateEngine.js";
import { getVersionCapability } from "../compatibility/capabilityRegistry.js";
import {
  ORE_PLACEMENT_BATCHES,
  getOreBatchesForVersion,
} from "../distribution/distributionEngine.js";
import { RESULT_CLASSIFICATION, createSearchResultItem } from "../../types/resultContracts.js";

/**
 * Deterministic Candidate Generator for Minecraft Java Edition 1.18–1.21
 *
 * CRITICAL ACCURACY CLASSIFICATION:
 * Every placement point computed by this module is strictly classified as:
 *   `RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE` ("deterministic-candidate")
 * and NEVER as `VERIFIED_EXACT`.
 *
 * Why?
 * - The chunk decoration seed (`deriveChunkDecorationSeed`), feature seed
 *   (`deriveFeatureSeed`), `Xoroshiro128++` PRNG stream, `InSquarePlacement` X/Z offset,
 *   and `HeightRangePlacement` (`trapezoid` / `uniform`) Y roll are 100% deterministic
 *   and reproducible from `(worldSeedLong, chunkX, chunkZ, featureIndex)`.
 * - However, whether an actual ore block survives in-game at `(x, y, z)` also depends on:
 *   1. Local biome feature list index shifts
 *   2. Whether the block at `(x, y, z)` is Stone/Deepslate vs. carved by a cave, ravine, or aquifer
 *   3. The `discard_chance_on_air_exposure` check against adjacent air blocks.
 */

const ORE_SWATCH_COLORS = {
  diamond: "#5CE1E6",
  iron: "#D9C3B0",
  gold: "#F5C451",
  emerald: "#4ADE80",
  redstone: "#F87171",
  lapis: "#60A5FA",
  copper: "#FB923C",
  coal: "#9CA3AF",
};

const UNDERGROUND_ORES_STEP = 6;
const MAX_CANDIDATES_RETURNED = 120;

/**
 * Samples a vertical Y coordinate using Minecraft's `TrapezoidHeight` (plateau = 0 triangle)
 * or `UniformHeight` placement provider.
 *
 * @param {Xoroshiro128PlusPlus} rng
 * @param {Object} batch
 * @returns {number}
 */
function samplePlacementAltitude(rng, batch) {
  const min = batch.minY;
  const max = batch.maxY;
  const span = max - min;
  if (span <= 0) return min;

  if (batch.distribution === "uniform") {
    return min + rng.nextInt(span + 1);
  }

  // Triangular distribution centered around peakY
  if (batch.peakY <= min) {
    // Bottom-weighted triangle (e.g., Diamond & lower Redstone peaking near -64)
    const r1 = rng.nextInt(span + 1);
    const r2 = rng.nextInt(span + 1);
    return min + Math.abs(r1 - r2);
  }

  const lowerSpan = Math.max(1, batch.peakY - min);
  const upperSpan = Math.max(1, max - batch.peakY);
  return (
    min +
    rng.nextInt(lowerSpan + 1) +
    rng.nextInt(upperSpan + 1) -
    lowerSpan +
    Math.floor(lowerSpan / 2)
  );
}

/**
 * Generates deterministic ore placement candidates across the bounded chunk radius.
 *
 * @param {Object} params
 * @param {bigint} params.worldSeedLong
 * @param {string} params.edition
 * @param {string} params.version
 * @param {{ x: number, y: number, z: number }} params.origin
 * @param {number} params.radiusChunks
 * @param {Array<string>} params.selectedOres
 * @param {Object} [params.advanced]
 * @param {function({ processedChunks: number, totalChunks: number }): void} [params.onProgress]
 * @param {function(): boolean} [params.shouldAbort]
 */
export function generateDeterministicCandidates({
  worldSeedLong,
  edition,
  version,
  origin,
  radiusChunks,
  selectedOres = [],
  advanced = {},
  onProgress,
  shouldAbort,
}) {
  const capability = getVersionCapability(edition, version);
  if (!capability.capabilities.deterministicCandidates) {
    return {
      supported: false,
      aborted: false,
      candidates: [],
      totalEvaluatedChunks: 0,
      totalRawCandidates: 0,
    };
  }

  const boundaries = computeSearchBoundaries(origin.x, origin.z, radiusChunks);
  const { minChunkX, maxChunkX, minChunkZ, maxChunkZ } = boundaries.chunkRange;
  const totalChunks = boundaries.totalChunks;

  const airExposureMode = advanced.airExposureMode || "all";
  const elevationFocus = advanced.elevationFocus || "optimal-peak";
  const sortPreference = advanced.sortPreference || "distance-3d";

  /** @type {Array<Object>} */
  const rawCandidates = [];
  let processedChunks = 0;

  for (let cz = minChunkZ; cz <= maxChunkZ; cz += 1) {
    for (let cx = minChunkX; cx <= maxChunkX; cx += 1) {
      if (typeof shouldAbort === "function" && shouldAbort()) {
        return {
          supported: true,
          aborted: true,
          candidates: [],
          totalEvaluatedChunks: processedChunks,
          totalRawCandidates: rawCandidates.length,
        };
      }

      const chunkMinX = cx * 16;
      const chunkMinZ = cz * 16;
      const decorationSeed = deriveChunkDecorationSeed(worldSeedLong, chunkMinX, chunkMinZ);

      for (const oreId of selectedOres) {
        const oreSpec = ORE_PLACEMENT_BATCHES[oreId];
        if (!oreSpec) continue;

        const batches = getOreBatchesForVersion(oreId, capability);

        for (const batch of batches) {
          // Filter by air-exposure preference
          if (airExposureMode === "buried-only" && batch.discardOnAirExposure < 0.5) {
            continue;
          }
          if (airExposureMode === "cave-exposed" && batch.discardOnAirExposure >= 0.7) {
            continue;
          }

          const featureSeed = deriveFeatureSeed(
            decorationSeed,
            batch.featureIndex,
            UNDERGROUND_ORES_STEP
          );
          const rng = Xoroshiro128PlusPlus.fromSeed(featureSeed);

          // Rarity filter check (e.g. ore_diamond_large 1/9 chance per chunk)
          if (batch.rarityFilter && rng.nextInt(batch.rarityFilter) !== 0) {
            continue;
          }

          // Sample candidate attempts (cap per-chunk attempts per batch for high-frequency ores so the candidate list highlights primary placements)
          const attemptsToSample = Math.min(batch.count, 2);

          for (let attempt = 0; attempt < attemptsToSample; attempt += 1) {
            const dx = rng.nextInt(16);
            const dz = rng.nextInt(16);
            const rawY = samplePlacementAltitude(rng, batch);
            const clampedY = Math.max(-63, Math.min(319, rawY));

            // Apply elevation focus filter
            if (elevationFocus === "optimal-peak") {
              const distFromRecommended = Math.abs(clampedY - oreSpec.recommendedY);
              if (distFromRecommended > 20) continue;
            } else if (elevationFocus === "player-level") {
              if (Math.abs(clampedY - origin.y) > 16) continue;
            }

            // Use a secondary PRNG roll to keep chunk candidate density bounded and reproducible
            if (rng.nextInt(4) !== 0) {
              continue;
            }

            const worldX = chunkMinX + dx;
            const worldZ = chunkMinZ + dz;
            const distances = computeCoordinateDistances(origin, {
              x: worldX,
              y: clampedY,
              z: worldZ,
            });

            // Keep candidates within horizontal block radius
            if (distances.distanceHorizontal > boundaries.radiusBlocks) {
              continue;
            }

            const candidateId = `cand-${edition}-${version}-${oreId}-${batch.batchId}-c${cx}_${cz}-a${attempt}`;

            rawCandidates.push(
              createSearchResultItem({
                id: candidateId,
                ore: oreId,
                oreName: oreSpec.name,
                swatchColor: ORE_SWATCH_COLORS[oreId] || "#69C598",
                batchName: batch.label,
                edition,
                version,
                x: worldX,
                y: clampedY,
                z: worldZ,
                chunkX: cx,
                chunkZ: cz,
                distance3D: distances.distance3D,
                distanceHorizontal: distances.distanceHorizontal,
                distanceVertical: distances.distanceVertical,
                classification: RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE,
                verificationStatus: "candidate-unverified-terrain",
                verificationMethod: "xoroshiro128pp-chunk-decoration-placement-model",
                source: oreSpec.sourceReference,
                discardChanceOnAirExposure: batch.discardOnAirExposure,
                veinSize: batch.size,
                recommendedY: oreSpec.recommendedY,
                stratumRange: oreSpec.stratumRange,
                limitations: capability.limitations,
              })
            );
          }
        }
      }

      processedChunks += 1;
      if (
        typeof onProgress === "function" &&
        (processedChunks % 25 === 0 || processedChunks === totalChunks)
      ) {
        onProgress({ processedChunks, totalChunks });
      }
    }
  }

  const sorted = sortCoordinateResults(rawCandidates, sortPreference);

  return {
    supported: true,
    aborted: false,
    candidates: sorted.slice(0, MAX_CANDIDATES_RETURNED),
    totalEvaluatedChunks: processedChunks,
    totalRawCandidates: rawCandidates.length,
  };
}
