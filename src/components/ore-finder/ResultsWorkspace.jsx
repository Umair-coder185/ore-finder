"use client";

import { Compass, Info, Crosshair, ChevronDown, ShieldCheck } from "lucide-react";
import { WORKSPACE_STATUS } from "@/features/ore-finder/types";
import { Button } from "@/components/ui/Button";
import { AccuracyIndicator } from "./AccuracyIndicator";
import { ResultsToolbar } from "./ResultsToolbar";
import { MapShell } from "./MapShell";
import { DistributionChart } from "./DistributionChart";
import { EmptyResults } from "./EmptyResults";
import { ResultCard } from "./ResultCard";

/**
 * Right-hand Results & Visualization Workspace (Phase 03).
 *
 * Integrates:
 * - Classification-explicit AccuracyIndicator
 * - ResultsToolbar with live candidate/profile counts, filters, sorting, and /tp copy
 * - Interactive X/Z MapShell with zoom, pan, player origin, and deterministic candidate markers
 * - Interactive Y-Level DistributionChart for verified stratum analysis
 * - Paginated Deterministic Candidate Coordinate Cards (for Java 1.18–1.21)
 * - Active Ore Stratum Details Cards (for all supported 1.18–1.21 editions)
 *
 * @param {Object} props
 * @param {Object} props.workspace
 */
