"use client";

import { Compass } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * Player X, Y, Z coordinate inputs with numeric validation,
 * helpful labels, and live chunk/region telemetry readout.
 *
 * @param {Object} props
 * @param {string} props.x
 * @param {string} props.y
 * @param {string} props.z
 * @param {function(string, string): void} props.onChange
 * @param {Record<string, string>} [props.fieldErrors]
 * @param {Object} props.chunkInfo
 * @param {Object} [props.yBounds]
 */
export function CoordinateInputs({
  x,
  y,
  z,
  onChange,
  fieldErrors = {},
  chunkInfo,
  yBounds = { min: -64, max: 319 },
}) {
  return (
    <fieldset className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <legend className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4F7F4]">
          <Compass className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
          <span>Player Coordinates (Block Origin)</span>
          <Tooltip
            tone="dark"
            label="About Player Coordinates"
            content="Press F3 in Java Edition (or enable Show Coordinates in Bedrock) to view your X (East/West), Y (Vertical elevation), and Z (North/South) position."
          />
        </legend>

        <span className="rounded border border-[#34443B] bg-[#111916] px-2 py-0.5 font-mono text-[11px] text-[#69C598]">
          Chunk [{chunkInfo.chunkX}, {chunkInfo.chunkZ}] &bull; r.{chunkInfo.regionX}.
          {chunkInfo.regionZ}.mca
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* X Coordinate */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <label htmlFor="coord-input-x" className="font-semibold text-[#F4F7F4]">
              X Coordinate
            </label>
            <span className="font-mono text-[#A8B8AF]">East / West</span>
          </div>
          <Input
            id="coord-input-x"
            tone="dark"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={x}
            hasError={Boolean(fieldErrors.x)}
            aria-describedby={fieldErrors.x ? "coord-x-error" : undefined}
            onChange={(e) => onChange("x", e.target.value)}
            className="font-mono text-xs sm:text-sm"
          />
          {fieldErrors.x && (
            <p id="coord-x-error" role="alert" className="text-[11px] font-medium text-[#F28B82]">
              {fieldErrors.x}
            </p>
          )}
        </div>

        {/* Y Coordinate */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <label htmlFor="coord-input-y" className="font-semibold text-[#F4F7F4]">
              Y Coordinate
            </label>
            <span className="font-mono text-[#A8B8AF]">
              Y: {yBounds.min}..{yBounds.max}
            </span>
          </div>
          <Input
            id="coord-input-y"
            tone="dark"
            type="number"
            inputMode="numeric"
            placeholder="-54"
            value={y}
            hasError={Boolean(fieldErrors.y)}
            aria-describedby={fieldErrors.y ? "coord-y-error" : undefined}
            onChange={(e) => onChange("y", e.target.value)}
            className="font-mono text-xs sm:text-sm"
          />
          {fieldErrors.y && (
            <p id="coord-y-error" role="alert" className="text-[11px] font-medium text-[#F28B82]">
              {fieldErrors.y}
            </p>
          )}
        </div>

        {/* Z Coordinate */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <label htmlFor="coord-input-z" className="font-semibold text-[#F4F7F4]">
              Z Coordinate
            </label>
            <span className="font-mono text-[#A8B8AF]">North / South</span>
          </div>
          <Input
            id="coord-input-z"
            tone="dark"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={z}
            hasError={Boolean(fieldErrors.z)}
            aria-describedby={fieldErrors.z ? "coord-z-error" : undefined}
            onChange={(e) => onChange("z", e.target.value)}
            className="font-mono text-xs sm:text-sm"
          />
          {fieldErrors.z && (
            <p id="coord-z-error" role="alert" className="text-[11px] font-medium text-[#F28B82]">
              {fieldErrors.z}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
