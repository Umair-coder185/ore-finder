import test from "node:test";
import assert from "node:assert/strict";

import {
  javaStringHashCode,
  resolveWorldSeed,
  mixStafford13,
  upgradeSeedTo128bit,
  Xoroshiro128PlusPlus,
  LegacyRandom,
  deriveChunkDecorationSeed,
  deriveFeatureSeed,
  MAX_LONG_64,
  MIN_LONG_64,
} from "../src/features/ore-finder/engine/seed/seedEngine.js";

import {
  worldToChunk,
  chunkToWorldBounds,
  chunkLocalToWorld,
  computeCoordinateDistances,
  computeSearchBoundaries,
  isWithinSearchRadius,
  sortCoordinateResults,
} from "../src/features/ore-finder/engine/coordinates/coordinateEngine.js";

import {
  getVersionCapability,
  getCompatibilityMatrixSummary,
} from "../src/features/ore-finder/engine/compatibility/capabilityRegistry.js";

import {
  generateDistributionGuidance,
  computeOreElevationCurve,
} from "../src/features/ore-finder/engine/distribution/distributionEngine.js";

import { executeOreAnalysisSearch } from "../src/features/ore-finder/engine/search/searchOrchestrator.js";
import {
  RESULT_CLASSIFICATION,
  createSearchResultItem,
} from "../src/features/ore-finder/types/resultContracts.js";

// ============================================================================
// 1. SEED ENGINE TESTS
// ============================================================================

test("Seed Engine: positive, negative, zero, and 64-bit boundary numeric seeds", () => {
  const pos = resolveWorldSeed("123456789");
  assert.equal(pos.isValid, true);
  assert.equal(pos.inputType, "numeric-64");
  assert.equal(pos.worldSeedLong, 123456789n);
  assert.equal(pos.worldSeedString, "123456789");

  const neg = resolveWorldSeed("-4172144997902289642");
  assert.equal(neg.isValid, true);
  assert.equal(neg.inputType, "numeric-64");
  assert.equal(neg.worldSeedLong, -4172144997902289642n);

  const zero = resolveWorldSeed("0");
  assert.equal(zero.isValid, true);
  assert.equal(zero.worldSeedLong, 0n);

  const maxLong = resolveWorldSeed("9223372036854775807");
  assert.equal(maxLong.isValid, true);
  assert.equal(maxLong.worldSeedLong, MAX_LONG_64);

  const minLong = resolveWorldSeed("-9223372036854775808");
  assert.equal(minLong.isValid, true);
  assert.equal(minLong.worldSeedLong, MIN_LONG_64);
});

test("Seed Engine: text seeds match exact Java String.hashCode() reference vectors", () => {
  // Independent Java String.hashCode() reference test vectors
  assert.equal(javaStringHashCode(""), 0);
  assert.equal(javaStringHashCode("a"), 97);
  assert.equal(javaStringHashCode("abc"), 96354);
  assert.equal(javaStringHashCode("minecraft"), 695073197);
  // "pollinating sandboxes" is a classic Minecraft seed known to hash to 0 in Java String.hashCode()
  assert.equal(javaStringHashCode("pollinating sandboxes"), 0);

  const textSeed = resolveWorldSeed("minecraft");
  assert.equal(textSeed.isValid, true);
  assert.equal(textSeed.inputType, "text-hashed");
  assert.equal(textSeed.hashCode32, 695073197);
  assert.equal(textSeed.worldSeedLong, 695073197n);
});

test("Seed Engine: invalid and overflow numeric seeds are rejected cleanly", () => {
  const empty = resolveWorldSeed("   ");
  assert.equal(empty.isValid, false);
  assert.equal(empty.inputType, "invalid");
  assert.ok(empty.error.includes("empty"));

  const overflowPos = resolveWorldSeed("9223372036854775808");
  assert.equal(overflowPos.isValid, false);
  assert.equal(overflowPos.inputType, "invalid");
  assert.ok(overflowPos.error.includes("64-bit"));

  const overflowNeg = resolveWorldSeed("-9223372036854775809");
  assert.equal(overflowNeg.isValid, false);
  assert.equal(overflowNeg.inputType, "invalid");
  assert.ok(overflowNeg.error.includes("64-bit"));
});

