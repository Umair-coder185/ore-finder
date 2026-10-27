"use client";

import { Layers, AlertTriangle, AlertCircle, RotateCcw } from "lucide-react";
import { WORKSPACE_STATUS } from "@/features/ore-finder/types";
import { Button } from "@/components/ui/Button";

/**
 * Empty-state / Error-state visual treatment inside the Results Workspace.
 * Communicates clearly and truthfully when an unsupported version is selected,
 * when inputs are invalid, or when a search yields zero candidates in the current filter.
 *
 * @param {Object} props
 * @param {string} props.status
 * @param {Object} props.validation
 * @param {function(): void} props.onResetAll
 * @param {string} [props.message]
 */
export function EmptyResults({ status, validation, onResetAll, message }) {
  const isUnsupported = status === WORKSPACE_STATUS.UNSUPPORTED_VERSION;
  const isInvalid = status === WORKSPACE_STATUS.INVALID_INPUT;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#34443B] bg-[#111916]/85 px-6 py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#34443B] bg-[#1B2621] text-[#69C598]">
        {isUnsupported ? (
          <AlertTriangle className="h-5 w-5 text-[#D5B77D]" aria-hidden="true" />
        ) : isInvalid ? (
          <AlertCircle className="h-5 w-5 text-[#F28B82]" aria-hidden="true" />
        ) : (
          <Layers className="h-5 w-5 text-[#69C598]" aria-hidden="true" />
        )}
      </div>

      <span className="rounded-full border border-[#34443B] bg-[#1B2621] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#A8B8AF]">
        {isUnsupported
          ? "Classification: UNSUPPORTED"
          : isInvalid
            ? "Validation Required"
            : "0 Matching Candidates in Current Filter"}
      </span>

      <h4 className="mt-3 font-heading text-base font-bold text-[#F4F7F4] sm:text-lg">
        {isUnsupported
          ? "Selected Release Version Is Not Supported for 1.18+ Analysis"
          : isInvalid
            ? "Complete Required Search Configuration Fields"
            : "No Candidate Origins Match the Current Filter"}
      </h4>

      <p className="mt-1.5 max-w-lg text-xs sm:text-sm leading-relaxed text-[#A8B8AF]">
        {message
          ? message
          : isUnsupported
            ? validation.versionMeta?.compatibilityNote ||
              "Switch to a supported Minecraft 1.18–1.21 release to inspect modern Deepslate and Overworld distribution strata."
            : isInvalid
              ? "Correct the highlighted seed, coordinate, radius, or ore selection fields on the left to run world analysis."
              : "Adjust your ore filter, increase the chunk search radius, or enable biome-restricted placement batches in Advanced Options."}
      </p>

      {(isUnsupported || isInvalid) && (
        <div className="mt-4">
          <Button type="button" variant="workspace-secondary" size="sm" onClick={onResetAll}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Restore Default Supported Configuration</span>
          </Button>
        </div>
      )}
    </div>
  );
}