export function ResultsWorkspace({ workspace }) {
  const {
    config,
    currentEdition,
    currentVersion,
    currentCapability,
    validation,
    workspaceStatus,
    chunkInfo,
    footprint,
    selectedOreObjects,
    filteredOreObjects,
    activeResultsOreFilter,
    setActiveResultsOreFilter,
    copiedState,
    copiedCandidateId,
    searchResult,
    filteredCandidates,
    paginatedCandidates,
    hasMoreCandidates,
    selectedCandidate,
    setSelectedCandidateId,
    actions,
  } = workspace;

  const isUnsupported = workspaceStatus === WORKSPACE_STATUS.UNSUPPORTED_VERSION;
  const isInvalid = workspaceStatus === WORKSPACE_STATUS.INVALID_INPUT;
  const supportsCandidates = Boolean(
    currentCapability?.capabilities?.deterministicCandidates && !isUnsupported && !isInvalid
  );

  const distributionProfiles = searchResult?.distributionProfiles || [];

  function handleInspectOre(oreId) {
    setActiveResultsOreFilter((prev) => (prev === oreId ? "all" : oreId));
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#34443B] bg-[#1B2621]">
      {/* Results Header Bar */}
      <div className="flex flex-col justify-between gap-3 border-b border-[#34443B] bg-[#25332C]/60 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5">
        <div className="flex items-center gap-2.5">
          <Compass className="h-4 w-4 text-[#69C598]" aria-hidden="true" />
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#69C598]">
              Step 2 &bull; Results &amp; Visualization Workspace
            </span>
            <h3 className="font-heading text-sm font-bold text-[#F4F7F4] sm:text-base">
              {supportsCandidates
                ? "Deterministic Candidate Map & Stratum Analysis"
                : "Verified Distribution Guidance & Stratum Analysis"}
            </h3>
          </div>
        </div>

        <AccuracyIndicator
          status={workspaceStatus}
          editionLabel={currentEdition.label}
          versionLabel={currentVersion.shortVersion}
          capability={currentCapability}
        />
      </div>

      {/* Results Toolbar */}
      <ResultsToolbar
        selectedOreObjects={selectedOreObjects}
        activeOreFilter={activeResultsOreFilter}
        onChangeOreFilter={setActiveResultsOreFilter}
        sortPreference={config.advanced.sortPreference}
        onChangeSort={(val) => actions.updateAdvancedOption("sortPreference", val)}
        coordinates={{ x: config.x, y: config.y, z: config.z }}
        footprint={footprint}
        copiedState={copiedState}
        onCopyOrigin={actions.copyOriginTeleportCommand}
        supportsCandidates={supportsCandidates}
        candidateCount={filteredCandidates.length}
        distributionCount={filteredOreObjects.length}
        stats={searchResult?.stats || null}
      />

      {/* Main Results Body */}
      <div className="flex flex-1 flex-col space-y-5 p-4 sm:p-5">
        {/* 1. Interactive 2D X/Z Map Container */}
        <MapShell
          chunkInfo={chunkInfo}
          footprint={footprint}
          coordinates={{ x: config.x, y: config.y, z: config.z }}
          seed={config.seed}
          status={workspaceStatus}
          editionLabel={currentEdition.label}
          versionLabel={currentVersion.shortVersion}
          capability={currentCapability}
          candidates={filteredCandidates}
          selectedCandidate={selectedCandidate}
          onSelectCandidate={setSelectedCandidateId}
          copiedCandidateId={copiedCandidateId}
          onCopyCandidate={actions.copyCandidateTeleportCommand}
        />

        {/* 2. Error / Unsupported / Empty State OR Deterministic Candidates List */}
        {isUnsupported || isInvalid ? (
          <EmptyResults
            status={workspaceStatus}
            validation={validation}
            onResetAll={actions.resetAllConfiguration}
            message={searchResult?.error}
          />
        ) : supportsCandidates ? (
          <div className="space-y-3 rounded-xl border border-[#34443B] bg-[#15201B] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-[#69C598]" aria-hidden="true" />
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#F4F7F4]">
                  Deterministic Candidate Coordinates ({filteredCandidates.length})
                </h4>
              </div>

              <span className="font-mono text-[11px] text-[#A8B8AF]">
                Showing {paginatedCandidates.length} of {filteredCandidates.length} sorted by{" "}
                {config.advanced.sortPreference}
              </span>
            </div>

            {/* Scientific Classification Disclosure Banner */}
            <div className="flex items-start gap-2 rounded-lg border border-[#34443B] bg-[#1B2621]/80 px-3 py-2 text-[11px] leading-relaxed text-[#A8B8AF]">
              <ShieldCheck
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#69C598]"
                aria-hidden="true"
              />
              <span>
                <strong className="text-[#F4F7F4]">
                  Why &ldquo;Deterministic Candidate&rdquo;?
                </strong>{" "}
                Each coordinate below is a 100% reproducible{" "}
                <code className="font-mono text-[#69C598]">Xoroshiro128++</code> feature-placement
                origin for seed{" "}
                <code className="font-mono text-[#D5B77D]">
                  {searchResult?.seedInfo?.worldSeedString || config.seed}
                </code>
                . In-game block realization additionally depends on stone/deepslate host rock, cave
                air-exposure discard checks, and biome feature index alignment.
              </span>
            </div>

            {paginatedCandidates.length === 0 ? (
              <EmptyResults
                status={workspaceStatus}
                validation={validation}
                onResetAll={actions.resetAllConfiguration}
              />
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {paginatedCandidates.map((cand) => (
                  <ResultCard
                    key={cand.id}
                    candidate={cand}
                    isFocused={selectedCandidate?.id === cand.id}
                    onSelectCandidate={setSelectedCandidateId}
                    copiedCandidateId={copiedCandidateId}
                    onCopyCandidate={actions.copyCandidateTeleportCommand}
                  />
                ))}
              </div>
            )}

            {hasMoreCandidates && (
              <div className="flex justify-center pt-1">
                <Button
                  type="button"
                  variant="workspace-secondary"
                  size="sm"
                  onClick={actions.showMoreCandidates}
                >
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    Show More Candidates ({filteredCandidates.length - paginatedCandidates.length}{" "}
                    remaining)
                  </span>
                </Button>
              </div>
            )}
          </div>
        ) : null}

        {/* 3. Interactive Y-Level Distribution Chart (All Supported 1.18–1.21 Versions) */}
        {!isUnsupported && !isInvalid && distributionProfiles.length > 0 && (
          <DistributionChart
            profiles={distributionProfiles}
            activeOreFilter={activeResultsOreFilter}
            onSelectOre={setActiveResultsOreFilter}
            editionLabel={currentEdition.label}
            versionLabel={currentVersion.shortVersion}
          />
        )}

        {/* 4. Active Ore Stratum Reference Cards */}
        <div className="space-y-3 border-t border-[#34443B] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2">
              <Info className="h-4 w-4 text-[#69C598]" aria-hidden="true" />
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#F4F7F4]">
                Active Ore Stratum Reference Cards ({filteredOreObjects.length})
              </h4>
            </div>

            {activeResultsOreFilter !== "all" && (
              <button
                type="button"
                onClick={() => setActiveResultsOreFilter("all")}
                className="text-xs font-semibold text-[#69C598] hover:underline cursor-pointer"
              >
                Show All Selected Ores ({selectedOreObjects.length})
              </button>
            )}
          </div>

          {filteredOreObjects.length === 0 ? (
            <div className="rounded-lg border border-[#34443B] bg-[#111916] p-5 text-center text-xs text-[#A8B8AF]">
              No ores selected in the filter. Choose one or more ores in the Target Ore Selection
              grid to view verified Y-level generation profiles.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredOreObjects.map((ore) => (
                <ResultCard
                  key={ore.id}
                  ore={ore}
                  isFocused={activeResultsOreFilter === ore.id}
                  onInspect={handleInspectOre}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