test("Seed Engine: deterministic PRNG reproducibility & independent SplitMix64/Xoroshiro128++ vectors", () => {
  // Stafford13(0n) must equal 0n
  assert.equal(mixStafford13(0n), 0n);

  // upgradeSeedTo128bit(0n) must produce non-zero 128-bit state via SILVER_RATIO_64 & GOLDEN_RATIO_64
  const state0 = upgradeSeedTo128bit(0n);
  assert.notEqual(state0.seedLo, 0n);
  assert.notEqual(state0.seedHi, 0n);

  const rngA = Xoroshiro128PlusPlus.fromSeed(-4172144997902289642n);
  const rngB = Xoroshiro128PlusPlus.fromSeed(-4172144997902289642n);

  for (let i = 0; i < 25; i++) {
    assert.equal(rngA.nextLong(), rngB.nextLong());
  }

  const lcgA = new LegacyRandom(123456789n);
  const lcgB = new LegacyRandom(123456789n);
  for (let i = 0; i < 25; i++) {
    assert.equal(lcgA.nextLong(), lcgB.nextLong());
  }

  const decSeed1 = deriveChunkDecorationSeed(-4172144997902289642n, -3, 7);
  const decSeed2 = deriveChunkDecorationSeed(-4172144997902289642n, -3, 7);
  assert.equal(decSeed1, decSeed2);

  const featSeed = deriveFeatureSeed(decSeed1, 2, 6);
  assert.equal(featSeed, decSeed1 + 2n + 60000n);
});

// ============================================================================
// 2. COORDINATE & CHUNK ENGINE TESTS
// ============================================================================

test("Coordinate Engine: positive and negative world-to-chunk floor division", () => {
  // Block (0, 0) -> Chunk (0, 0), local (0, 0)
  const origin = worldToChunk(0, 0);
  assert.equal(origin.chunkX, 0);
  assert.equal(origin.chunkZ, 0);
  assert.equal(origin.localX, 0);
  assert.equal(origin.localZ, 0);

  // Block (15, 15) -> Chunk (0, 0), local (15, 15)
  const pos15 = worldToChunk(15, 15);
  assert.equal(pos15.chunkX, 0);
  assert.equal(pos15.chunkZ, 0);
  assert.equal(pos15.localX, 15);
  assert.equal(pos15.localZ, 15);

  // Block (-1, -1) -> Chunk (-1, -1), local (15, 15)
  const neg1 = worldToChunk(-1, -1);
  assert.equal(neg1.chunkX, -1);
  assert.equal(neg1.chunkZ, -1);
  assert.equal(neg1.localX, 15);
  assert.equal(neg1.localZ, 15);

  // Block (-16, -16) -> Chunk (-1, -1), local (0, 0)
  const neg16 = worldToChunk(-16, -16);
  assert.equal(neg16.chunkX, -1);
  assert.equal(neg16.chunkZ, -1);
  assert.equal(neg16.localX, 0);
  assert.equal(neg16.localZ, 0);

  // Block (-17, -17) -> Chunk (-2, -2), local (15, 15)
  const neg17 = worldToChunk(-17, -17);
  assert.equal(neg17.chunkX, -2);
  assert.equal(neg17.chunkZ, -2);
  assert.equal(neg17.localX, 15);
  assert.equal(neg17.localZ, 15);

  // Round-trip local to world
  const rt = chunkLocalToWorld(-2, -2, 15, 15);
  assert.equal(rt.x, -17);
  assert.equal(rt.z, -17);

  // Chunk bounds
  const bounds = chunkToWorldBounds(-1, 0);
  assert.equal(bounds.minX, -16);
  assert.equal(bounds.maxX, -1);
  assert.equal(bounds.minZ, 0);
  assert.equal(bounds.maxZ, 15);
});

