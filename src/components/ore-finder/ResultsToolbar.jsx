"use client";

import { Copy, Check, Filter, ArrowUpDown, MapPin, Ruler, Layers, Cpu } from "lucide-react";
import { SORT_PREFERENCE_OPTIONS } from "@/features/ore-finder/config/editions";
import { Select } from "@/components/ui/Select";

/**
 * Results Workspace Toolbar (Section 13).
 *
 * Displays:
 * - Classification-accurate result count badge (`Deterministic Candidates` vs `Distribution Profiles`)
 * - Ore type filter
 * - Sort controls
 * - Origin coordinate & scan distance display
 * - Copy origin coordinate (`/tp`) action
 */
export function ResultsToolbar({
  selectedOreObjects = [],
  activeOreFilter,
  onChangeOreFilter,
  sortPreference,
  onChangeSort,
  coordinates,
  footprint,
  copiedState,
  onCopyOrigin,
  supportsCandidates = false,
  candidateCount = 0,
  distributionCount = 0,
  stats = null,
}) {
  const radiusMeters = (Number(footprint?.radiusChunks) || 8) * 16;

  return (
    <div className="space-y-3 border-b border-[#34443B] bg-[#111916] p-4 sm:px-5">
      {/* Top Row: Result Count, Origin Coordinate Display, Distance Display, Copy Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#34443B] bg-[#1B2621] px-2.5 py-1 font-mono text-xs font-semibold text-[#F4F7F4]">
            <Layers className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
            <span>
              {supportsCandidates
                ? `${candidateCount} Deterministic Candidates`
                : `${distributionCount} Distribution Profiles`}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#34443B] bg-[#1B2621] px-2.5 py-1 font-mono text-xs text-[#A8B8AF]">
            <MapPin className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
            <span>
              Origin: X={coordinates.x || 0}, Y={coordinates.y || 0}, Z=
              {coordinates.z || 0}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#34443B] bg-[#1B2621] px-2.5 py-1 font-mono text-xs text-[#A8B8AF]">
            <Ruler className="h-3.5 w-3.5 text-[#D5B77D]" aria-hidden="true" />
            <span>
              Radius: {radiusMeters}m ({footprint.radiusChunks} chunks)
            </span>
          </span>

          {stats && stats.evaluatedChunks > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#34443B] bg-[#1B2621] px-2.5 py-1 font-mono text-[11px] text-[#76887E]">
              <Cpu className="h-3 w-3 text-[#69C598]" aria-hidden="true" />
              <span>
                {stats.evaluatedChunks} chunks
                {typeof stats.durationMs === "number" ? ` \u2022 ${stats.durationMs}ms` : ""}
              </span>
            </span>
          )}
        </div>

        {/* Copy Origin /tp Coordinate Action */}
        <button
          type="button"
          onClick={onCopyOrigin}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#34443B] bg-[#25332C] px-3 py-1.5 text-xs font-semibold text-[#F4F7F4] transition-colors hover:border-[#69C598] hover:bg-[#2C3D35] cursor-pointer"
        >
          {copiedState ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
              <span className="text-[#69C598]">Copied /tp Command</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-[#A8B8AF]" aria-hidden="true" />
              <span>Copy Origin /tp</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Row: Ore Type Filter & Sort Controls */}
      <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <label
            htmlFor="results-toolbar-ore-filter"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#A8B8AF]"
          >
            <Filter className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
            <span>Ore Filter:</span>
          </label>
          <Select
            id="results-toolbar-ore-filter"
            tone="dark"
            value={activeOreFilter}
            onChange={(e) => onChangeOreFilter(e.target.value)}
            className="h-9 py-1 text-xs"
          >
            <option value="all" className="bg-[#1B2621] text-[#F4F7F4]">
              All Selected Ores ({selectedOreObjects.length})
            </option>
            {selectedOreObjects.map((ore) => (
              <option key={ore.id} value={ore.id} className="bg-[#1B2621] text-[#F4F7F4]">
                {ore.name} ({ore.optimalElevation})
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="results-toolbar-sort-select"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#A8B8AF]"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
            <span>Sort By:</span>
          </label>
          <Select
            id="results-toolbar-sort-select"
            tone="dark"
            value={sortPreference}
            onChange={(e) => onChangeSort(e.target.value)}
            options={SORT_PREFERENCE_OPTIONS}
            className="h-9 py-1 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
