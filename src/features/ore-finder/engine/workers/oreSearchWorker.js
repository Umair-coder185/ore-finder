import { executeOreAnalysisSearch } from "../search/searchOrchestrator.js";

/**
 * Web Worker entry point for off-main-thread OreFinder.io computation.
 * Supports progress messages and cooperative cancellation.
 */
let cancelledJobId = null;

self.addEventListener("message", (event) => {
  const { type, jobId, payload } = event.data || {};

  if (type === "CANCEL_SEARCH") {
    cancelledJobId = jobId;
    return;
  }

  if (type === "START_SEARCH") {
    try {
      const response = executeOreAnalysisSearch(payload, {
        onProgress: ({ processedChunks, totalChunks }) => {
          self.postMessage({
            type: "SEARCH_PROGRESS",
            jobId,
            processedChunks,
            totalChunks,
          });
        },
        shouldAbort: () => cancelledJobId === jobId,
      });

      self.postMessage({
        type: "SEARCH_COMPLETE",
        jobId,
        response,
      });
    } catch (err) {
      self.postMessage({
        type: "SEARCH_ERROR",
        jobId,
        error: err instanceof Error ? err.message : "Worker execution failed.",
      });
    }
  }
});
