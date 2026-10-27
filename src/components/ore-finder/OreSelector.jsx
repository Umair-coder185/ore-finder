"use client";

import {
  CheckCircle2,
  Circle,
  Diamond,
  Layers,
  Sparkles,
  Hexagon,
  Flame,
  Box,
  CheckSquare,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Maps an ore's iconType to a subtle, tasteful vector icon.
 * @param {string} iconType
 */
function getOreIconComponent(iconType) {
  switch (iconType) {
    case "gem":
      return Diamond;
    case "crystal":
      return Hexagon;
    case "dust":
      return Flame;
    case "cluster":
      return Sparkles;
    case "ingot":
      return Layers;
    default:
      return Box;
  }
}

/**
 * Responsive grid of selectable ore cards with understated iconography.
 * Does not rely on color alone to communicate selection state (uses explicit
 * checkmarks, border weight, and "Selected" / "Off" state labels).
 *
 * @param {Object} props
 * @param {Array<Object>} props.ores
 * @param {Array<string>} props.selectedOres
 * @param {function(string): void} props.onToggleOre
 * @param {function(): void} props.onSelectAll
 * @param {function(): void} props.onClearAll
 * @param {string} [props.error]
 */
export function OreSelector({
  ores = [],
  selectedOres = [],
  onToggleOre,
  onSelectAll,
  onClearAll,
  error,
}) {
  const allSelected = ores.length > 0 && ores.every((o) => selectedOres.includes(o.id));

  return (
    <fieldset className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <legend className="text-xs font-semibold text-[#F4F7F4]">
          Target Ore Selection ({selectedOres.length} of {ores.length} active)
        </legend>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={allSelected ? onClearAll : onSelectAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#69C598] transition-colors hover:text-[#57B386] cursor-pointer"
          >
            {allSelected ? (
              <>
                <Square className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear All</span>
              </>
            ) : (
              <>
                <CheckSquare className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Select All 8 Ores</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {ores.map((ore) => {
          const isSelected = selectedOres.includes(ore.id);
          const IconComponent = getOreIconComponent(ore.iconType);
          const inputId = `workspace-ore-card-${ore.id}`;

          return (
            <label
              key={ore.id}
              htmlFor={inputId}
              className={cn(
                "group relative flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3 transition-colors select-none",
                isSelected
                  ? "border-[#69C598] bg-[#25332C] text-[#F4F7F4]"
                  : "border-[#34443B] bg-[#111916] text-[#A8B8AF] hover:border-[#465B4F] hover:text-[#F4F7F4]"
              )}
            >
              <input
                id={inputId}
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleOre(ore.id)}
                className="sr-only"
              />

              <div className="flex items-start gap-2.5">
                {/* Mineral Icon Badge */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                    isSelected
                      ? "border-[#69C598]/40 bg-[#111916]"
                      : "border-[#34443B] bg-[#1B2621]"
                  )}
                >
                  <IconComponent className="h-4 w-4" style={{ color: ore.swatchColor }} />
                </span>

                <div className="flex flex-col leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#F4F7F4]">{ore.shortName}</span>
                    <span className="rounded bg-[#111916] px-1.5 py-0.5 font-mono text-[10px] text-[#A8B8AF]">
                      {ore.symbol}
                    </span>
                  </div>
                  <span className="mt-1 font-mono text-[11px] text-[#A8B8AF]">
                    Peak {ore.optimalElevation}
                  </span>
                </div>
              </div>

              {/* Explicit Non-Color Selection Indicator */}
              <div className="flex shrink-0 items-center gap-1">
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#69C598]/40 bg-[#69C598]/15 px-2 py-0.5 text-[10px] font-semibold text-[#69C598]">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    <span>On</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#34443B] bg-[#1B2621] px-2 py-0.5 text-[10px] font-medium text-[#76887E]">
                    <Circle className="h-3 w-3" aria-hidden="true" />
                    <span>Off</span>
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-[#F28B82]">
          {error}
        </p>
      )}
    </fieldset>
  );
}
