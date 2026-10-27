import { getVersionCapability } from "../compatibility/capabilityRegistry.js";
import { RESULT_CLASSIFICATION, createSearchResultItem } from "../../types/resultContracts.js";

/**
 * Version-Aware Ore Distribution Engine (Phase 03)
 *
 * Encodes independently verified Minecraft vanilla `placed_feature` and
 * `configured_feature` parameters across supported editions and versions,
 * including version-specific differences (such as the Java 1.20.2+ `ore_diamond_medium`
 * placement batch vs. Java 1.18–1.19).
 */

export const ORE_PLACEMENT_BATCHES = {
  diamond: {
    id: "diamond",
    name: "Diamond Ore",
    recommendedY: -58,
    recommendedBand: "Y: -59 to -53 (Above Y: -54 Lava Aquifers)",
    stratumRange: "Y: -64 to 16",
    relativeAbundance: "Low-Moderate (Highest below Y: -50 in Deepslate)",
    biomeInfluence: "Uniform across all Overworld biomes",
    specialConditions:
      "High air-exposure discard (50%–100% depending on batch). Mining solid Deepslate or flooded aquifers yields more intact blobs than dry open caves.",
    sourceReference: "Vanilla data/minecraft/worldgen/placed_feature/ore_diamond*.json (1.18–1.21)",
    batchesByEra: {
      "java-1.20.2-1.21": [
        {
          batchId: "ore_diamond",
          label: "Small Diamond Blob (ore_diamond)",
          featureIndex: 7,
          count: 7,
          size: 4,
          distribution: "trapezoid",
          minY: -64,
          maxY: 16,
          peakY: -64,
          discardOnAirExposure: 0.5,
        },
        {
          batchId: "ore_diamond_medium",
          label: "Medium Diamond Blob (ore_diamond_medium — Added 1.20.2+)",
          featureIndex: 8,
          count: 2,
          size: 8,
          distribution: "uniform",
          minY: -64,
          maxY: -4,
          peakY: -34,
          discardOnAirExposure: 0.5,
        },
        {
          batchId: "ore_diamond_large",
          label: "Large Diamond Blob (ore_diamond_large — 1/9 Rarity)",
          featureIndex: 9,
          count: 1,
          rarityFilter: 9,
          size: 12,
          distribution: "trapezoid",
          minY: -64,
          maxY: 16,
          peakY: -64,
          discardOnAirExposure: 0.7,
        },
        {
          batchId: "ore_diamond_buried",
          label: "Buried Diamond Blob (ore_diamond_buried — 100% Buried)",
          featureIndex: 10,
          count: 4,
          size: 8,
          distribution: "trapezoid",
          minY: -64,
          maxY: 16,
          peakY: -64,
          discardOnAirExposure: 1.0,
        },
      ],
      "java-1.18-1.19": [
        {
          batchId: "ore_diamond",
          label: "Small Diamond Blob (ore_diamond)",
          featureIndex: 7,
          count: 7,
          size: 4,
          distribution: "trapezoid",
          minY: -64,
          maxY: 16,
          peakY: -64,
          discardOnAirExposure: 0.5,
        },
        {
          batchId: "ore_diamond_large",
          label: "Large Diamond Blob (ore_diamond_large — 1/9 Rarity)",
          featureIndex: 8,
          count: 1,
          rarityFilter: 9,
          size: 12,
          distribution: "trapezoid",
          minY: -64,
          maxY: 16,
          peakY: -64,
          discardOnAirExposure: 0.7,
        },
        {
          batchId: "ore_diamond_buried",
          label: "Buried Diamond Blob (ore_diamond_buried — 100% Buried)",
          featureIndex: 9,
          count: 4,
          size: 8,
          distribution: "trapezoid",
          minY: -64,
          maxY: 16,
          peakY: -64,
          discardOnAirExposure: 1.0,
        },
      ],
    },
  },
  iron: {
    id: "iron",
    name: "Iron Ore",
    recommendedY: 15,
    recommendedBand: "Y: 14 to 16 (Underground) or Y: 232 (Mountain Peaks)",
    stratumRange: "Y: -64 to 320",
    relativeAbundance: "Very High",
    biomeInfluence: "All Overworld biomes (Mountain peaks expose high-altitude band)",
    specialConditions:
      "Includes three placement batches plus multi-chunk Tuff-Iron procedural noise veins between Y = -56 and Y = -8.",
    sourceReference: "Vanilla data/minecraft/worldgen/placed_feature/ore_iron_*.json (1.18–1.21)",
    batches: [
      {
        batchId: "ore_iron_middle",
        label: "Middle Iron Stratum (ore_iron_middle)",
        featureIndex: 2,
        count: 10,
        size: 9,
        distribution: "trapezoid",
        minY: -24,
        maxY: 56,
        peakY: 16,
        discardOnAirExposure: 0.0,
      },
      {
        batchId: "ore_iron_small",
        label: "Lower Small Iron (ore_iron_small)",
        featureIndex: 3,
        count: 10,
        size: 4,
        distribution: "uniform",
        minY: -64,
        maxY: 72,
        peakY: 4,
        discardOnAirExposure: 0.0,
      },
      {
        batchId: "ore_iron_upper",
        label: "High Mountain Iron (ore_iron_upper)",
        featureIndex: 1,
        count: 90,
        size: 9,
        distribution: "trapezoid",
        minY: 80,
        maxY: 384,
        peakY: 232,
        discardOnAirExposure: 0.0,
      },
    ],
  },
  gold: {
    id: "gold",
    name: "Gold Ore",
    recommendedY: -16,
    recommendedBand: "Y: -18 to -14 (Standard) or Y: 32–256 (Badlands)",
    stratumRange: "Y: -64 to 32 (Up to Y: 256 in Badlands)",
    relativeAbundance: "Moderate (High in Badlands)",
    biomeInfluence:
      "Badlands biomes add 50 uniform placement attempts per chunk between Y = 32 and Y = 256.",
    specialConditions: "Main Overworld triangular pass carries a 50% air-exposure discard penalty.",
    sourceReference: "Vanilla data/minecraft/worldgen/placed_feature/ore_gold*.json (1.18–1.21)",
    batches: [
      {
        batchId: "ore_gold",
        label: "Primary Triangular Gold (ore_gold)",
        featureIndex: 4,
        count: 4,
        size: 9,
        distribution: "trapezoid",
        minY: -64,
        maxY: 32,
        peakY: -16,
        discardOnAirExposure: 0.5,
      },
      {
        batchId: "ore_gold_lower",
        label: "Deep Uniform Gold Bonus (ore_gold_lower)",
        featureIndex: 5,
        count: 1,
        size: 9,
        distribution: "uniform",
        minY: -64,
        maxY: -48,
        peakY: -56,
        discardOnAirExposure: 0.5,
      },
    ],
  },
  emerald: {
    id: "emerald",
    name: "Emerald Ore",
    recommendedY: 236,
    recommendedBand: "Y: 220 to 256 (Mountain Biomes Only)",
    stratumRange: "Y: -16 to 320",
    relativeAbundance: "Biome-Restricted (High at high mountain altitudes)",
    biomeInfluence:
      "Strictly restricted to Mountain & Windswept Hills biomes (Meadow, Grove, Snowy Slopes, Jagged/Frozen/Stony Peaks, Windswept Hills).",
    specialConditions:
      "Single/small block replacements with 0% air-exposure penalty; does not generate outside mountain biomes.",
    sourceReference: "Vanilla data/minecraft/worldgen/placed_feature/ore_emerald.json (1.18–1.21)",
    batches: [
      {
        batchId: "ore_emerald",
        label: "Mountain Triangular Emerald (ore_emerald)",
        featureIndex: 14,
        count: 100,
        size: 3,
        distribution: "trapezoid",
        minY: -16,
        maxY: 480,
        peakY: 232,
        discardOnAirExposure: 0.0,
      },
    ],
  },
  redstone: {
    id: "redstone",
    name: "Redstone Ore",
    recommendedY: -58,
    recommendedBand: "Y: -59 to -53 (Deep Deepslate)",
    stratumRange: "Y: -64 to 15",
    relativeAbundance: "High in Deep Deepslate",
    biomeInfluence: "Uniform across all Overworld biomes",
    specialConditions:
      "Zero air-exposure discard penalty (0%), making Redstone highly visible along deep cavern walls.",
    sourceReference:
      "Vanilla data/minecraft/worldgen/placed_feature/ore_redstone*.json (1.18–1.21)",
    batches: [
      {
        batchId: "ore_redstone",
        label: "Uniform Lower Redstone (ore_redstone)",
        featureIndex: 6,
        count: 4,
        size: 8,
        distribution: "uniform",
        minY: -64,
        maxY: 15,
        peakY: -24,
        discardOnAirExposure: 0.0,
      },
      {
        batchId: "ore_redstone_lower",
        label: "Triangular Bedrock Redstone (ore_redstone_lower)",
        featureIndex: 11,
        count: 8,
        size: 8,
        distribution: "trapezoid",
        minY: -64,
        maxY: -32,
        peakY: -64,
        discardOnAirExposure: 0.0,
      },
    ],
  },
  lapis: {
    id: "lapis",
    name: "Lapis Lazuli",
    recommendedY: 0,
    recommendedBand: "Y: -2 to 2 (Stone-to-Deepslate Boundary)",
    stratumRange: "Y: -64 to 64",
    relativeAbundance: "Moderate",
    biomeInfluence: "Uniform across all Overworld biomes",
    specialConditions:
      "Split into an exposed triangular pass peaking at Y = 0 and a 100%-buried uniform pass across Y = -64 to 64.",
    sourceReference: "Vanilla data/minecraft/worldgen/placed_feature/ore_lapis*.json (1.18–1.21)",
    batches: [
      {
        batchId: "ore_lapis",
        label: "Triangular Transition Lapis (ore_lapis)",
        featureIndex: 12,
        count: 2,
        size: 7,
        distribution: "trapezoid",
        minY: -32,
        maxY: 32,
        peakY: 0,
        discardOnAirExposure: 0.0,
      },
      {
        batchId: "ore_lapis_buried",
        label: "Buried Uniform Lapis (ore_lapis_buried — 100% Buried)",
        featureIndex: 13,
        count: 4,
        size: 7,
        distribution: "uniform",
        minY: -64,
        maxY: 64,
        peakY: 0,
        discardOnAirExposure: 1.0,
      },
    ],
  },
  copper: {
    id: "copper",
    name: "Copper Ore",
    recommendedY: 48,
    recommendedBand: "Y: 44 to 52 (Optimal Peak: Y = 48)",
    stratumRange: "Y: -16 to 112",
    relativeAbundance: "Very High (Doubled blob size in Dripstone Caves)",
    biomeInfluence:
      "Dripstone Caves biomes replace standard blobs with ore_copper_large (size 20 vs 10).",
    specialConditions:
      "Also forms multi-chunk Granite-Copper procedural noise veins between Y = 0 and Y = 48.",
    sourceReference: "Vanilla data/minecraft/worldgen/placed_feature/ore_copper*.json (1.18–1.21)",
    batches: [
      {
        batchId: "ore_copper",
        label: "Triangular Copper Stratum (ore_copper)",
        featureIndex: 15,
        count: 16,
        size: 10,
        distribution: "trapezoid",
        minY: -16,
        maxY: 112,
        peakY: 48,
        discardOnAirExposure: 0.0,
      },
    ],
  },
  coal: {
    id: "coal",
    name: "Coal Ore",
    recommendedY: 96,
    recommendedBand: "Y: 92 to 100 (Lower Peak) or Y: 136+ (Mountain Uniform)",
    stratumRange: "Y: 0 to 320",
    relativeAbundance: "Very High above Y = 0 (Absent below Y = 0)",
    biomeInfluence: "Uniform across all Overworld biomes",
    specialConditions:
      "Lower triangular pass (Y = 0..192, peak Y = 96) has a 50% buried bias; upper uniform pass (Y = 136..320) has 0% air discard.",
    sourceReference: "Vanilla data/minecraft/worldgen/placed_feature/ore_coal*.json (1.18–1.21)",
    batches: [
      {
        batchId: "ore_coal_lower",
        label: "Triangular Lower Coal (ore_coal_lower)",
        featureIndex: 0,
        count: 20,
        size: 17,
        distribution: "trapezoid",
        minY: 0,
        maxY: 192,
        peakY: 96,
        discardOnAirExposure: 0.5,
      },
      {
        batchId: "ore_coal_upper",
        label: "Uniform Elevated Coal (ore_coal_upper)",
        featureIndex: 16,
        count: 30,
        size: 17,
        distribution: "uniform",
        minY: 136,
        maxY: 320,
        peakY: 228,
        discardOnAirExposure: 0.0,
      },
    ],
  },
};

