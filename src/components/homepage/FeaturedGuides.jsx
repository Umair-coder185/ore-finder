import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { getPublishedArticles } from "@/lib/blog";
import { Section } from "@/components/layout/Section";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Featured Guides section on the homepage connected to `getPublishedArticles()`.
 * Displays only verified, published articles (never drafts).
 */
export function FeaturedGuides() {
  const articles = getPublishedArticles().slice(0, 3);

  return (
    <Section id="featured-guides" variant="surface" bordered>
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Technical Documentation &amp; Guides
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#202722] sm:text-3xl">
            Featured World-Generation &amp; Mining Guides
          </h2>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#65716B]">
            Editorial deep dives into Minecraft&apos;s triangular distribution curves, air-exposure
            discard rules, 64-bit seed pipelines, and edition parity.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#326B55] hover:underline"
        >
          <span>Browse All Published Guides</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-10">
        {articles.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Editorial Guides in Preparation"
            description="Technical field guides covering Minecraft ore distribution and seed mechanics will appear here once published."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
