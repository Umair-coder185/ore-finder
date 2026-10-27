"use client";

import { useState } from "react";
import { BarChart3, Layers, ShieldAlert, Sparkles, Compass } from "lucide-react";

const SAMPLE_Y_LEVELS = [-64, -56, -48, -32, -16, 0, 16, 32, 48, 64, 96, 136, 160, 200, 232, 256];

/**
 * Interactive Y-Level Distribution Chart & Mining Guidance Visualization (Section 12.1).
 *
 * Renders the verified vanilla `placed_feature` elevation weight curves from Y = -64 to Y = 312,
 * highlights recommended mining bands, details placement batches (including version-specific batches
 * such as 1.20.2+ `ore_diamond_medium`), explains cave/air-exposure discard rules, and notes biome
 * modifiers.
 *
 * @param {Object} props
 * @param {Array<Object>} props.profiles - Output of `generateDistributionGuidance().profiles`
 * @param {string} props.activeOreFilter - Currently focused ore ID or `"all"`
 * @param {function(string): void} props.onSelectOre - Callback to focus an ore
 * @param {string} props.editionLabel
 * @param {string} props.versionLabel
 */
export function DistributionChart({
  profiles = [],
  activeOreFilter = "all",
  onSelectOre,
  editionLabel,
  versionLabel,
}) {
  const [selectedProfileOreId, setSelectedProfileOreId] = useState(null);

  if (!profiles || profiles.length === 0) {
    return null;
  }

  const effectiveOreId =
    activeOreFilter !== "all"
      ? activeOreFilter
      : selectedProfileOreId && profiles.some((p) => p.oreId === selectedProfileOreId)
        ? selectedProfileOreId
        : profiles[0].oreId;

  const activeProfile = profiles.find((p) => p.oreId === effectiveOreId) || profiles[0];

  // Sample points from the 377-level curve (-64..312) for clean responsive bar visualization
  const sampledPoints = SAMPLE_Y_LEVELS.map((y) => {
    const found = activeProfile.elevationCurve.find((pt) => pt.y === y);
    return found || { y, normalizedWeight: 0, rawWeight: 0 };
  });

  return (
    <div className="overflow-hidden rounded-xl border border-[#34443B] bg-[#111916]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#26332C] bg-[#1B2621]/75 px-4 py-3 text-xs">
        <div className="inline-flex items-center gap-2 font-semibold text-[#F4F7F4]">
          <BarChart3 className="h-4 w-4 text-[#69C598]" aria-hidden="true" />
          <span>Verified Y-Level Distribution &amp; Stratum Curve</span>
          <span className="rounded border border-[#D5B77D]/40 bg-[#D5B77D]/12 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#D5B77D]">
            PROBABILITY / DISTRIBUTION GUIDANCE
          </span>
        </div>

        <span className="font-mono text-[11px] text-[#A8B8AF]">
          {editionLabel} &bull; {versionLabel} ({activeProfile.versionBucket})
        </span>
      </div>

      {/* Ore Selector Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#26332C] bg-[#15201B] px-4 py-2.5">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[#76887E]">
          Inspect Stratum:
        </span>
        {profiles.map((profile) => {
          const isSelected = profile.oreId === activeProfile.oreId;
          return (
            <button
              key={profile.oreId}
              type="button"
              onClick={() => {
                setSelectedProfileOreId(profile.oreId);
                if (onSelectOre && activeOreFilter !== "all") {
                  onSelectOre(profile.oreId);
                }
              }}
              className={
                isSelected
                  ? "inline-flex items-center gap-1.5 rounded-md border border-[#69C598] bg-[#25332C] px-2.5 py-1 text-xs font-semibold text-[#F4F7F4] cursor-pointer"
                  : "inline-flex items-center gap-1.5 rounded-md border border-[#34443B] bg-[#111916] px-2.5 py-1 text-xs text-[#A8B8AF] hover:border-[#465B4F] hover:text-[#F4F7F4] cursor-pointer"
              }
            >
              <span
                className="h-2.5 w-2.5 rounded-xs"
                style={{ backgroundColor: profile.oreMeta.swatchColor }}
                aria-hidden="true"
              />
              <span>{profile.oreMeta.name}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {/* Recommended Mining Band Callout */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#34443B] bg-[#1B2621]/90 p-3.5 sm:grid-cols-3">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#A8B8AF]">
              Recommended Mining Band
            </span>
            <span className="mt-0.5 block font-mono text-sm font-bold text-[#69C598]">
              {activeProfile.recommendedBand.label}
            </span>
          </div>

          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#A8B8AF]">
              Peak Density Elevation
            </span>
            <span className="mt-0.5 block font-mono text-sm font-bold text-[#F4F7F4]">
              Y = {activeProfile.peakElevationY} ({activeProfile.oreMeta.optimalElevation})
            </span>
          </div>

          <div>
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#A8B8AF]">
              Placement Batches ({activeProfile.versionBucket})
            </span>
            <span className="mt-0.5 block font-mono text-sm font-bold text-[#D5B77D]">
              {activeProfile.batches.length} Vanilla Feature Passes
            </span>
          </div>
        </div>

        {/* Elevation Bar Chart (-63 to +256) */}
        <div className="rounded-xl border border-[#26332C] bg-[#15201B] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-[#F4F7F4]">
              Relative Feature Placement Density by Y-Level ({activeProfile.oreMeta.name})
            </span>
            <span className="font-mono text-[11px] text-[#A8B8AF]">
              Normalized 0–100 Relative Density Scale
            </span>
          </div>

          <div
            role="img"
            aria-label={`Y-level distribution chart for ${activeProfile.oreMeta.name} showing peak density around Y=${activeProfile.peakElevationY}`}
            className="grid grid-cols-8 gap-2 pt-2 sm:grid-cols-16"
          >
            {sampledPoints.map((pt) => {
              const isRecommended =
                pt.y >= activeProfile.recommendedBand.minY &&
                pt.y <= activeProfile.recommendedBand.maxY;
              const barHeightPct = Math.max(4, pt.normalizedWeight);

              return (
                <div
                  key={pt.y}
                  className="flex flex-col items-center"
                  title={`Y = ${pt.y}: ${pt.normalizedWeight}% relative placement density`}
                >
                  <span className="mb-1 font-mono text-[9px] text-[#A8B8AF]">
                    {pt.normalizedWeight}%
                  </span>
                  <div className="flex h-28 w-full items-end justify-center rounded bg-[#111916] p-1 border border-[#26332C]">
                    <div
                      className="w-full rounded-xs transition-all"
                      style={{
                        height: `${barHeightPct}%`,
                        backgroundColor: isRecommended
                          ? activeProfile.oreMeta.swatchColor
                          : "#465B4F",
                        opacity: pt.normalizedWeight === 0 ? 0.2 : 1,
                      }}
                    />
                  </div>
                  <span
                    className={
                      isRecommended
                        ? "mt-1.5 font-mono text-[10px] font-bold text-[#69C598]"
                        : "mt-1.5 font-mono text-[10px] text-[#76887E]"
                    }
                  >
                    Y{pt.y}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Version-Specific Placement Batches Breakdown */}
        <div className="space-y-2.5">
          <h5 className="inline-flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-[#F4F7F4]">
            <Layers className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
            <span>Vanilla Placed-Feature Batches ({activeProfile.batches.length})</span>
          </h5>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {activeProfile.batches.map((batch) => (
              <div
                key={batch.id}
                className="rounded-lg border border-[#34443B] bg-[#1B2621]/75 p-3 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#F4F7F4]">{batch.label}</span>
                  <span className="rounded bg-[#111916] px-1.5 py-0.5 font-mono text-[10px] text-[#69C598]">
                    {batch.distribution}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1 font-mono text-[11px] text-[#A8B8AF]">
                  <span>
                    Y-Range: [{batch.minY}..{batch.maxY}]
                  </span>
                  <span>Peak Y: {batch.peakY !== null ? `Y = ${batch.peakY}` : "Uniform"}</span>
                  <span>Attempts/Chunk: {batch.attemptsPerChunk}</span>
                  <span>Max Vein Size: {batch.veinSize}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between border-t border-[#26332C] pt-1.5 text-[11px]">
                  <span className="text-[#D5B77D]">
                    Air-Exposure Discard: {Math.round(batch.discardChanceOnAirExposure * 100)}%
                  </span>
                  {batch.biomeRestricted && (
                    <span className="font-mono text-[10px] text-[#69C598]">
                      Biome: {batch.biomeTag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cave/Air Exposure & Strategy Footer */}
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-[#34443B] bg-[#1B2621]/50 p-3.5 text-xs sm:grid-cols-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 font-semibold text-[#F4F7F4]">
              <Sparkles className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
              <span>Recommended Mining Strategy</span>
            </div>
            <p className="leading-relaxed text-[#A8B8AF]">
              {activeProfile.recommendedBand.strategy}
            </p>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 font-semibold text-[#D5B77D]">
              <ShieldAlert className="h-3.5 w-3.5 text-[#D5B77D]" aria-hidden="true" />
              <span>Air-Exposure &amp; Biome Rule</span>
            </div>
            <p className="leading-relaxed text-[#A8B8AF]">
              {activeProfile.airExposureNote} &bull; {activeProfile.biomeNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
