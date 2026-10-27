/**
 * Standardized Search Result & Capability Data Contracts (Phase 03)
 *
 * Enforces strict epistemological separation between:
 * A. VERIFIED_EXACT ("verified-exact")
 * B. DETERMINISTIC_CANDIDATE ("deterministic-candidate")
 * C. DISTRIBUTION_GUIDANCE ("distribution")
 * D. UNSUPPORTED ("unsupported")
 */

export const RESULT_CLASSIFICATION = {
  VERIFIED_EXACT: "verified-exact",
  DETERMINISTIC_CANDIDATE: "deterministic-candidate",
  DISTRIBUTION_GUIDANCE: "distribution",
  UNSUPPORTED: "unsupported",
};

export const CLASSIFICATION_META = {
  [RESULT_CLASSIFICATION.VERIFIED_EXACT]: {
    code: "VERIFIED_EXACT",
    badgeLabel: "Verified Exact Result",
    shortLabel: "Exact",
    description: "Confirmed block coordinate validated against authoritative world region data.",
  },
  [RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE]: {
    code: "DETERMINISTIC_CANDIDATE",
    badgeLabel: "Deterministic Candidate",
    shortLabel: "Candidate",
    description:
      "Reproducible PRNG feature-placement candidate derived from world seed and chunk coordinates. Actual in-game block presence depends on local biome feature ordering, stone/deepslate terrain blocks, cave carvers, and air-exposure discard checks.",
  },
  [RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE]: {
    code: "DISTRIBUTION_GUIDANCE",
    badgeLabel: "Probability / Distribution Guidance",
    shortLabel: "Distribution",
    description:
      "Verified mining elevation and stratum guidance derived from vanilla Minecraft worldgen placement specifications, not exact block coordinates.",
  },
  [RESULT_CLASSIFICATION.UNSUPPORTED]: {
    code: "UNSUPPORTED",
    badgeLabel: "Unsupported Configuration",
    shortLabel: "Unsupported",
    description: "Calculations are unavailable for this edition and version combination.",
  },
};

/**
 * Creates a standardized search result item conforming to the Phase 03 data contract.
 * Never populates x/y/z coordinates for distribution-only or unsupported classifications.
 *
 * @param {Object} params
 */
export function createSearchResultItem({
  id,
  ore,
  oreName,
  swatchColor = "#69C598",
  batchName = null,
  edition,
  version,
  x = null,
  y = null,
  z = null,
  chunkX = null,
  chunkZ = null,
  distance3D = null,
  distanceHorizontal = null,
  distanceVertical = null,
  classification = RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE,
  verificationStatus = "not-exact",
  verificationMethod = "documented-distribution",
  source = "Minecraft Vanilla Worldgen Specification",
  discardChanceOnAirExposure = null,
  veinSize = null,
  recommendedY = null,
  stratumRange = null,
  limitations = [],
}) {
  const allowsCoordinates =
    classification === RESULT_CLASSIFICATION.VERIFIED_EXACT ||
    classification === RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE;

  return {
    id,
    ore,
    oreId: ore,
    oreName: oreName || ore,
    swatchColor,
    batchName,
    batchLabel: batchName,
    edition,
    version,
    x: allowsCoordinates ? x : null,
    y: allowsCoordinates ? y : null,
    z: allowsCoordinates ? z : null,
    chunkX: allowsCoordinates ? chunkX : null,
    chunkZ: allowsCoordinates ? chunkZ : null,
    distance: allowsCoordinates ? distance3D : null,
    distance3D: allowsCoordinates ? distance3D : null,
    distanceHorizontal: allowsCoordinates ? distanceHorizontal : null,
    distanceVertical: allowsCoordinates ? distanceVertical : null,
    discardChanceOnAirExposure,
    veinSize,
    recommendedY,
    stratumRange,
    classification,
    verification: {
      status: verificationStatus,
      method: verificationMethod,
      source,
    },
    metadata: {
      discardChanceOnAirExposure,
      veinSize,
      recommendedY,
      stratumRange,
    },
    limitations: Array.isArray(limitations) ? limitations : [],
  };
}
