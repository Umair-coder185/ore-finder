import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleHeader } from "./ArticleHeader";
import { TableOfContents } from "./TableOfContents";
import { ArticleBody } from "./ArticleBody";
import { RelatedArticles } from "./RelatedArticles";
import { ArticleAdPlacement } from "./ArticleAdPlacement";

/**
 * Complete Professional Article Template Layout (`/blog/[slug]`, Section 6).
 *
 * Integrates all 17 required elements:
 * 1. Breadcrumbs
 * 2–8. ArticleHeader (Category, Headline, Summary, Verified Author, Published/Updated dates, Hero image)
 * 9. TableOfContents (Collapsible on mobile, sticky on desktop)
 * 10–15 & 17. ArticleBody (Sections, Tables, Important Notes, Contextual Tool Links, Sources, Editorial Footer)
 * 16. RelatedArticles
 *
 * @param {Object} props
 * @param {Object} props.article
 * @param {Array<Object>} [props.relatedArticles]
 */
export function ArticleLayout({ article, relatedArticles = [] }) {
  const categoryName = article.categoryMeta?.name || article.category;

  return (
    <div className="py-10 sm:py-14">
      <Container>
        {/* 1. Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: categoryName, href: "/blog" },
            { label: article.title },
          ]}
        />

        {/* 2–8. Article Header & Hero Figure */}
        <ArticleHeader article={article} />

        {/* Mobile Collapsible Table of Contents */}
        <div className="mt-8 lg:hidden">
          <TableOfContents sections={article.sections} />
        </div>

        {/* Main Two-Column Reading Grid */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-12">
          {/* 10–15 & 17. Article Content Body */}
          <div className="lg:col-span-8">
            <ArticleBody article={article} />
          </div>

          {/* Desktop Sidebar: Sticky TOC + Relevant Ore Finder Link + Sidebar Ad Placement */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="hidden lg:block">
                <TableOfContents sections={article.sections} />
              </div>

              {/* 15. Relevant Ore Finder Workspace Card */}
              <div className="rounded-xl border border-[#34443B] bg-[#111916] p-5 text-[#F4F7F4]">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#69C598]">
                  Interactive Utility
                </span>
                <h3 className="mt-1.5 font-heading text-base font-bold text-[#F4F7F4]">
                  Analyze Your World Seed &amp; Strata
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#A8B8AF]">
                  Configure your edition, release version, 64-bit seed, and origin coordinates in
                  the homepage Ore Finder workspace.
                </p>
                <Link
                  href="/#workspace"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#69C598] px-4 py-2.5 text-xs font-semibold text-[#111916] transition-colors hover:bg-[#57B386]"
                >
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  <span>Open Ore Finder Workspace</span>
                </Link>
              </div>

              {/* Desktop Sidebar Ad Placement (Clearly separated from interactive workspace) */}
              <ArticleAdPlacement
                format="sidebar"
                slotId={`article-${article.slug}-sidebar`}
                className="my-0"
              />
            </div>
          </aside>
        </div>

        {/* 16. Related Articles */}
        <RelatedArticles articles={relatedArticles} />
      </Container>
    </div>
  );
}