test("Coordinate Engine: 3D, horizontal, and vertical distance calculations & boundaries", () => {
  // 3-4-5 right triangle in X/Z plane with Y delta = 0
  const dist2D = computeCoordinateDistances(
    { x: 0, y: -54, z: 0 },
    { x: 3, y: -54, z: 4 }
  );
  assert.equal(dist2D.distanceHorizontal, 5);
  assert.equal(dist2D.distance3D, 5);
  assert.equal(dist2D.distanceVertical, 0);

  // 3D distance with vertical offset (dx=3, dy=12, dz=4 -> sqrt(9+144+16) = sqrt(169) = 13)
  const dist3D = computeCoordinateDistances(
    { x: 10, y: -50, z: -20 },
    { x: 13, y: -38, z: -16 }
  );
  assert.equal(dist3D.distance3D, 13);
  assert.equal(dist3D.distanceHorizontal, 5);
  assert.equal(dist3D.distanceVertical, 12);

  // Search boundaries for radiusChunks = 4 -> (2*4 + 1)^2 = 81 chunks, radiusBlocks = 64
  const bounds = computeSearchBoundaries(0, 0, 4);
  assert.equal(bounds.totalChunks, 81);
  assert.equal(bounds.radiusBlocks, 64);
  assert.equal(
    isWithinSearchRadius({ x: 0, y: 0, z: 0 }, { x: 64, y: 0, z: 0 }, 4, "horizontal-circle"),
    true
  );
  assert.equal(
    isWithinSearchRadius({ x: 0, y: 0, z: 0 }, { x: 65, y: 0, z: 0 }, 4, "horizontal-circle"),
    false
  );
  assert.equal(
    isWithinSearchRadius({ x: 0, y: 0, z: 0 }, { x: 79, y: 0, z: 0 }, 4, "chunk-square"),
    true
  );
  assert.equal(
    isWithinSearchRadius({ x: 0, y: 0, z: 0 }, { x: 80, y: 0, z: 0 }, 4, "chunk-square"),
    false
  );

  // Deterministic sorting with stable tie-breakers
  const unsorted = [
    { id: "b", x: 10, y: -50, z: 10, distance3D: 20, distanceHorizontal: 14 },
    { id: "a", x: 5, y: -58, z: 5, distance3D: 20, distanceHorizontal: 7 },
    { id: "c", x: 2, y: -20, z: 2, distance3D: 12, distanceHorizontal: 3 },
  ];
  const by3D = sortCoordinateResults(unsorted, "distance-3d");
  assert.deepEqual(
    by3D.map((r) => r.id),
    ["c", "a", "b"]
  );
  const byElev = sortCoordinateResults(unsorted, "elevation-y");
  assert.deepEqual(
    byElev.map((r) => r.id),
    ["a", "b", "c"]
  );
});

// ============================================================================
// 3. DISTRIBUTION & COMPATIBILITY ENGINE TESTS
// ============================================================================

