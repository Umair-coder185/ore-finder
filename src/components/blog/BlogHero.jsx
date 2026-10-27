import { BookOpen, ShieldCheck } from "lucide-react";
import { BLOG_HERO_CONTENT } from "@/config/blog";

/**
 * Editorial Blog Hero Section (Section 5.A).
 *
 * Uses the exact headline and supporting copy specified in Master Prompt 04:
 * - Headline: "Minecraft Guides & Ore-Finding Insights"
 * - Copy: "Explore practical Minecraft mining guides, ore distribution information,
 *   world-generation explanations, and version-specific resources."
 */
export function BlogHero({ totalPublished = 0 }) {
  return (
    <header className="border-b border-[#E4E8E2] pb-8 sm:pb-10">
      <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-[#326B55]">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C8DDD0] bg-[#E9F1EC] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[#265341]">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{BLOG_HERO_CONTENT.eyebrow}</span>
        </span>
        {totalPublished > 0 && (
          <span className="inline-flex items-center gap-1 text-[#65716B]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
            <span>{totalPublished} Verified Technical Guides</span>
          </span>
        )}
      </div>

      <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold tracking-tight text-[#202722] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
        {BLOG_HERO_CONTENT.headline}
      </h1>

      <p className="mt-3.5 max-w-2xl text-base leading-relaxed text-[#65716B] sm:text-lg">
        {BLOG_HERO_CONTENT.description}
      </p>
    </header>
  );
}
