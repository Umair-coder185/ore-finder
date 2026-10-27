import { resolveWorldSeed } from "../seed/seedEngine.js";
import { worldToChunk, computeSearchBoundaries } from "../coordinates/coordinateEngine.js";
import { getVersionCapability } from "../compatibility/capabilityRegistry.js";
import { generateDistributionGuidance } from "../distribution/distributionEngine.js";
import { generateDeterministicCandidates } from "../generation/candidateGenerator.js";
import { RESULT_CLASSIFICATION } from "../../types/resultContracts.js";
import { validateOreSearchInputs } from "../../validation/validateInputs.js";

/**
 * Primary Search Orchestrator (Phase 03)
 *
 * Coordinates:
 * 1. Input & Seed Validation (`validateOreSearchInputs` + `resolveWorldSeed`)
 * 2. Edition & Version Capability Resolution (`getVersionCapability`)
 * 3. Distribution Guidance Generation (`generateDistributionGuidance`)
 * 4. Deterministic Candidate Generation (`generateDeterministicCandidates`) when supported
 * 5. Standardized Result Contract packaging with execution timing and provenance
 *
 * Testable in pure Node.js without React or DOM dependencies.
 *
 * @param {Object} request
 * @param {Object} [hooks]
 * @param {function({ processedChunks: number, totalChunks: number }): void} [hooks.onProgress]
 * @param {function(): boolean} [hooks.shouldAbort]
 */
export function executeOreAnalysisSearch(request, hooks = {}) {
  const getNowMs = () =>
    typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : 0;
  const startTimeMs = getNowMs();
  const validation = validateOreSearchInputs(request);
  const capability = getVersionCapability(request.edition, request.version);

  // 1. Handle unsupported version
  if (!capability.capabilities.distribution) {
    return {
      ok: false,
      aborted: false,
      status: "unsupported",
      classification: RESULT_CLASSIFICATION.UNSUPPORTED,
      capability,
      validation,
      seedInfo: null,
      originChunk: null,
      boundaries: null,
      candidateResults: [],
      distributionResults: [],
      distributionProfiles: [],
      stats: {
        durationMs: Math.round(getNowMs() - startTimeMs),
        evaluatedChunks: 0,
        totalRawCandidates: 0,
        returnedCandidates: 0,
      },
      error:
        capability.limitations[0] || "Calculations are unavailable for this edition and version.",
    };
  }

  // 2. Handle invalid user inputs
  if (!validation.isValid) {
    return {
      ok: false,
      aborted: false,
      status: "invalid_input",
      classification: RESULT_CLASSIFICATION.UNSUPPORTED,
      capability,
      validation,
      seedInfo: null,
      originChunk: null,
      boundaries: null,
      candidateResults: [],
      distributionResults: [],
      distributionProfiles: [],
      stats: {
        durationMs: Math.round(getNowMs() - startTimeMs),
        evaluatedChunks: 0,
        totalRawCandidates: 0,
        returnedCandidates: 0,
      },
      error: validation.issues[0]?.message || "Resolve validation errors before running analysis.",
    };
  }

  const seedInfo = resolveWorldSeed(request.seed, {
    edition: request.edition,
  });

  if (!seedInfo.isValid || seedInfo.worldSeedLong === null) {
    return {
      ok: false,
      aborted: false,
      status: "invalid_input",
      classification: RESULT_CLASSIFICATION.UNSUPPORTED,
      capability,
      validation,
      seedInfo,
      originChunk: null,
      boundaries: null,
      candidateResults: [],
      distributionResults: [],
      distributionProfiles: [],
      stats: {
        durationMs: Math.round(getNowMs() - startTimeMs),
        evaluatedChunks: 0,
        totalRawCandidates: 0,
        returnedCandidates: 0,
      },
      error: seedInfo.error || "Invalid world seed.",
    };
  }

  const origin = {
    x: Math.floor(Number(request.x) || 0),
    y: Math.floor(Number(request.y) || -54),
    z: Math.floor(Number(request.z) || 0),
  };

  const radiusChunks = Math.max(1, Math.min(32, Math.floor(Number(request.radiusChunks) || 8)));

  const originChunk = worldToChunk(origin.x, origin.z);
  const boundaries = computeSearchBoundaries(origin.x, origin.z, radiusChunks);

  // 3. Always generate verified Distribution Guidance for supported versions
  const distributionData = generateDistributionGuidance({
    edition: request.edition,
    version: request.version,
    selectedOres: request.selectedOres,
  });

  // 4. Generate Deterministic Candidates only if the capability is verified for this edition/version
  let candidateData = {
    supported: false,
    aborted: false,
    candidates: [],
    totalEvaluatedChunks: 0,
    totalRawCandidates: 0,
  };

  if (capability.capabilities.deterministicCandidates) {
    candidateData = generateDeterministicCandidates({
      worldSeedLong: seedInfo.worldSeedLong,
      edition: request.edition,
      version: request.version,
      origin,
      radiusChunks,
      selectedOres: request.selectedOres,
      advanced: request.advanced || {},
      onProgress: hooks.onProgress,
      shouldAbort: hooks.shouldAbort,
    });

    if (candidateData.aborted) {
      return {
        ok: false,
        aborted: true,
        status: "cancelled",
        classification: capability.highestResultClassification,
        capability,
        validation,
        seedInfo: {
          ...seedInfo,
          worldSeedLong: undefined, // keep serializable across Worker boundary
        },
        origin,
        originChunk,
        boundaries,
        candidateResults: [],
        distributionResults: distributionData.results,
        distributionProfiles: distributionData.profiles,
        stats: {
          durationMs: Math.round(getNowMs() - startTimeMs),
          evaluatedChunks: candidateData.totalEvaluatedChunks,
          totalRawCandidates: candidateData.totalRawCandidates,
          returnedCandidates: 0,
        },
        error: "Search cancelled by user.",
      };
    }
  }

  const primaryClassification = capability.capabilities.deterministicCandidates
    ? RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE
    : RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE;

  return {
    ok: true,
    aborted: false,
    status: "completed",
    classification: primaryClassification,
    capability,
    validation,
    seedInfo: {
      rawInput: seedInfo.rawInput,
      normalizedInput: seedInfo.normalizedInput,
      inputType: seedInfo.inputType,
      worldSeedString: seedInfo.worldSeedString,
      hashCode32: seedInfo.hashCode32,
      edition: seedInfo.edition,
    },
    origin,
    originChunk,
    boundaries,
    candidateResults: candidateData.candidates,
    distributionResults: distributionData.results,
    distributionProfiles: distributionData.profiles,
    stats: {
      durationMs: Math.max(1, Math.round(getNowMs() - startTimeMs)),
      evaluatedChunks: capability.capabilities.deterministicCandidates
        ? candidateData.totalEvaluatedChunks
        : boundaries.totalChunks,
      totalRawCandidates: candidateData.totalRawCandidates,
      returnedCandidates: candidateData.candidates.length,
    },
    error: null,
  };
}