/**
 * Resolves the version-appropriate placement batches for an ore and capability descriptor.
 *
 * @param {string} oreId
 * @param {Object} capability
 */
export function getOreBatchesForVersion(oreId, capability) {
  const spec = ORE_PLACEMENT_BATCHES[oreId];
  if (!spec) return [];

  if (spec.batchesByEra) {
    const era = capability?.rulesetEra || "java-1.20.2-1.21";
    return spec.batchesByEra[era] || spec.batchesByEra["java-1.20.2-1.21"] || [];
  }

  return spec.batches || [];
}

/**
 * Computes relative vertical density across Y-levels `[-64..319]` (sampled every 8 blocks)
 * based on the documented `trapezoid` and `uniform` placement batches for an ore.
 *
 * Note: This represents documented relative placement density across elevations,
 * never presented as an exact block guarantee.
 *
 * @param {string} oreId
 * @param {Object} capability
 * @returns {Array<{ y: number, relativeWeight: number }>}
 */
export function computeOreElevationCurve(oreId, capability) {
  const batches = getOreBatchesForVersion(oreId, capability);
  const sampleYs = [];
  for (let y = -64; y <= 312; y += 8) {
    sampleYs.push(y);
  }

  if (batches.length === 0) {
    return sampleYs.map((y) => ({ y, relativeWeight: 0 }));
  }

  const rawWeights = sampleYs.map((y) => {
    let weight = 0;
    for (const batch of batches) {
      const clampedMin = batch.minY;
      const clampedMax = batch.maxY;
      if (y < clampedMin || y > clampedMax) continue;

      const effectiveCount = batch.rarityFilter ? batch.count / batch.rarityFilter : batch.count;

      if (batch.distribution === "uniform") {
        const span = Math.max(1, clampedMax - clampedMin);
        weight += (effectiveCount * batch.size) / span;
      } else {
        // Triangular / trapezoid peaking at batch.peakY
        const peak = batch.peakY;
        const halfSpan = Math.max(
          1,
          Math.max(Math.abs(clampedMax - peak), Math.abs(peak - clampedMin))
        );
        const distFromPeak = Math.abs(y - peak);
        const triangleFactor = Math.max(0, 1 - distFromPeak / halfSpan);
        weight += ((effectiveCount * batch.size) / halfSpan) * triangleFactor;
      }
    }
    return { y, weight };
  });

  const maxWeight = Math.max(...rawWeights.map((p) => p.weight), 0.0001);
  return rawWeights.map((p) => ({
    y: p.y,
    relativeWeight: Math.round((p.weight / maxWeight) * 100),
  }));
}

