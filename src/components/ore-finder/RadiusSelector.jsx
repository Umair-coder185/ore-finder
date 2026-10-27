"use client";

import { Maximize2, Check } from "lucide-react";
import { RADIUS_MODES, RADIUS_LIMITS } from "@/features/ore-finder/types";
import { Input } from "@/components/ui/Input";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils/cn";

/**
 * Search Radius control with preset options, custom radius input,
 * validation within safe limits (1–32 chunks), and visible units.
 *
 * @param {Object} props
 * @param {string} props.radiusMode
 * @param {number | string} props.radiusChunks
 * @param {Array<Object>} props.presets
 * @param {Object} props.footprint
 * @param {function(number): void} props.onSelectPreset
 * @param {function(string): void} props.onChangeCustom
 * @param {function(): void} props.onEnableCustom
 * @param {string} [props.error]
 */
export function RadiusSelector({
  radiusMode,
  radiusChunks,
  presets = [],
  footprint,
  onSelectPreset,
  onChangeCustom,
  onEnableCustom,
  error,
}) {
  const isCustomMode = radiusMode === RADIUS_MODES.CUSTOM;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4F7F4]">
          <Maximize2 className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
          <span>Search Radius</span>
          <Tooltip
            tone="dark"
            label="About Search Radius"
            content="Sets the horizontal chunk radius around your origin chunk. 1 chunk = 16×16 blocks. Safe limits: 1 to 32 chunks."
          />
        </div>

        <span className="font-mono text-[11px] text-[#A8B8AF]">
          Area: {footprint.totalChunks} chunks ({footprint.diameterBlocks}m &times;{" "}
          {footprint.diameterBlocks}m)
        </span>
      </div>

      {/* Preset Options */}
      <div
        role="group"
        aria-label="Search radius presets"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {presets.map((preset) => {
          const isSelected = !isCustomMode && Number(radiusChunks) === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectPreset(preset.value)}
              className={cn(
                "flex flex-col items-start justify-between rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer",
                isSelected
                  ? "border-[#69C598] bg-[#25332C] text-[#F4F7F4]"
                  : "border-[#34443B] bg-[#111916] text-[#A8B8AF] hover:border-[#465B4F] hover:text-[#F4F7F4]"
              )}
            >
              <span className="flex w-full items-center justify-between gap-1 text-xs font-bold text-[#F4F7F4]">
                <span>{preset.label}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#69C598]" aria-hidden="true" />
                )}
              </span>
              <span className="mt-0.5 font-mono text-[10px] text-[#A8B8AF]">{preset.sublabel}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Radius Input Row */}
      <div className="flex flex-col gap-2 rounded-lg border border-[#34443B] bg-[#111916] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <label
            htmlFor="custom-radius-input"
            className="block text-xs font-semibold text-[#F4F7F4]"
          >
            Custom Radius ({RADIUS_LIMITS.MIN_CHUNKS}–{RADIUS_LIMITS.MAX_CHUNKS} Chunks)
          </label>
          <p className="text-[11px] text-[#A8B8AF]">
            1 chunk = 16 blocks &bull; Current radius:{" "}
            <span className="font-mono text-[#F4F7F4]">
              {(Number(radiusChunks) || 0) * 16} blocks
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-24">
            <Input
              id="custom-radius-input"
              tone="dark"
              type="number"
              min={RADIUS_LIMITS.MIN_CHUNKS}
              max={RADIUS_LIMITS.MAX_CHUNKS}
              step={1}
              value={radiusChunks}
              hasError={Boolean(error)}
              onFocus={onEnableCustom}
              onChange={(e) => onChangeCustom(e.target.value)}
              aria-describedby={error ? "radius-input-error" : undefined}
              className="h-9 text-center font-mono text-xs"
            />
          </div>
          <span className="font-mono text-xs font-medium text-[#A8B8AF]">chunks</span>
        </div>
      </div>

      {error && (
        <p id="radius-input-error" role="alert" className="text-xs font-medium text-[#F28B82]">
          {error}
        </p>
      )}
    </div>
  );
}
