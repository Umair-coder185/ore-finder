"use client";

import { ArrowUpRight, Layers, ShieldAlert, Copy, Check, Crosshair, MapPin } from "lucide-react";

/**
 * Reusable, classification-explicit Result Card (Section 4.1 & Section 13).
 *
 * Supports two verified modes:
 * 1. `candidate` mode (`DETERMINISTIC CANDIDATE` for Java 1.18–1.21 seed placement candidates)
 * 2. `ore` mode (`PROBABILITY / DISTRIBUTION GUIDANCE` for Y-level stratum specifications)
 */
export function ResultCard({
  candidate = null,
  ore = null,
  isFocused = false,
  onInspect,
  onSelectCandidate,
  copiedCandidateId = null,
  onCopyCandidate,
}) {
  if (candidate) {
    const isCopied = copiedCandidateId === candidate.id;
    return (
      <div
        className={
          isFocused
            ? "rounded-xl border border-[#69C598] bg-[#25332C]/85 p-4 transition-colors"
            : "rounded-xl border border-[#34443B] bg-[#111916] p-4 transition-colors hover:border-[#465B4F]"
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-xs border border-black/30"
              style={{ backgroundColor: candidate.swatchColor }}
              aria-hidden="true"
            />
            <h5 className="font-heading text-sm font-bold text-[#F4F7F4]">{candidate.oreName}</h5>
            <span className="rounded bg-[#1B2621] px-1.5 py-0.5 font-mono text-[10px] text-[#A8B8AF]">
              {candidate.batchLabel}
            </span>
          </div>

          <span className="rounded-md border border-[#69C598]/40 bg-[#69C598]/12 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#69C598]">
            DETERMINISTIC CANDIDATE
          </span>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-[#26332C] pt-3 text-xs sm:grid-cols-4">
          <div>
            <dt className="text-[10px] text-[#A8B8AF]">Candidate XYZ</dt>
            <dd className="font-mono font-bold text-[#F4F7F4]">
              {candidate.x}, {candidate.y}, {candidate.z}
            </dd>
          </div>

          <div>
            <dt className="text-[10px] text-[#A8B8AF]">Chunk Coordinates</dt>
            <dd className="font-mono font-semibold text-[#F4F7F4]">
              [{candidate.chunkX}, {candidate.chunkZ}]
            </dd>
          </div>

          <div>
            <dt className="text-[10px] text-[#A8B8AF]">Distance (3D / X-Z)</dt>
            <dd className="font-mono font-semibold text-[#69C598]">
              {candidate.distance3D}m / {candidate.distanceHorizontal}m
            </dd>
          </div>

          <div>
            <dt className="text-[10px] text-[#A8B8AF]">Air Discard Rule</dt>
            <dd className="font-mono font-semibold text-[#D5B77D]">
              {Math.round(candidate.discardChanceOnAirExposure * 100)}% on air
            </dd>
          </div>
        </dl>

        <p className="mt-2.5 text-[11px] leading-relaxed text-[#A8B8AF]">
          {candidate.limitations?.[0] ||
            "Reproducible Xoroshiro128++ feature origin. Actual in-game ore blocks require stone/deepslate host rock, matching biome feature index, and passing cave air-exposure checks."}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#26332C] pt-2.5 text-[11px]">
          <button
            type="button"
            onClick={() => onSelectCandidate && onSelectCandidate(candidate.id)}
            className="inline-flex items-center gap-1 font-semibold text-[#69C598] hover:text-[#57B386] cursor-pointer"
          >
            <Crosshair className="h-3 w-3" aria-hidden="true" />
            <span>{isFocused ? "Selected on X/Z Map" : "Focus on X/Z Map"}</span>
          </button>

          {onCopyCandidate && (
            <button
              type="button"
              onClick={() => onCopyCandidate(candidate)}
              className="inline-flex items-center gap-1.5 rounded border border-[#34443B] bg-[#1B2621] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#F4F7F4] hover:border-[#69C598] cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="h-3 w-3 text-[#69C598]" aria-hidden="true" />
                  <span className="text-[#69C598]">Copied /tp</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-[#A8B8AF]" aria-hidden="true" />
                  <span>
                    Copy /tp {candidate.x} {candidate.y} {candidate.z}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!ore) return null;

  return (
    <div
      className={
        isFocused
          ? "rounded-xl border border-[#69C598] bg-[#25332C]/80 p-4 transition-colors"
          : "rounded-xl border border-[#34443B] bg-[#111916] p-4 transition-colors hover:border-[#465B4F]"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-xs border border-black/30"
            style={{ backgroundColor: ore.swatchColor }}
            aria-hidden="true"
          />
          <h5 className="font-heading text-sm font-bold text-[#F4F7F4]">{ore.name}</h5>
          <span className="rounded bg-[#1B2621] px-1.5 py-0.5 font-mono text-[10px] text-[#A8B8AF]">
            {ore.symbol}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded border border-[#D5B77D]/40 bg-[#D5B77D]/12 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#D5B77D]">
            DISTRIBUTION GUIDANCE
          </span>
          <span className="rounded-md border border-[#69C598]/35 bg-[#69C598]/12 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#69C598]">
            Peak {ore.optimalElevation}
          </span>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-1.5 border-t border-[#26332C] pt-3 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-[11px] text-[#A8B8AF]">Vertical Stratum Range</dt>
          <dd className="font-mono font-semibold text-[#F4F7F4]">{ore.stratumRange}</dd>
        </div>

        <div>
          <dt className="text-[11px] text-[#A8B8AF]">Distribution Profile</dt>
          <dd className="font-medium text-[#F4F7F4]">{ore.distributionType}</dd>
        </div>

        <div className="sm:col-span-2">
          <dt className="inline-flex items-center gap-1 text-[11px] text-[#A8B8AF]">
            <ShieldAlert className="h-3 w-3 text-[#D5B77D]" aria-hidden="true" />
            <span>Air-Exposure &amp; Biome Rule</span>
          </dt>
          <dd className="mt-0.5 text-[#D5B77D]">{ore.airExposureRule}</dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center justify-between border-t border-[#26332C] pt-2.5 text-[11px] text-[#A8B8AF]">
        <span className="inline-flex items-center gap-1">
          <Layers className="h-3 w-3 text-[#69C598]" aria-hidden="true" />
          <span>{ore.biomeModifier}</span>
        </span>

        {onInspect && (
          <button
            type="button"
            onClick={() => onInspect(ore.id)}
            className="inline-flex items-center gap-1 font-semibold text-[#69C598] hover:text-[#57B386] cursor-pointer"
          >
            <span>{isFocused ? "Showing Filter" : "Filter to Ore"}</span>
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