/**
 * Generates verified Distribution Guidance records for the requested ores and version.
 *
 * @param {Object} params
 * @param {string} params.edition
 * @param {string} params.version
 * @param {Array<string>} params.selectedOres
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

export function generateDistributionGuidance({ edition, version, selectedOres = [] }) {
  const capability = getVersionCapability(edition, version);
  if (!capability.capabilities.distribution) {
    return {
      supported: false,
      isSupported: false,
      capability,
      profiles: [],
      results: [],
    };
  }

  const profiles = [];
  const results = [];

  for (const oreId of selectedOres) {
    const spec = ORE_PLACEMENT_BATCHES[oreId];
    if (!spec) continue;

    const rawBatches = getOreBatchesForVersion(oreId, capability);
    const batches = rawBatches.map((b) => ({
      ...b,
      id: b.batchId,
      attemptsPerChunk: b.count,
      veinSize: b.size,
      discardChanceOnAirExposure: b.discardOnAirExposure,
      biomeRestricted: Boolean(b.biomeTag),
    }));
    const elevationCurve = computeOreElevationCurve(oreId, capability).map((pt) => ({
      ...pt,
      normalizedWeight: pt.relativeWeight,
    }));
    const swatchColor = ORE_SWATCH_COLORS[oreId] || "#69C598";

    profiles.push({
      oreId: spec.id,
      name: spec.name,
      swatchColor,
      versionBucket: capability.rulesetEra,
      peakElevationY: spec.recommendedY,
      recommendedY: spec.recommendedY,
      recommendedBand: {
        label: spec.recommendedBand,
        minY: spec.recommendedY - 6,
        maxY: spec.recommendedY + 6,
        strategy: spec.specialConditions,
      },
      oreMeta: {
        id: spec.id,
        name: spec.name,
        swatchColor,
        optimalElevation: `Y = ${spec.recommendedY}`,
      },
      stratumRange: spec.stratumRange,
      relativeAbundance: spec.relativeAbundance,
      biomeInfluence: spec.biomeInfluence,
      biomeNote: spec.biomeInfluence,
      specialConditions: spec.specialConditions,
      airExposureNote: spec.specialConditions,
      sourceReference: spec.sourceReference,
      batches,
      elevationCurve,
    });

    results.push(
      createSearchResultItem({
        id: `dist-${edition}-${version}-${spec.id}`,
        ore: spec.id,
        oreName: spec.name,
        swatchColor,
        edition,
        version,
        x: null,
        y: null,
        z: null,
        distance3D: null,
        classification: RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE,
        verificationStatus: "verified-distribution-spec",
        verificationMethod: "vanilla-worldgen-placed-feature",
        source: spec.sourceReference,
        recommendedY: spec.recommendedY,
        stratumRange: spec.stratumRange,
        limitations: capability.limitations,
      })
    );
  }

  return {
    supported: true,
    isSupported: true,
    capability,
    profiles,
    results,
  };
}
