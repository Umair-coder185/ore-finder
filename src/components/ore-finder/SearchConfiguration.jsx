"use client";

import { SeedInput } from "./SeedInput";
import { EditionSelector } from "./EditionSelector";
import { VersionSelector } from "./VersionSelector";
import { CoordinateInputs } from "./CoordinateInputs";
import { RadiusSelector } from "./RadiusSelector";
import { OreSelector } from "./OreSelector";
import { AdvancedSettings } from "./AdvancedSettings";
import { SearchAction } from "./SearchAction";

/**
 * Left-hand Search Configuration panel of the dark Ore Finder workspace.
 *
 * @param {Object} props
 * @param {Object} props.workspace
 */
export function SearchConfiguration({ workspace }) {
  const {
    config,
    allOres,
    availableVersions,
    currentVersion,
    currentCapability,
    validation,
    resolvedSeed,
    workspaceStatus,
    chunkInfo,
    footprint,
    isAdvancedOpen,
    setIsAdvancedOpen,
    pasteNotice,
    presets,
    searchState,
    actions,
  } = workspace;

  const { fieldErrors } = validation;

  return (
    <div className="flex flex-col space-y-5 rounded-xl border border-[#34443B] bg-[#1B2621] p-4 sm:p-6">
      <div className="border-b border-[#34443B] pb-3.5">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#69C598]">
          Step 1 &bull; Search Configuration
        </span>
        <h3 className="mt-1 font-heading text-base font-bold text-[#F4F7F4] sm:text-lg">
          World Seed, Coordinates &amp; Ore Filters
        </h3>
        <p className="mt-0.5 text-xs text-[#A8B8AF]">
          Configure your Minecraft edition, release version, origin block, and target minerals.
        </p>
      </div>

      {/* 1. World Seed */}
      <SeedInput
        seed={config.seed}
        resolvedSeed={resolvedSeed}
        onChange={actions.setSeed}
        onClear={actions.clearSeed}
        onPaste={actions.pasteSeed}
        error={fieldErrors.seed}
        pasteNotice={pasteNotice}
      />

      {/* 2. Minecraft Edition */}
      <EditionSelector edition={config.edition} onChange={actions.setEdition} />

      {/* 3. Minecraft Version */}
      <VersionSelector
        version={config.version}
        versions={availableVersions}
        currentVersion={currentVersion}
        onChange={actions.setVersion}
      />

      {/* 4. Player Coordinates */}
      <CoordinateInputs
        x={config.x}
        y={config.y}
        z={config.z}
        onChange={actions.setCoordinate}
        fieldErrors={fieldErrors}
        chunkInfo={chunkInfo}
        yBounds={currentVersion?.yBounds}
      />

      {/* 5. Search Radius */}
      <RadiusSelector
        radiusMode={config.radiusMode}
        radiusChunks={config.radiusChunks}
        presets={presets}
        footprint={footprint}
        onSelectPreset={actions.setPresetRadius}
        onChangeCustom={actions.setCustomRadius}
        onEnableCustom={actions.enableCustomRadiusMode}
        error={fieldErrors.radiusChunks}
      />

      {/* 6. Ore Selection */}
      <OreSelector
        ores={allOres}
        selectedOres={config.selectedOres}
        onToggleOre={actions.toggleOre}
        onSelectAll={actions.selectAllOres}
        onClearAll={actions.clearAllOres}
        error={fieldErrors.selectedOres}
      />

      {/* 7. Collapsible Advanced Search Options */}
      <AdvancedSettings
        isOpen={isAdvancedOpen}
        onToggleOpen={setIsAdvancedOpen}
        advanced={config.advanced}
        currentVersion={currentVersion}
        onUpdateOption={actions.updateAdvancedOption}
        onResetAdvanced={actions.resetAdvancedOptions}
      />

      {/* 8. Primary Search Action & Status */}
      <SearchAction
        status={workspaceStatus}
        validation={validation}
        capability={currentCapability}
        searchState={searchState}
        onRunSearch={actions.runSearch}
        onCancelSearch={actions.cancelSearch}
        onResetAll={actions.resetAllConfiguration}
      />
    </div>
  );
}
