import Link from "next/link";
import { ArrowDownRight, BookOpen, Layers, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

/**
 * Premium Editorial Hero Section for OreFinder.io.
 *
 * Uses the approved headline and supporting copy while maintaining strict
 * technical honesty about Phase 02 configuration and stratum capabilities.
 */
export function Hero() {
  return (
    <div className="pt-8 pb-8 sm:pt-12 sm:pb-10">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald">
              <Layers className="h-3 w-3" aria-hidden="true" />
              <span>Minecraft 1.18 – 1.21 Strata Reference</span>
            </Badge>
            <Badge variant="gold">Java &amp; Bedrock Editions</Badge>
          </div>

          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#202722] sm:text-5xl sm:leading-[1.08]">
            Find Minecraft Ores. <span className="text-[#326B55]">Explore Smarter.</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#65716B]">
            Explore ore locations and generation insights with a powerful Minecraft world analysis
            workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#workspace"
            className="inline-flex items-center gap-2 rounded-md bg-[#326B55] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#275644]"
          >
            <span>Configure World Settings</span>
            <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 rounded-md border border-[#E4E8E2] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#202722] transition-colors hover:bg-[#F2F0EA]"
          >
            <BookOpen className="h-4 w-4 text-[#326B55]" aria-hidden="true" />
            <span>Methodology</span>
          </Link>
        </div>
      </div>

      {/* Secondary Technical Details Strip */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E4E8E2] pt-4 text-xs text-[#65716B]">
        <span className="inline-flex items-center gap-1.5 font-semibold text-[#202722]">
          <ShieldCheck className="h-4 w-4 text-[#326B55]" aria-hidden="true" />
          <span>Technical Verification Policy:</span>
        </span>
        <span>8 Supported Overworld Ore Strata</span>
        <span className="hidden sm:inline text-[#CDD4CA]">&bull;</span>
        <span>Exact 16&times;16 Chunk &amp; MCA Region Framing</span>
        <span className="hidden sm:inline text-[#CDD4CA]">&bull;</span>
        <span>Zero Unverified or Simulated Coordinates</span>
      </div>
    </div>
  );
}
