"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  EDITIONS,
  DIMENSIONS,
  WORKSPACE_STATUS,
  RADIUS_MODES,
  RADIUS_LIMITS,
} from "../types/index.js";
import {
  EDITION_OPTIONS,
  VERSION_GROUPS,
  SEARCH_RADIUS_PRESETS,
  ADVANCED_OPTIONS_DEFAULTS,
} from "../config/editions.js";
import { getSupportedOres } from "../config/ores.js";
import { validateOreSearchInputs } from "../validation/validateInputs.js";
import { blockToChunkCoordinates, calculateSearchFootprint } from "../utils/coordinates.js";
import { getVersionCapability } from "../engine/compatibility/capabilityRegistry.js";
import { executeOreAnalysisSearch } from "../engine/search/searchOrchestrator.js";
import { sortCoordinateResults } from "../engine/coordinates/coordinateEngine.js";
import { formatTeleportCommand } from "../utils/formatting.js";
import { resolveWorldSeed } from "../engine/seed/seedEngine.js";

export const INITIAL_WORKSPACE_STATE = {
  edition: EDITIONS.JAVA,
  version: "java-1.21",
  dimension: DIMENSIONS.OVERWORLD,
  seed: "-4172144997902289642",
  x: "128",
  y: "-54",
  z: "-256",
  radiusMode: RADIUS_MODES.PRESET,
  radiusChunks: RADIUS_LIMITS.DEFAULT_CHUNKS,
  selectedOres: ["diamond", "iron", "gold", "redstone", "lapis"],
  advanced: { ...ADVANCED_OPTIONS_DEFAULTS },
};

/**
 * Primary hook orchestrating UI state, capability resolution, Web Worker execution,
 * progress reporting, cancellation, and result filtering/sorting.
 */
