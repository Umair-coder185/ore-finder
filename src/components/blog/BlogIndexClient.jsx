"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { ARTICLES_PER_PAGE } from "@/config/blog";
import { FeaturedArticle } from "./FeaturedArticle";
import { CategoryNavigation } from "./CategoryNavigation";
import { ArticleSearch } from "./ArticleSearch";
import { ArticleGrid } from "./ArticleGrid";
import { ArticleAdPlacement } from "./ArticleAdPlacement";

/**
 * Interactive Editorial Blog Index Workspace combining:
 * - FeaturedArticle (when on unfiltered view)
 * - CategoryNavigation (6 data-driven categories)
 * - ArticleSearch (instant client-side search across titles, descriptions, tags, versions)
 * - ArticleGrid with real pagination
 * - AdSense-ready blog index advertising placement
 * - Direct contextual link back to the homepage Ore Finder workspace
 */
export function BlogIndexClient({
  publishedArticles = [],
  featuredArticle = null,
  categories = [],
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return publishedArticles.filter((article) => {
      if (activeCategory !== "all" && article.category !== activeCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        article.title,
        article.description,
        article.excerpt,
        article.categoryMeta?.name,
        article.targetVersions,
        ...(article.tags || []),
        ...(article.minecraftVersions || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [publishedArticles, activeCategory, searchQuery]);

  const totalItems = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ARTICLES_PER_PAGE));
  const safeCurrentPage = Math.max(1, Math.min(totalPages, currentPage));

  const paginatedArticles = useMemo(() => {
    const start = (safeCurrentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [filteredArticles, safeCurrentPage]);

  function handleSelectCategory(catId) {
    setActiveCategory(catId);
    setCurrentPage(1);
  }

  function handleChangeQuery(nextQuery) {
    setSearchQuery(nextQuery);
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setActiveCategory("all");
    setSearchQuery("");
    setCurrentPage(1);
  }

  const isDefaultView =
    activeCategory === "all" && searchQuery.trim().length === 0 && safeCurrentPage === 1;

  return (
    <div>
      {/* B. Featured Article (displayed on unfiltered landing state when published content exists) */}
      {isDefaultView && featuredArticle && <FeaturedArticle article={featuredArticle} />}

      {/* C & D. Category Navigation + Client-Side Article Search Bar */}
      <div className="mt-10 rounded-2xl border border-[#DCE2DA] bg-white p-5 shadow-2xs sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <CategoryNavigation
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              totalCount={publishedArticles.length}
            />
          </div>

          <div className="lg:col-span-5">
            <ArticleSearch
              query={searchQuery}
              onChangeQuery={handleChangeQuery}
              onClear={() => handleChangeQuery("")}
              matchCount={totalItems}
            />
          </div>
        </div>
      </div>

      {/* E & F. Responsive Article Grid + Real Pagination */}
      <ArticleGrid
        articles={paginatedArticles}
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onChangePage={setCurrentPage}
        onResetFilters={handleResetFilters}
      />

      {/* AdSense-Ready Blog Index Placement (Clearly separated from cards and pagination) */}
      <ArticleAdPlacement format="horizontal" slotId="blog-index-display-01" className="mt-12" />

      {/* Contextual Ore Finder Utility Banner */}
      <section
        aria-label="Open Ore Finder Workspace"
        className="mt-10 rounded-2xl border border-[#34443B] bg-[#111916] p-6 text-[#F4F7F4] sm:p-8"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#69C598]">
              Interactive World Analysis Utility
            </span>
            <h2 className="mt-1.5 font-heading text-xl font-bold text-[#F4F7F4] sm:text-2xl">
              Apply These Distribution Strata to Your Minecraft Seed
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#A8B8AF]">
              Use the homepage Ore Finder workspace to inspect deterministic Java 1.18–1.21
              candidate placements and verified Y-level distribution curves for your exact
              coordinates.
            </p>
          </div>

          <Link
            href="/#workspace"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#69C598] px-5 py-3 text-sm font-semibold text-[#111916] transition-colors hover:bg-[#57B386]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>Open Ore Finder Workspace</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
