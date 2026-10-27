"use client";

import {
  Compass,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Square,
  Loader2,
  BarChart3,
} from "lucide-react";
import { WORKSPACE_STATUS } from "@/features/ore-finder/types";
import { Button } from "@/components/ui/Button";

/**
 * Primary Search Action & Execution Control Component (Phase 03).
 *
 * Connects the workspace configuration to the verified Phase 03 engine:
 * - For Java 1.18–1.21 (`deterministicCandidates: true`): Runs deterministic
 *   Xoroshiro128++ candidate search + distribution guidance.
 * - For Bedrock 1.18–1.21 (`distribution: true`, `deterministicCandidates: false`):
 *   Runs verified distribution guidance without pretending to search exact XYZ coordinates.
 * - Supports live progress reporting and search cancellation.
 *
 * @param {Object} props
 * @param {string} props.status
 * @param {Object} props.validation
 * @param {Object} props.capability
 * @param {Object} props.searchState
 * @param {function(): void} props.onRunSearch
 * @param {function(): void} props.onCancelSearch
 * @param {function(): void} props.onResetAll
 */
export function SearchAction({
  status,
  validation,
  capability,
  searchState,
  onRunSearch,
  onCancelSearch,
  onResetAll,
}) {
  const isUnsupported = status === WORKSPACE_STATUS.UNSUPPORTED_VERSION;
  const isInvalid = status === WORKSPACE_STATUS.INVALID_INPUT;
  const isSearching = Boolean(searchState?.isSearching);
  const canExecute = !isUnsupported && !isInvalid && !isSearching;

  const supportsCandidates = Boolean(capability?.capabilities?.deterministicCandidates);

  const progressPercent =
    searchState?.progress?.totalChunks > 0
      ? Math.min(
          100,
          Math.round(
            (searchState.progress.processedChunks / searchState.progress.totalChunks) * 100
          )
        )
      : 0;

  return (
    <div className="space-y-3 pt-1">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        {isSearching ? (
          <Button
            type="button"
            variant="workspace-secondary"
            size="lg"
            onClick={onCancelSearch}
            className="flex-1 border-[#D96B6B] text-[#F28B82] hover:bg-[#2C1A1A]"
          >
            <Square className="h-4 w-4 fill-current" aria-hidden="true" />
            <span>Cancel Search ({progressPercent}%)</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="workspace-primary"
            size="lg"
            disabled={!canExecute}
            aria-disabled={!canExecute}
            aria-describedby="search-action-status-message"
            onClick={() => onRunSearch()}
            className="flex-1"
          >
            {supportsCandidates ? (
              <Compass className="h-4 w-4" aria-hidden="true" />
            ) : (
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
            )}
            <span>
              {isUnsupported
                ? "Unsupported Minecraft Version"
                : isInvalid
                  ? "Resolve Input Validation Issues"
                  : supportsCandidates
                    ? "Analyze Deterministic Candidates & Strata"
                    : "Update Verified Distribution Guidance"}
            </span>
          </Button>
        )}

        <Button
          type="button"
          variant="workspace-secondary"
          size="lg"
          onClick={onResetAll}
          className="shrink-0"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Live Progress Bar During Calculation */}
      {isSearching && (
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="space-y-1.5 rounded-lg border border-[#34443B] bg-[#111916] p-3"
        >
          <div className="flex items-center justify-between text-xs text-[#F4F7F4]">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#69C598]" aria-hidden="true" />
              <span>Evaluating Chunk Decoration Seeds...</span>
            </span>
            <span className="font-mono text-[#69C598]">
              {searchState.progress.processedChunks} / {searchState.progress.totalChunks} chunks (
              {progressPercent}%)
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#25332C]">
            <div
              className="h-full bg-[#69C598] transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Honest Capability & Validation Banner */}
      <div
        id="search-action-status-message"
        role="status"
        aria-live="polite"
        className={
          isUnsupported
            ? "rounded-lg border border-[#D5B77D]/60 bg-[#2C2416] p-3.5 text-xs text-[#F4F7F4]"
            : isInvalid
              ? "rounded-lg border border-[#D96B6B]/60 bg-[#2C1A1A] p-3.5 text-xs text-[#F4F7F4]"
              : "rounded-lg border border-[#34443B] bg-[#111916] p-3.5 text-xs text-[#A8B8AF]"
        }
      >
        {isUnsupported ? (
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D5B77D]" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-semibold text-[#F4F7F4]">
                Unsupported Version Configuration (Classification: UNSUPPORTED)
              </p>
              <p className="leading-relaxed text-[#A8B8AF]">
                {validation.versionMeta?.compatibilityNote ||
                  "Select a supported Minecraft 1.18–1.21 release to run analysis."}
              </p>
            </div>
          </div>
        ) : isInvalid ? (
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#F28B82]" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-semibold text-[#F4F7F4]">
                Configuration Requires Attention ({validation.issues.length}{" "}
                {validation.issues.length === 1 ? "issue" : "issues"})
              </p>
              <ul className="list-disc space-y-0.5 pl-4 text-[#F28B82]">
                {validation.issues.map((issue) => (
                  <li key={issue.field}>{issue.message}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#69C598]" aria-hidden="true" />
            <div className="space-y-1 leading-relaxed">
              <p className="font-semibold text-[#F4F7F4]">
                {supportsCandidates
                  ? "Active Mode: Deterministic Candidate & Distribution Analysis"
                  : "Active Mode: Verified Distribution Guidance (Bedrock Edition)"}
              </p>
              <p>
                {supportsCandidates
                  ? "Computes reproducible Xoroshiro128++ chunk placement candidates alongside verified Y-level distribution curves. Candidates are never misrepresented as guaranteed blocks."
                  : "Bedrock Edition uses C++ MT19937 decoration ordering; this workspace provides verified Y-level distribution curves and mining elevations without fabricating cross-edition XYZ coordinates."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
