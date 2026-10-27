import { RESULT_CLASSIFICATION } from "../../types/resultContracts.js";

/**
 * Version-Aware Capability Registry (Phase 03)
 *
 * Defines verified capabilities per Minecraft Edition and Version:
 * - Java 1.18–1.21:
 *   - `distribution`: true (verified vanilla `placed_feature` strata, including 1.20.2+ `ore_diamond_medium` update)
 *   - `deterministicCandidates`: true (reproducible Xoroshiro128++ chunk feature placement candidates)
 *   - `exactCoordinates`: false (seed alone cannot confirm block survival without 3D density terrain, cave carvers, aquifers, and biome feature-index evaluation)
 *   - `worldFileVerification`: false
 * - Bedrock 1.18–1.21:
 *   - `distribution`: true (verified Caves & Cliffs Part II vertical strata)
 *   - `deterministicCandidates`: false (Bedrock C++ MT19937 feature decoration ordering differs from Java Xoroshiro128++; we never substitute Java candidates for Bedrock)
 *   - `exactCoordinates`: false
 *   - `worldFileVerification`: false
 * - Legacy 1.16–1.17 (Java & Bedrock):
 *   - All capabilities false (`unsupported`)
 */

export const CAPABILITY_REGISTRY = {
  "java:java-1.21": {
    edition: "java",
    version: "java-1.21",
    versionLabel: "Java Edition 1.21.x (Tricky Trials)",
    rulesetEra: "java-1.20.2-1.21",
    capabilities: {
      distribution: true,
      deterministicCandidates: true,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE,
    validationStatus: "verified-candidate-and-distribution",
    prngEngine: "Xoroshiro128++ (Stafford13 128-bit SplitMix64 seed upgrade)",
    limitations: [
      "Deterministic candidates reproduce the chunk feature PRNG stream (Xoroshiro128++), InSquare X/Z offset, and Trapezoid/Uniform Y roll.",
      "Actual in-game block existence is not guaranteed from seed alone: veins may be skipped by discard_chance_on_air_exposure if adjacent to cave air, carved by aquifers/structures, or shifted by biome-specific feature index ordering.",
      "Emerald Ore only places inside mountainous biomes (Meadow, Cherry Grove, Grove, Snowy Slopes, Jagged/Frozen/Stony Peaks, Windswept Hills).",
    ],
  },
  "java:java-1.20": {
    edition: "java",
    version: "java-1.20",
    versionLabel: "Java Edition 1.20.x (Trails & Tales)",
    rulesetEra: "java-1.20.2-1.21",
    capabilities: {
      distribution: true,
      deterministicCandidates: true,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE,
    validationStatus: "verified-candidate-and-distribution",
    prngEngine: "Xoroshiro128++ (Stafford13 128-bit SplitMix64 seed upgrade)",
    limitations: [
      "Includes the 1.20.2+ ore_diamond_medium Deepslate batch (Y = -64 to -4) alongside small, large, and buried batches.",
      "Candidate coordinates represent deterministic PRNG placement origins prior to terrain block replacement and cave air-exposure culling.",
    ],
  },
  "java:java-1.19": {
    edition: "java",
    version: "java-1.19",
    versionLabel: "Java Edition 1.19.x (The Wild Update)",
    rulesetEra: "java-1.18-1.19",
    capabilities: {
      distribution: true,
      deterministicCandidates: true,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE,
    validationStatus: "verified-candidate-and-distribution",
    prngEngine: "Xoroshiro128++ (Stafford13 128-bit SplitMix64 seed upgrade)",
    limitations: [
      "Uses the 1.18–1.19 diamond placement specification (prior to the 1.20.2 ore_diamond_medium addition).",
      "Candidate coordinates represent deterministic PRNG placement origins prior to terrain block replacement and cave air-exposure culling.",
    ],
  },
  "java:java-1.18": {
    edition: "java",
    version: "java-1.18",
    versionLabel: "Java Edition 1.18.x (Caves & Cliffs Part II)",
    rulesetEra: "java-1.18-1.19",
    capabilities: {
      distribution: true,
      deterministicCandidates: true,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE,
    validationStatus: "verified-candidate-and-distribution",
    prngEngine: "Xoroshiro128++ (Stafford13 128-bit SplitMix64 seed upgrade)",
    limitations: [
      "First release introducing Y = -64..319 vertical bounds and Xoroshiro128++ ore feature placement.",
      "Candidate coordinates represent deterministic PRNG placement origins prior to terrain block replacement and cave air-exposure culling.",
    ],
  },
  "java:java-1.17-legacy": {
    edition: "java",
    version: "java-1.17-legacy",
    versionLabel: "Java Edition 1.16 – 1.17 (Legacy Pre-Deepslate)",
    rulesetEra: "legacy-unsupported",
    capabilities: {
      distribution: false,
      deterministicCandidates: false,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.UNSUPPORTED,
    validationStatus: "unsupported",
    prngEngine: "Legacy 48-bit LCG (Unsupported in 1.18+ Deepslate Engine)",
    limitations: [
      "Pre-1.18 worlds use legacy Y = 0..255 uniform ore generation without Deepslate strata or triangular height distributions.",
    ],
  },
  "bedrock:bedrock-1.21": {
    edition: "bedrock",
    version: "bedrock-1.21",
    versionLabel: "Bedrock Edition 1.21.x (Tricky Trials)",
    rulesetEra: "bedrock-1.18-1.21",
    capabilities: {
      distribution: true,
      deterministicCandidates: false,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE,
    validationStatus: "verified-distribution-only",
    prngEngine: "Bedrock C++ MT19937 (Distribution Guidance Mode)",
    limitations: [
      "Bedrock Edition shares vertical ore height ranges and triangular peaks with Java 1.18–1.21.",
      "Exact or candidate X/Y/Z block coordinates are not generated for Bedrock because Bedrock's C++ MT19937 feature decoration sequence differs from Java's Xoroshiro128++ stream.",
    ],
  },
  "bedrock:bedrock-1.20": {
    edition: "bedrock",
    version: "bedrock-1.20",
    versionLabel: "Bedrock Edition 1.20.x (Trails & Tales)",
    rulesetEra: "bedrock-1.18-1.21",
    capabilities: {
      distribution: true,
      deterministicCandidates: false,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE,
    validationStatus: "verified-distribution-only",
    prngEngine: "Bedrock C++ MT19937 (Distribution Guidance Mode)",
    limitations: [
      "Provides verified Y-level distribution curves and optimal mining elevations for Bedrock 1.20.x.",
      "Candidate X/Y/Z coordinates are disabled for Bedrock to avoid cross-edition PRNG misrepresentation.",
    ],
  },
  "bedrock:bedrock-1.18-1.19": {
    edition: "bedrock",
    version: "bedrock-1.18-1.19",
    versionLabel: "Bedrock Edition 1.18 – 1.19 (Caves & Cliffs II)",
    rulesetEra: "bedrock-1.18-1.21",
    capabilities: {
      distribution: true,
      deterministicCandidates: false,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE,
    validationStatus: "verified-distribution-only",
    prngEngine: "Bedrock C++ MT19937 (Distribution Guidance Mode)",
    limitations: [
      "Provides verified Y-level distribution curves and optimal mining elevations for Bedrock 1.18–1.19.",
      "Candidate X/Y/Z coordinates are disabled for Bedrock to avoid cross-edition PRNG misrepresentation.",
    ],
  },
  "bedrock:bedrock-1.17-legacy": {
    edition: "bedrock",
    version: "bedrock-1.17-legacy",
    versionLabel: "Bedrock Edition 1.16 – 1.17 (Legacy Pre-Caves & Cliffs)",
    rulesetEra: "legacy-unsupported",
    capabilities: {
      distribution: false,
      deterministicCandidates: false,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.UNSUPPORTED,
    validationStatus: "unsupported",
    prngEngine: "Legacy Bedrock Worldgen (Unsupported)",
    limitations: [
      "Pre-1.18 Bedrock worlds use legacy 0–255 vertical limits and uniform ore placement.",
    ],
  },
};

/**
 * Resolves the capability descriptor for an `(edition, version)` pair.
 *
 * @param {string} edition
 * @param {string} version
 */
export function getVersionCapability(edition, version) {
  const key = `${edition}:${version}`;
  if (CAPABILITY_REGISTRY[key]) {
    return CAPABILITY_REGISTRY[key];
  }

  return {
    edition: edition || "unknown",
    version: version || "unknown",
    versionLabel: "Unrecognized Version Profile",
    rulesetEra: "unsupported",
    capabilities: {
      distribution: false,
      deterministicCandidates: false,
      exactCoordinates: false,
      worldFileVerification: false,
    },
    highestResultClassification: RESULT_CLASSIFICATION.UNSUPPORTED,
    validationStatus: "unsupported",
    prngEngine: "None",
    limitations: [
      "The requested edition and version combination is not registered in the verified capability table.",
    ],
  };
}

/**
 * Returns an ordered array of all registered version capability descriptors.
 */
export function getCompatibilityMatrixSummary() {
  return Object.values(CAPABILITY_REGISTRY);
}
