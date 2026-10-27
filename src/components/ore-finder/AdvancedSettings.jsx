"use client";

import { ChevronDown, SlidersHorizontal, RotateCcw } from "lucide-react";
import {
  AIR_EXPOSURE_OPTIONS,
  ELEVATION_FOCUS_OPTIONS,
  SORT_PREFERENCE_OPTIONS,
} from "@/features/ore-finder/config/editions";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils/cn";

/**
 * Collapsible Advanced Search Options with version-aware controls,
 * clear descriptions, and Reset-to-Default functionality.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function(boolean): void} props.onToggleOpen
 * @param {Object} props.advanced
 * @param {Object} props.currentVersion
 * @param {function(string, any): void} props.onUpdateOption
 * @param {function(): void} props.onResetAdvanced
 */
export function AdvancedSettings({
  isOpen,
  onToggleOpen,
  advanced,
  currentVersion,
  onUpdateOption,
  onResetAdvanced,
}) {
  const isModernVersion = Boolean(currentVersion?.isSupported);

  return (
    <div className="rounded-xl border border-[#34443B] bg-[#111916]">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="workspace-advanced-settings-panel"
          onClick={() => onToggleOpen(!isOpen)}
          className="flex flex-1 items-center justify-between gap-2 text-left text-xs font-bold uppercase tracking-wider text-[#F4F7F4] transition-colors hover:text-[#69C598] cursor-pointer"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
            <span>Advanced Search Options</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-4 w-4 text-[#A8B8AF] transition-transform duration-200",
              isOpen && "rotate-180 text-[#69C598]"
            )}
          />
        </button>
      </div>

      {isOpen && (
        <div
          id="workspace-advanced-settings-panel"
          className="space-y-4 border-t border-[#34443B] px-4 pt-4 pb-4"
        >
          {/* Air-Exposure Filter Mode */}
          <div className="space-y-1.5">
            <label
              htmlFor="advanced-air-exposure"
              className="block text-xs font-semibold text-[#F4F7F4]"
            >
              Air-Exposure Discard Filter
            </label>
            <Select
              id="advanced-air-exposure"
              tone="dark"
              value={advanced.airExposureMode}
              onChange={(e) => onUpdateOption("airExposureMode", e.target.value)}
              options={AIR_EXPOSURE_OPTIONS}
            />
            <p className="text-[11px] leading-relaxed text-[#A8B8AF]">
              Controls whether analysis prioritizes buried Deepslate blobs (such as unexposed
              Diamond batches) or cave-adjacent veins.
            </p>
          </div>

          {/* Elevation Band Scope */}
          <div className="space-y-1.5">
            <label
              htmlFor="advanced-elevation-focus"
              className="block text-xs font-semibold text-[#F4F7F4]"
            >
              Vertical Stratum Scope
            </label>
            <Select
              id="advanced-elevation-focus"
              tone="dark"
              value={advanced.elevationFocus}
              onChange={(e) => onUpdateOption("elevationFocus", e.target.value)}
              options={ELEVATION_FOCUS_OPTIONS}
            />
            <p className="text-[11px] leading-relaxed text-[#A8B8AF]">
              Scopes vertical inspection to triangular peak altitudes or full world height (
              {currentVersion?.yBounds?.min ?? -64} to {currentVersion?.yBounds?.max ?? 319}).
            </p>
          </div>

          {/* Sort Preference */}
          <div className="space-y-1.5">
            <label
              htmlFor="advanced-sort-preference"
              className="block text-xs font-semibold text-[#F4F7F4]"
            >
              Default Result Sort Order
            </label>
            <Select
              id="advanced-sort-preference"
              tone="dark"
              value={advanced.sortPreference}
              onChange={(e) => onUpdateOption("sortPreference", e.target.value)}
              options={SORT_PREFERENCE_OPTIONS}
            />
          </div>

          {/* Version-Aware 1.18+ Mega-Vein Option */}
          <div className="space-y-1.5">
            <Checkbox
              id="advanced-large-veins"
              tone="dark"
              label="Include 1.18+ Procedural Large Ore Veins (Tuff-Iron & Granite-Copper)"
              description={
                isModernVersion
                  ? "Supported in 1.18–1.21: flags multi-chunk 3D noise ore vein channels alongside standard scatter blobs."
                  : "Unavailable in legacy pre-1.18 versions (procedural large ore veins were introduced in 1.18)."
              }
              checked={isModernVersion ? advanced.includeLargeNoiseVeins : false}
              disabled={!isModernVersion}
              onChange={(e) => onUpdateOption("includeLargeNoiseVeins", e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-between border-t border-[#34443B] pt-3">
            <span className="text-[11px] text-[#A8B8AF]">
              Version-aware rules synced to {currentVersion?.shortVersion || "1.21.x"}
            </span>
            <button
              type="button"
              onClick={onResetAdvanced}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#34443B] bg-[#1B2621] px-2.5 py-1 text-xs font-semibold text-[#A8B8AF] transition-colors hover:border-[#69C598]/50 hover:text-[#F4F7F4] cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>Reset Advanced to Default</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