export function useOreSearch() {
  const [config, setConfig] = useState(INITIAL_WORKSPACE_STATE);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [activeResultsOreFilter, setActiveResultsOreFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [pasteNotice, setPasteNotice] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [visibleLimit, setVisibleLimit] = useState(24);

  // Search execution state
  const [searchState, setSearchState] = useState(() => {
    const initialResponse = executeOreAnalysisSearch(INITIAL_WORKSPACE_STATE);
    if (initialResponse?.stats) {
      // Omit runtime durationMs from the SSR/hydration snapshot so server and client text match 100%
      initialResponse.stats.durationMs = null;
    }
    return {
      isSearching: false,
      progress: {
        processedChunks: initialResponse.stats?.evaluatedChunks || 0,
        totalChunks: initialResponse.stats?.evaluatedChunks || 0,
      },
      response: initialResponse,
      lastError: null,
    };
  });

  const workerRef = useRef(null);
  const activeJobIdRef = useRef(0);

  const allOres = useMemo(() => getSupportedOres(), []);

  const availableVersions = useMemo(
    () => VERSION_GROUPS[config.edition] || VERSION_GROUPS[EDITIONS.JAVA],
    [config.edition]
  );

  const currentEdition = useMemo(
    () => EDITION_OPTIONS.find((e) => e.id === config.edition) || EDITION_OPTIONS[0],
    [config.edition]
  );

  const currentVersion = useMemo(
    () => availableVersions.find((v) => v.value === config.version) || availableVersions[0],
    [availableVersions, config.version]
  );

  const currentCapability = useMemo(
    () => getVersionCapability(config.edition, config.version),
    [config.edition, config.version]
  );

  const validation = useMemo(() => validateOreSearchInputs(config), [config]);

  const resolvedSeed = useMemo(
    () => resolveWorldSeed(config.seed, { edition: config.edition }),
    [config.seed, config.edition]
  );

  const workspaceStatus = useMemo(() => {
    if (!validation.isVersionSupported) {
      return WORKSPACE_STATUS.UNSUPPORTED_VERSION;
    }
    if (!validation.isValid) {
      return WORKSPACE_STATUS.INVALID_INPUT;
    }
    if (searchState.isSearching) {
      return WORKSPACE_STATUS.VALIDATING;
    }
    return WORKSPACE_STATUS.IDLE;
  }, [validation, searchState.isSearching]);

  const chunkInfo = useMemo(
    () => blockToChunkCoordinates(Number(config.x) || 0, Number(config.z) || 0),
    [config.x, config.z]
  );

  const footprint = useMemo(
    () => calculateSearchFootprint(Number(config.radiusChunks) || 8),
    [config.radiusChunks]
  );

  const selectedOreObjects = useMemo(
    () => allOres.filter((ore) => config.selectedOres.includes(ore.id)),
    [allOres, config.selectedOres]
  );

  const filteredOreObjects = useMemo(() => {
    if (activeResultsOreFilter === "all") return selectedOreObjects;
    return selectedOreObjects.filter((ore) => ore.id === activeResultsOreFilter);
  }, [selectedOreObjects, activeResultsOreFilter]);

  // Filter and sort candidate results from the latest search response
  const filteredCandidates = useMemo(() => {
    const raw = searchState.response?.candidateResults || [];
    const byOre =
      activeResultsOreFilter === "all"
        ? raw
        : raw.filter((item) => item.ore === activeResultsOreFilter);
    return sortCoordinateResults(byOre, config.advanced.sortPreference);
  }, [searchState.response, activeResultsOreFilter, config.advanced.sortPreference]);

  const paginatedCandidates = useMemo(
    () => filteredCandidates.slice(0, visibleLimit),
    [filteredCandidates, visibleLimit]
  );

  const distributionProfiles = useMemo(() => {
    const profiles = searchState.response?.distributionProfiles || [];
    if (activeResultsOreFilter === "all") return profiles;
    return profiles.filter((p) => p.oreId === activeResultsOreFilter);
  }, [searchState.response, activeResultsOreFilter]);

  // Execute search via Web Worker with graceful synchronous fallback
  const runSearch = useCallback(
    (overrideConfig) => {
      const targetConfig = overrideConfig || config;
      const checkValidation = validateOreSearchInputs(targetConfig);
      const cap = getVersionCapability(targetConfig.edition, targetConfig.version);

      if (!cap.capabilities.distribution || !checkValidation.isValid) {
        const syncResult = executeOreAnalysisSearch(targetConfig);
        setSearchState({
          isSearching: false,
          progress: { processedChunks: 0, totalChunks: 0 },
          response: syncResult,
          lastError: syncResult.error,
        });
        return;
      }

      const jobId = activeJobIdRef.current + 1;
      activeJobIdRef.current = jobId;
      setVisibleLimit(24);
      setSelectedCandidateId(null);

      const expectedFootprint = calculateSearchFootprint(Number(targetConfig.radiusChunks) || 8);

      setSearchState((prev) => ({
        ...prev,
        isSearching: true,
        progress: {
          processedChunks: 0,
          totalChunks: expectedFootprint.totalChunks,
        },
        lastError: null,
      }));

      // Attempt Web Worker execution
      try {
        if (typeof window !== "undefined" && typeof Worker !== "undefined") {
          if (!workerRef.current) {
            workerRef.current = new Worker(
              new URL("../engine/workers/oreSearchWorker.js", import.meta.url),
              { type: "module" }
            );
          }

          const worker = workerRef.current;

          worker.onmessage = (event) => {
            const data = event.data || {};
            if (data.jobId !== activeJobIdRef.current) return;

            if (data.type === "SEARCH_PROGRESS") {
              setSearchState((prev) => ({
                ...prev,
                progress: {
                  processedChunks: data.processedChunks,
                  totalChunks: data.totalChunks,
                },
              }));
            } else if (data.type === "SEARCH_COMPLETE") {
              setSearchState({
                isSearching: false,
                progress: {
                  processedChunks:
                    data.response?.stats?.evaluatedChunks || expectedFootprint.totalChunks,
                  totalChunks: expectedFootprint.totalChunks,
                },
                response: data.response,
                lastError: data.response?.error || null,
              });
            } else if (data.type === "SEARCH_ERROR") {
              // Fallback to synchronous execution on worker error
              const fallbackResponse = executeOreAnalysisSearch(targetConfig);
              setSearchState({
                isSearching: false,
                progress: {
                  processedChunks: fallbackResponse.stats?.evaluatedChunks || 0,
                  totalChunks: expectedFootprint.totalChunks,
                },
                response: fallbackResponse,
                lastError: null,
              });
            }
          };

          worker.onerror = () => {
            const fallbackResponse = executeOreAnalysisSearch(targetConfig);
            setSearchState({
              isSearching: false,
              progress: {
                processedChunks: fallbackResponse.stats?.evaluatedChunks || 0,
                totalChunks: expectedFootprint.totalChunks,
              },
              response: fallbackResponse,
              lastError: null,
            });
          };

          worker.postMessage({
            type: "START_SEARCH",
            jobId,
            payload: targetConfig,
          });
          return;
        }
      } catch {
        // Graceful fallback if Worker construction is disallowed in current environment
      }

      const syncResponse = executeOreAnalysisSearch(targetConfig);
      setSearchState({
        isSearching: false,
        progress: {
          processedChunks: syncResponse.stats?.evaluatedChunks || 0,
          totalChunks: expectedFootprint.totalChunks,
        },
        response: syncResponse,
        lastError: syncResponse.error,
      });
    },
    [config]
  );

  const cancelSearch = useCallback(() => {
    const currentJob = activeJobIdRef.current;
    activeJobIdRef.current += 1;
    if (workerRef.current) {
      try {
        workerRef.current.postMessage({
          type: "CANCEL_SEARCH",
          jobId: currentJob,
        });
      } catch {
        // ignore
      }
    }
    setSearchState((prev) => ({
      ...prev,
      isSearching: false,
      lastError: "Search cancelled by user.",
    }));
  }, []);

  // Updaters
  const setSeed = useCallback((value) => {
    setPasteNotice("");
    setConfig((prev) => ({ ...prev, seed: value }));
  }, []);

  const clearSeed = useCallback(() => {
    setPasteNotice("");
    setConfig((prev) => ({ ...prev, seed: "" }));
  }, []);

  const pasteSeed = useCallback(async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setConfig((prev) => ({ ...prev, seed: text.trim().slice(0, 100) }));
          setPasteNotice("Seed pasted from clipboard.");
          return;
        }
      }
      setPasteNotice("Clipboard empty or permission unavailable — use Ctrl+V / Cmd+V.");
    } catch {
      setPasteNotice("Press Ctrl+V (or Cmd+V) inside the seed field to paste.");
    }
  }, []);

  const setEdition = useCallback((nextEdition) => {
    const nextVersions = VERSION_GROUPS[nextEdition] || [];
    const nextVersion = nextVersions[0]?.value || "java-1.21";
    setConfig((prev) => {
      const updated = {
        ...prev,
        edition: nextEdition,
        version: nextVersion,
      };
      const syncResult = executeOreAnalysisSearch(updated);
      setSearchState({
        isSearching: false,
        progress: {
          processedChunks: syncResult.stats?.evaluatedChunks || 0,
          totalChunks: syncResult.stats?.evaluatedChunks || 0,
        },
        response: syncResult,
        lastError: syncResult.error,
      });
      return updated;
    });
  }, []);

  const setVersion = useCallback((nextVersion) => {
    setConfig((prev) => {
      const updated = { ...prev, version: nextVersion };
      const syncResult = executeOreAnalysisSearch(updated);
      setSearchState({
        isSearching: false,
        progress: {
          processedChunks: syncResult.stats?.evaluatedChunks || 0,
          totalChunks: syncResult.stats?.evaluatedChunks || 0,
        },
        response: syncResult,
        lastError: syncResult.error,
      });
      return updated;
    });
  }, []);

  const setCoordinate = useCallback((axis, value) => {
    setConfig((prev) => ({ ...prev, [axis]: value }));
  }, []);

  const setPresetRadius = useCallback((chunks) => {
    setConfig((prev) => ({
      ...prev,
      radiusMode: RADIUS_MODES.PRESET,
      radiusChunks: Number(chunks),
    }));
  }, []);

  const setCustomRadius = useCallback((value) => {
    const parsed = value === "" ? "" : Number(value);
    setConfig((prev) => ({
      ...prev,
      radiusMode: RADIUS_MODES.CUSTOM,
      radiusChunks: parsed,
    }));
  }, []);

  const enableCustomRadiusMode = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      radiusMode: RADIUS_MODES.CUSTOM,
    }));
  }, []);

  const toggleOre = useCallback((oreId) => {
    setConfig((prev) => {
      const exists = prev.selectedOres.includes(oreId);
      const nextSelected = exists
        ? prev.selectedOres.filter((id) => id !== oreId)
        : [...prev.selectedOres, oreId];
      return {
        ...prev,
        selectedOres: nextSelected,
      };
    });
    setActiveResultsOreFilter("all");
  }, []);

  const selectAllOres = useCallback(() => {
    const allIds = allOres.map((o) => o.id);
    setConfig((prev) => ({ ...prev, selectedOres: allIds }));
  }, [allOres]);

  const clearAllOres = useCallback(() => {
    setConfig((prev) => ({ ...prev, selectedOres: [] }));
    setActiveResultsOreFilter("all");
  }, []);

  const updateAdvancedOption = useCallback((key, value) => {
    setConfig((prev) => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [key]: value,
      },
    }));
  }, []);

  const resetAdvancedOptions = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      advanced: { ...ADVANCED_OPTIONS_DEFAULTS },
    }));
  }, []);

  const resetAllConfiguration = useCallback(() => {
    setConfig(INITIAL_WORKSPACE_STATE);
    setActiveResultsOreFilter("all");
    setPasteNotice("");
    setSelectedCandidateId(null);
    setVisibleLimit(24);
    const syncResponse = executeOreAnalysisSearch(INITIAL_WORKSPACE_STATE);
    setSearchState({
      isSearching: false,
      progress: {
        processedChunks: syncResponse.stats?.evaluatedChunks || 0,
        totalChunks: syncResponse.stats?.evaluatedChunks || 0,
      },
      response: syncResponse,
      lastError: null,
    });
  }, []);

  const copyCoordinates = useCallback(async (id, x, y, z) => {
    const cmd = formatTeleportCommand(x, y, z);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(cmd);
      }
    } catch {
      // ignore clipboard errors in restricted environments
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
  }, []);

  const copyOriginTeleportCommand = useCallback(async () => {
    await copyCoordinates("origin", config.x, config.y, config.z);
  }, [copyCoordinates, config.x, config.y, config.z]);

  const copyCandidateTeleportCommand = useCallback(
    async (cand) => {
      if (!cand || cand.x === null) return;
      await copyCoordinates(cand.id, cand.x, cand.y, cand.z);
    },
    [copyCoordinates]
  );

  const selectedCandidate = useMemo(() => {
    if (!selectedCandidateId) return filteredCandidates[0] || null;
    return (
      filteredCandidates.find((c) => c.id === selectedCandidateId) || filteredCandidates[0] || null
    );
  }, [selectedCandidateId, filteredCandidates]);

  const showMoreCandidates = useCallback(() => {
    setVisibleLimit((prev) => prev + 24);
  }, []);

  return {
    config,
    allOres,
    availableVersions,
    currentEdition,
    currentVersion,
    currentCapability,
    validation,
    resolvedSeed,
    workspaceStatus,
    chunkInfo,
    footprint,
    selectedOreObjects,
    filteredOreObjects,
    isAdvancedOpen,
    setIsAdvancedOpen,
    activeResultsOreFilter,
    setActiveResultsOreFilter,
    copiedState: copiedId === "origin",
    copiedId,
    copiedCandidateId: copiedId,
    pasteNotice,
    presets: SEARCH_RADIUS_PRESETS,
    searchState,
    searchResult: searchState.response,
    filteredCandidates,
    paginatedCandidates,
    hasMoreCandidates: filteredCandidates.length > visibleLimit,
    distributionProfiles,
    selectedCandidate,
    selectedCandidateId,
    setSelectedCandidateId,
    visibleLimit,
    actions: {
      setSeed,
      clearSeed,
      pasteSeed,
      setEdition,
      setVersion,
      setCoordinate,
      setPresetRadius,
      setCustomRadius,
      enableCustomRadiusMode,
      toggleOre,
      selectAllOres,
      clearAllOres,
      updateAdvancedOption,
      resetAdvancedOptions,
      resetAllConfiguration,
      runSearch,
      cancelSearch,
      copyCoordinates,
      copyOriginTeleportCommand,
      copyCandidateTeleportCommand,
      showMoreCandidates,
    },
  };
}