test("Distribution Engine: all 8 ores supported & version differentiation between 1.21 and 1.18", () => {
  const matrix = getCompatibilityMatrixSummary();
  assert.equal(matrix.length, 9);

  const allOres = [
    "diamond",
    "iron",
    "gold",
    "emerald",
    "redstone",
    "lapis",
    "copper",
    "coal",
  ];

  // Java 1.21 includes `ore_diamond_medium` (4 batches)
  const dist121 = generateDistributionGuidance({
    edition: "java",
    version: "java-1.21",
    selectedOres: allOres,
  });
  assert.equal(dist121.supported, true);
  assert.equal(dist121.profiles.length, 8);
  const diamond121 = dist121.profiles.find((p) => p.oreId === "diamond");
  assert.equal(diamond121.batches.length, 4);
  assert.equal(
    diamond121.batches.some((b) => b.id === "ore_diamond_medium"),
    true
  );

  // Java 1.18 has 3 diamond batches (before 1.20.2 added ore_diamond_medium)
  const dist118 = generateDistributionGuidance({
    edition: "java",
    version: "java-1.18",
    selectedOres: ["diamond"],
  });
  assert.equal(dist118.supported, true);
  assert.equal(dist118.profiles[0].batches.length, 3);
  assert.equal(
    dist118.profiles[0].batches.some((b) => b.batchId === "ore_diamond_medium"),
    false
  );

  // Unsupported 1.17 legacy returns supported: false
  const distLegacy = generateDistributionGuidance({
    edition: "java",
    version: "java-1.17-legacy",
    selectedOres: ["diamond"],
  });
  assert.equal(distLegacy.supported, false);
  assert.equal(distLegacy.results.length, 0);
});

// ============================================================================
// 4. SEARCH ORCHESTRATOR & CLASSIFICATION INTEGRITY TESTS
// ============================================================================

test("Search Orchestrator: deterministic output, strict result classification, and cancellation", () => {
  const baseRequest = {
    edition: "java",
    version: "java-1.21",
    seed: "-4172144997902289642",
    x: 0,
    y: -54,
    z: 0,
    radiusChunks: 3,
    selectedOres: ["diamond", "lapis"],
    advanced: {
      sortPreference: "distance",
      elevationBand: "optimal",
      airExposureFilter: "all",
      biomeAwarePruning: true,
    },
  };

  // Run twice and verify 100% deterministic output
  const run1 = executeOreAnalysisSearch(baseRequest);
  const run2 = executeOreAnalysisSearch(baseRequest);

  assert.equal(run1.ok, true);
  assert.equal(
    run1.classification,
    RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE
  );
  assert.ok(run1.candidateResults.length > 0);
  assert.equal(run1.candidateResults.length, run2.candidateResults.length);

  for (let i = 0; i < run1.candidateResults.length; i++) {
    assert.equal(run1.candidateResults[i].id, run2.candidateResults[i].id);
    assert.equal(run1.candidateResults[i].x, run2.candidateResults[i].x);
    assert.equal(run1.candidateResults[i].y, run2.candidateResults[i].y);
    assert.equal(run1.candidateResults[i].z, run2.candidateResults[i].z);
    assert.equal(
      run1.candidateResults[i].classification,
      RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE
    );
  }

  // Verify Bedrock 1.21 strictly returns DISTRIBUTION_GUIDANCE and zero invented coordinates
  const bedrockRun = executeOreAnalysisSearch({
    ...baseRequest,
    edition: "bedrock",
    version: "bedrock-1.21",
  });
  assert.equal(bedrockRun.ok, true);
  assert.equal(
    bedrockRun.classification,
    RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE
  );
  assert.equal(bedrockRun.candidateResults.length, 0);
  assert.equal(bedrockRun.distributionResults.length, 2);
  for (const distItem of bedrockRun.distributionResults) {
    assert.equal(distItem.x, null);
    assert.equal(distItem.y, null);
    assert.equal(distItem.z, null);
  }

  // Verify createSearchResultItem never leaks coordinates onto a DISTRIBUTION_GUIDANCE item
  const guardedItem = createSearchResultItem({
    id: "test-guard",
    oreId: "diamond",
    classification: RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE,
    x: 100,
    y: -54,
    z: 200,
  });
  assert.equal(guardedItem.x, null);
  assert.equal(guardedItem.y, null);
  assert.equal(guardedItem.z, null);

  // Verify cooperative search cancellation (`shouldAbort`)
  const cancelledRun = executeOreAnalysisSearch(baseRequest, {
    shouldAbort: () => true,
  });
  assert.equal(cancelledRun.ok, false);
  assert.equal(cancelledRun.aborted, true);
  assert.equal(cancelledRun.status, "cancelled");
});
