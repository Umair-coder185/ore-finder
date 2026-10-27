"use client";

import { useState, useMemo } from "react";
import {
  Compass,
  Grid,
  Layers,
  Crosshair,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { WORKSPACE_STATUS } from "@/features/ore-finder/types";

/**
 * Interactive 2D X/Z Map & Chunk Coordinate Viewport (Section 12.2).
 *
 * - For Java Edition 1.18–1.21 (`capability.capabilities.deterministicCandidates === true`):
 *   Renders an interactive SVG X/Z coordinate map with zoom, pan, 16x16 chunk boundary lines,
 *   player origin marker, and color-coded deterministic candidate markers.
 * - For Bedrock Edition 1.18–1.21 (`deterministicCandidates === false`):
 *   Renders the exact chunk/region reference matrix and explicitly states that Bedrock
 *   operates in Verified Distribution Guidance mode without plotting invented coordinates.
 */
export function MapShell({
  chunkInfo,
  footprint,
  coordinates,
  seed,
  status,
  editionLabel,
  versionLabel,
  capability,
  candidates = [],
  selectedCandidate = null,
  onSelectCandidate,
  copiedCandidateId = null,
  onCopyCandidate,
}) {
  const [zoom, setZoom] = useState(1);
  const [panBlocks, setPanBlocks] = useState({ x: 0, z: 0 });

  const isUnsupported = status === WORKSPACE_STATUS.UNSUPPORTED_VERSION;
  const isInvalid = status === WORKSPACE_STATUS.INVALID_INPUT;
  const supportsCandidates = Boolean(
    capability?.capabilities?.deterministicCandidates && !isUnsupported && !isInvalid
  );

  const originX = Math.floor(Number(coordinates.x) || 0);
  const originY = Math.floor(Number(coordinates.y) || -54);
  const originZ = Math.floor(Number(coordinates.z) || 0);
  const radiusBlocks = Math.max(16, (Number(footprint?.radiusChunks) || 8) * 16);

  // Viewport span in world blocks adjusted by zoom
  const halfSpanBlocks = Math.max(24, Math.round(radiusBlocks / zoom));
  const centerWorldX = originX + panBlocks.x;
  const centerWorldZ = originZ + panBlocks.z;

  const minWorldX = centerWorldX - halfSpanBlocks;
  const maxWorldX = centerWorldX + halfSpanBlocks;
  const minWorldZ = centerWorldZ - halfSpanBlocks;
  const maxWorldZ = centerWorldZ + halfSpanBlocks;

  // Compute visible chunk grid lines in SVG [0..400] coordinate space
  const svgSize = 400;
  const worldToSvgX = (wx) => ((wx - minWorldX) / (maxWorldX - minWorldX)) * svgSize;
  const worldToSvgZ = (wz) => ((wz - minWorldZ) / (maxWorldZ - minWorldZ)) * svgSize;

  const chunkLines = useMemo(() => {
    const startChunkX = Math.floor(minWorldX / 16);
    const endChunkX = Math.ceil(maxWorldX / 16);
    const startChunkZ = Math.floor(minWorldZ / 16);
    const endChunkZ = Math.ceil(maxWorldZ / 16);

    const step = Math.max(1, Math.ceil((endChunkX - startChunkX) / 16));
    const vertical = [];
    const horizontal = [];

    for (let cx = startChunkX; cx <= endChunkX; cx += step) {
      const wx = cx * 16;
      const sx = ((wx - minWorldX) / (maxWorldX - minWorldX)) * svgSize;
      if (sx >= 0 && sx <= svgSize) {
        vertical.push({ cx, sx, isOriginChunk: cx === chunkInfo.chunkX });
      }
    }

    for (let cz = startChunkZ; cz <= endChunkZ; cz += step) {
      const wz = cz * 16;
      const sz = ((wz - minWorldZ) / (maxWorldZ - minWorldZ)) * svgSize;
      if (sz >= 0 && sz <= svgSize) {
        horizontal.push({ cz, sz, isOriginChunk: cz === chunkInfo.chunkZ });
      }
    }

    return { vertical, horizontal };
  }, [minWorldX, maxWorldX, minWorldZ, maxWorldZ, chunkInfo.chunkX, chunkInfo.chunkZ]);

  // Limit SVG plotted markers to top 180 closest to keep DOM ultra-fast on mobile
  const plottedCandidates = useMemo(() => candidates.slice(0, 180), [candidates]);

  function handleZoomIn() {
    setZoom((z) => Math.min(4, Number((z * 1.4).toFixed(2))));
  }

  function handleZoomOut() {
    setZoom((z) => Math.max(0.5, Number((z / 1.4).toFixed(2))));
  }

  function handleResetView() {
    setZoom(1);
    setPanBlocks({ x: 0, z: 0 });
  }

  function handlePan(dxFactor, dzFactor) {
    const step = Math.max(16, Math.round(halfSpanBlocks * 0.35));
    setPanBlocks((prev) => ({
      x: prev.x + dxFactor * step,
      z: prev.z + dzFactor * step,
    }));
  }

  const activeInspected = selectedCandidate || plottedCandidates[0] || null;

  return (
    <div className="overflow-hidden rounded-xl border border-[#34443B] bg-[#111916]">
      {/* Map Viewport Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#26332C] bg-[#1B2621]/75 px-4 py-2.5 text-xs">
        <div className="inline-flex flex-wrap items-center gap-2 font-semibold text-[#F4F7F4]">
          <Grid className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
          <span>Interactive X/Z Chunk &amp; Candidate Map</span>
          <span className="rounded border border-[#34443B] bg-[#111916] px-2 py-0.5 font-mono text-[10px] text-[#69C598]">
            {supportsCandidates
              ? `${plottedCandidates.length} Plotted Candidates`
              : "16×16 Chunk Frame"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#A8B8AF]">
          <span>
            Chunk [{chunkInfo.chunkX}, {chunkInfo.chunkZ}]
          </span>
          <span className="text-[#34443B]">|</span>
          <span>
            Region r.{chunkInfo.regionX}.{chunkInfo.regionZ}.mca
          </span>
        </div>
      </div>

      {supportsCandidates ? (
        <div className="p-4 sm:p-5">
          {/* Map Controls Toolbar (Zoom + Pan) */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#26332C] bg-[#15201B] px-3 py-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleZoomIn}
                aria-label="Zoom in map"
                className="inline-flex items-center gap-1 rounded border border-[#34443B] bg-[#1B2621] px-2 py-1 font-mono text-[11px] text-[#F4F7F4] hover:border-[#69C598] cursor-pointer"
              >
                <ZoomIn className="h-3 w-3 text-[#69C598]" aria-hidden="true" />
                <span>Zoom In</span>
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                aria-label="Zoom out map"
                className="inline-flex items-center gap-1 rounded border border-[#34443B] bg-[#1B2621] px-2 py-1 font-mono text-[11px] text-[#F4F7F4] hover:border-[#69C598] cursor-pointer"
              >
                <ZoomOut className="h-3 w-3 text-[#69C598]" aria-hidden="true" />
                <span>Zoom Out</span>
              </button>
              <button
                type="button"
                onClick={handleResetView}
                aria-label="Reset map zoom and pan"
                className="inline-flex items-center gap-1 rounded border border-[#34443B] bg-[#1B2621] px-2 py-1 font-mono text-[11px] text-[#A8B8AF] hover:border-[#69C598] hover:text-[#F4F7F4] cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span>Reset ({zoom.toFixed(1)}x)</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <span className="mr-1 font-mono text-[10px] uppercase text-[#76887E]">Pan:</span>
              <button
                type="button"
                onClick={() => handlePan(0, -1)}
                aria-label="Pan North (-Z)"
                className="rounded border border-[#34443B] bg-[#1B2621] p-1 text-[#A8B8AF] hover:border-[#69C598] hover:text-[#F4F7F4] cursor-pointer"
              >
                <ArrowUp className="h-3 w-3" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handlePan(0, 1)}
                aria-label="Pan South (+Z)"
                className="rounded border border-[#34443B] bg-[#1B2621] p-1 text-[#A8B8AF] hover:border-[#69C598] hover:text-[#F4F7F4] cursor-pointer"
              >
                <ArrowDown className="h-3 w-3" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handlePan(-1, 0)}
                aria-label="Pan West (-X)"
                className="rounded border border-[#34443B] bg-[#1B2621] p-1 text-[#A8B8AF] hover:border-[#69C598] hover:text-[#F4F7F4] cursor-pointer"
              >
                <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handlePan(1, 0)}
                aria-label="Pan East (+X)"
                className="rounded border border-[#34443B] bg-[#1B2621] p-1 text-[#A8B8AF] hover:border-[#69C598] hover:text-[#F4F7F4] cursor-pointer"
              >
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Cardinal Axis Header */}
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#76887E]">
            <span>West X={minWorldX}</span>
            <span className="inline-flex items-center gap-1 text-[#69C598]">
              <Compass className="h-3 w-3" aria-hidden="true" />
              <span>North (Z={minWorldZ})</span>
            </span>
            <span>East X={maxWorldX}</span>
          </div>

          {/* Interactive 2D X/Z SVG Viewport */}
          <div className="relative overflow-hidden rounded-xl border border-[#34443B] bg-[#0D1411]">
            <svg
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              role="img"
              aria-label="Interactive X/Z Minecraft chunk and deterministic ore candidate map"
              className="aspect-square max-h-[380px] w-full select-none"
            >
              {/* Chunk Grid Vertical Lines */}
              {chunkLines.vertical.map((line) => (
                <line
                  key={`vx-${line.cx}`}
                  x1={line.sx}
                  y1={0}
                  x2={line.sx}
                  y2={svgSize}
                  stroke={line.isOriginChunk ? "#2F4B3E" : "#1B2621"}
                  strokeWidth={line.isOriginChunk ? "1.5" : "1"}
                />
              ))}

              {/* Chunk Grid Horizontal Lines */}
              {chunkLines.horizontal.map((line) => (
                <line
                  key={`hz-${line.cz}`}
                  x1={0}
                  y1={line.sz}
                  x2={svgSize}
                  y2={line.sz}
                  stroke={line.isOriginChunk ? "#2F4B3E" : "#1B2621"}
                  strokeWidth={line.isOriginChunk ? "1.5" : "1"}
                />
              ))}

              {/* Search Radius Boundary Circle */}
              <circle
                cx={worldToSvgX(originX)}
                cy={worldToSvgZ(originZ)}
                r={(radiusBlocks / (maxWorldX - minWorldX)) * svgSize}
                fill="rgba(105, 197, 152, 0.03)"
                stroke="#34443B"
                strokeDasharray="4 4"
                strokeWidth="1"
              />

              {/* Candidate Markers */}
              {plottedCandidates.map((cand) => {
                const cx = worldToSvgX(cand.x);
                const cz = worldToSvgZ(cand.z);
                if (cx < -10 || cx > svgSize + 10 || cz < -10 || cz > svgSize + 10) {
                  return null;
                }
                const isSelected = activeInspected && activeInspected.id === cand.id;
                return (
                  <g
                    key={cand.id}
                    onClick={() => onSelectCandidate && onSelectCandidate(cand.id)}
                    className="cursor-pointer"
                  >
                    <title>
                      {`${cand.oreName} (${cand.batchLabel}) at X=${cand.x}, Y=${cand.y}, Z=${cand.z} • ${cand.distance3D}m`}
                    </title>
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cz}
                        r="8"
                        fill="none"
                        stroke="#F4F7F4"
                        strokeWidth="1.5"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cz}
                      r={isSelected ? "5" : "3.5"}
                      fill={cand.swatchColor || "#69C598"}
                      stroke="#0D1411"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Player Origin Marker */}
              {(() => {
                const ox = worldToSvgX(originX);
                const oz = worldToSvgZ(originZ);
                return (
                  <g>
                    <title>{`Player Origin (${originX}, ${originY}, ${originZ})`}</title>
                    <circle
                      cx={ox}
                      cy={oz}
                      r="6"
                      fill="rgba(105, 197, 152, 0.25)"
                      stroke="#69C598"
                      strokeWidth="2"
                    />
                    <line
                      x1={ox - 9}
                      y1={oz}
                      x2={ox + 9}
                      y2={oz}
                      stroke="#69C598"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={ox}
                      y1={oz - 9}
                      x2={ox}
                      y2={oz + 9}
                      stroke="#69C598"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#76887E]">
            <span>
              Origin ({originX}, {originZ})
            </span>
            <span>South (Z={maxWorldZ})</span>
            <span>1 Grid Square = 16&times;16 Blocks</span>
          </div>

          {/* Selected Candidate Coordinate Tooltip / Inspector Bar */}
          {activeInspected && (
            <div className="mt-4 rounded-xl border border-[#34443B] bg-[#1B2621] p-3.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-xs"
                    style={{ backgroundColor: activeInspected.swatchColor }}
                    aria-hidden="true"
                  />
                  <span className="font-heading font-bold text-[#F4F7F4]">
                    {activeInspected.oreName}
                  </span>
                  <span className="rounded border border-[#69C598]/40 bg-[#69C598]/12 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#69C598]">
                    DETERMINISTIC CANDIDATE
                  </span>
                  <span className="font-mono text-[11px] text-[#A8B8AF]">
                    {activeInspected.batchLabel}
                  </span>
                </div>

                {onCopyCandidate && (
                  <button
                    type="button"
                    onClick={() => onCopyCandidate(activeInspected)}
                    className="inline-flex items-center gap-1.5 rounded border border-[#34443B] bg-[#111916] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#F4F7F4] hover:border-[#69C598] cursor-pointer"
                  >
                    {copiedCandidateId === activeInspected.id ? (
                      <>
                        <Check className="h-3 w-3 text-[#69C598]" aria-hidden="true" />
                        <span className="text-[#69C598]">Copied /tp</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-[#A8B8AF]" aria-hidden="true" />
                        <span>
                          Copy /tp {activeInspected.x} {activeInspected.y} {activeInspected.z}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-[#26332C] pt-2.5 font-mono text-[11px] text-[#A8B8AF] sm:grid-cols-4">
                <span>
                  XYZ:{" "}
                  <strong className="text-[#F4F7F4]">
                    {activeInspected.x}, {activeInspected.y}, {activeInspected.z}
                  </strong>
                </span>
                <span>
                  Chunk:{" "}
                  <strong className="text-[#F4F7F4]">
                    [{activeInspected.chunkX}, {activeInspected.chunkZ}]
                  </strong>
                </span>
                <span>
                  3D Dist: <strong className="text-[#69C598]">{activeInspected.distance3D}m</strong>
                </span>
                <span>
                  Air Discard:{" "}
                  <strong className="text-[#D5B77D]">
                    {Math.round(activeInspected.discardChanceOnAirExposure * 100)}%
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Non-Candidate Mode (Bedrock Distribution Guidance or Unsupported/Invalid) */
        <div className="relative flex flex-col items-center justify-center p-5 sm:p-6">
          <div className="mb-3 flex w-full max-w-md items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#76887E]">
            <span>West (-X)</span>
            <span className="inline-flex items-center gap-1 text-[#69C598]">
              <Compass className="h-3 w-3" aria-hidden="true" />
              <span>North (-Z)</span>
            </span>
            <span>East (+X)</span>
          </div>

          <div
            aria-label="Chunk coordinate reference matrix"
            className="grid w-full max-w-md grid-cols-5 gap-1.5 rounded-xl border border-[#34443B] bg-[#1B2621]/90 p-3 shadow-inner"
          >
            {[-2, -1, 0, 1, 2].map((dz) =>
              [-2, -1, 0, 1, 2].map((dx) => {
                const isOrigin = dx === 0 && dz === 0;
                const cellChunkX = chunkInfo.chunkX + dx;
                const cellChunkZ = chunkInfo.chunkZ + dz;

                return (
                  <div
                    key={`${dx}-${dz}`}
                    title={`Chunk [${cellChunkX}, ${cellChunkZ}]`}
                    className={
                      isOrigin
                        ? "flex aspect-square flex-col items-center justify-center rounded border border-[#69C598] bg-[#69C598]/20 text-[#69C598]"
                        : "flex aspect-square flex-col items-center justify-center rounded border border-[#34443B]/60 bg-[#111916]/90 text-[#76887E]"
                    }
                  >
                    {isOrigin ? (
                      <>
                        <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="mt-0.5 font-mono text-[9px] font-bold leading-none">
                          Origin
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-[9px] leading-none opacity-75">
                        {cellChunkX},{cellChunkZ}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 w-full max-w-xl rounded-lg border border-[#34443B] bg-[#1B2621] p-3.5 text-center">
            <div className="inline-flex items-center gap-1.5 font-heading text-xs font-bold text-[#F4F7F4]">
              <Layers className="h-3.5 w-3.5 text-[#D5B77D]" aria-hidden="true" />
              <span>
                {isUnsupported
                  ? "Map Overlay Paused — Unsupported Minecraft Version"
                  : isInvalid
                    ? "Map Overlay Paused — Resolve Input Validation Errors"
                    : "Verified Distribution Guidance Mode • No Speculative Coordinates Plotted"}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#A8B8AF]">
              {isUnsupported || isInvalid ? (
                <>
                  Select a supported 1.18–1.21 release and valid world seed to inspect coordinates
                  or distribution profiles.
                </>
              ) : (
                <>
                  For{" "}
                  <span className="font-semibold text-[#F4F7F4]">
                    {editionLabel} ({versionLabel})
                  </span>
                  , Bedrock C++ <code className="font-mono text-[#D5B77D]">MT19937</code> feature
                  decoration order differs from Java{" "}
                  <code className="font-mono text-[#69C598]">Xoroshiro128++</code>. In strict
                  compliance with OreFinder accuracy standards, speculative X/Z coordinates are
                  never plotted—inspect the verified Y-Level Distribution Chart below.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
