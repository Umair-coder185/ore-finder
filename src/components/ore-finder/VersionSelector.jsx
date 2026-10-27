"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * Centralized Minecraft Version dropdown with explicit compatibility
 * metadata and unsupported-version handling.
 *
 * @param {Object} props
 * @param {string} props.version
 * @param {Array<Object>} props.versions
 * @param {Object} props.currentVersion
 * @param {function(string): void} props.onChange
 */
export function VersionSelector({ version, versions = [], currentVersion, onChange }) {
  const isSupported = Boolean(currentVersion?.isSupported);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="workspace-version-select"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4F7F4]"
        >
          <span>Minecraft Version</span>
          <Tooltip
            tone="dark"
            label="About Minecraft Version Compatibility"
            content="Caves & Cliffs Part II (1.18+) expanded vertical world bounds to Y = -64..319 and introduced triangular ore peaks."
          />
        </label>

        <span className="font-mono text-[11px] text-[#A8B8AF]">
          {currentVersion?.era || "1.18+ Strata"}
        </span>
      </div>

      <Select
        id="workspace-version-select"
        tone="dark"
        value={version}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby="workspace-version-compatibility"
      >
        {versions.map((ver) => (
          <option key={ver.value} value={ver.value} className="bg-[#1B2621] text-[#F4F7F4]">
            {ver.label}
          </option>
        ))}
      </Select>

      {/* Version Compatibility Banner */}
      <div
        id="workspace-version-compatibility"
        role={isSupported ? "status" : "alert"}
        className={
          isSupported
            ? "flex items-start gap-2 rounded-md border border-[#34443B] bg-[#111916] px-3 py-2 text-[11px] text-[#A8B8AF]"
            : "flex items-start gap-2 rounded-md border border-[#D5B77D]/60 bg-[#2C2416] px-3 py-2.5 text-xs text-[#F4F7F4]"
        }
      >
        {isSupported ? (
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#69C598]" aria-hidden="true" />
        ) : (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D5B77D]" aria-hidden="true" />
        )}
        <div className="leading-relaxed">
          <span className="font-semibold text-[#F4F7F4]">
            {isSupported ? "Compatible Profile: " : "Unsupported Version: "}
          </span>
          <span>{currentVersion?.compatibilityNote}</span>
        </div>
      </div>
    </div>
  );
}
