import { WORKSPACE_STATUS } from "../types/index.js";
import { validateOreSearchInputs } from "../validation/validateInputs.js";
import { blockToChunkCoordinates, calculateSearchFootprint } from "../utils/coordinates.js";

/**
 * Phase 01 Engine Boundary Contract
 *
 * IMPORTANT ARCHITECTURAL POLICY:
 * Phase 01 intentionally prohibits unverified algorithms, fabricated coordinates,
 * or simulated ore results. This boundary validates inputs, computes deterministic
 * chunk/region geometry for the configured search envelope, and returns an explicit
 * Phase 01 engine status descriptor ready for Phase 02 Web Worker integration.
 *
 * @param {import("../types").OreSearchParameters} params
 */
export function prepareWorkspaceConfiguration(params) {
  const validation = validateOreSearchInputs(params);

  if (!validation.isValid) {
    return {
      status: WORKSPACE_STATUS.INVALID_INPUT,
      validation,
      telemetry: null,
      engineMessage: "Resolve highlighted parameter issues to stage the search configuration.",
    };
  }

  const x = Number(params.x);
  const y = Number(params.y);
  const z = Number(params.z);

  const originChunk = blockToChunkCoordinates(x, z);
  const footprint = calculateSearchFootprint(params.radiusChunks);

  return {
    status: WORKSPACE_STATUS.PHASE_01_STANDBY,
    validation,
    telemetry: {
      edition: params.edition,
      version: params.version,
      dimension: params.dimension,
      seedPreview:
        params.seed.trim().length > 24 ? `${params.seed.trim().slice(0, 24)}…` : params.seed.trim(),
      origin: { x, y, z },
      originChunk,
      footprint,
      selectedOreCount: params.selectedOres.length,
    },
    engineMessage:
      "Search envelope validated. Phase 02 seed-generation worker module is not yet active in this build; no synthetic or approximate coordinates are displayed.",
  };
}
