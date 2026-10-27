"use client";

import { Cpu, Layers, RotateCcw } from "lucide-react";
import { useOreFinderWorkspace } from "@/features/ore-finder/hooks/useOreFinderWorkspace";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchConfiguration } from "./SearchConfiguration";
import { ResultsWorkspace } from "./ResultsWorkspace";

/**
 * Primary Integrated Dark Ore Finder Workspace for OreFinder.io.
 * Combines SearchConfiguration and ResultsWorkspace in a cohesive,
 * responsive dark technical workspace.
 */
export function OreFinderWorkspace() {
  const workspace = useOreFinderWorkspace();
  const { currentEdition, currentVersion, actions } = workspace;

  return (
    <section
      id="workspace"
      aria-label="Minecraft Ore Finder Workspace"
      className="dark-workspace overflow-hidden rounded-2xl border border-[#34443B] bg-[#111916] text-[#F4F7F4] shadow-[0_20px_44px_-12px_rgba(17,25,22,0.28)]"
    >
      {/* Top Workspace Application Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#34443B] bg-[#1B2621] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#34443B] bg-[#111916] text-[#69C598]">
            <Layers className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-base font-bold tracking-tight text-[#F4F7F4] sm:text-lg">
                OreFinder World Analysis Workspace
              </h2>
              <Badge variant="dark-accent">Interactive Configuration</Badge>
            </div>
            <p className="mt-0.5 text-xs text-[#A8B8AF]">
              Configure edition, release version, world seed, coordinates, and target ore strata.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden lg:inline-flex items-center gap-2 rounded-md border border-[#34443B] bg-[#111916] px-3 py-1.5 text-xs text-[#A8B8AF]">
            <Cpu className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
            <span className="font-medium text-[#F4F7F4]">{currentEdition.label}</span>
            <span className="text-[#34443B]">&bull;</span>
            <span>{currentVersion.shortVersion}</span>
          </div>

          <Button
            type="button"
            variant="workspace-secondary"
            size="sm"
            onClick={actions.resetAllConfiguration}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Workspace</span>
          </Button>
        </div>
      </div>

      {/* Main Responsive Workspace Grid */}
      <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SearchConfiguration workspace={workspace} />
        </div>

        <div className="lg:col-span-7">
          <ResultsWorkspace workspace={workspace} />
        </div>
      </div>
    </section>
  );
}
