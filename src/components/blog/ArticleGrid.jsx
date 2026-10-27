"use client";

import { BookOpen, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ArticleCard } from "./ArticleCard";

/**
 * Responsive Article Grid & Pagination Controls (Section 5.E & Section 5.F).
 *
 * - Renders responsive 2-column or 3-column article cards
 * - Displays an accessible EmptyState when search or category filters return 0 matches
 * - Renders real pagination controls only when `totalPages > 1`
 *
 * @param {Object} props
 * @param {Array<Object>} props.articles
 * @param {number} props.currentPage
 * @param {number} props.totalPages
 * @param {number} props.totalItems
 * @param {function(number): void} props.onChangePage
 * @param {function(): void} props.onResetFilters
 */
export function ArticleGrid({
  articles = [],
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onChangePage,
  onResetFilters,
}) {
  if (articles.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          icon={BookOpen}
          title="No Matching Technical Guides Found"
          description="No published guides match your current search term or category filter. Clear your filter to browse all verified Minecraft world-generation and mining guides."
          action={
            onResetFilters ? (
              <Button type="button" variant="secondary" size="sm" onClick={onResetFilters}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset Search &amp; Category Filter</span>
              </Button>
            ) : null
          }
        />
      </div>
    );
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <section aria-label="Published Minecraft Guides" className="mt-8 space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {/* Real Pagination Controls — only rendered when article count exceeds per-page limit */}
      {totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DCE2DA] bg-white px-5 py-4 text-xs sm:text-sm"
        >
          <span className="text-[#65716B]">
            Showing page <strong className="text-[#202722]">{currentPage}</strong> of{" "}
            <strong className="text-[#202722]">{totalPages}</strong> ({totalItems} published guides)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onChangePage(currentPage - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#DCE2DA] bg-white px-3 py-1.5 font-semibold text-[#202722] transition-colors hover:border-[#326B55] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span>Previous</span>
            </button>

            {pageNumbers.map((num) => {
              const isCurrent = num === currentPage;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChangePage(num)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent
                      ? "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#326B55] bg-[#326B55] font-mono text-xs font-bold text-white cursor-pointer"
                      : "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCE2DA] bg-white font-mono text-xs font-semibold text-[#202722] hover:border-[#326B55] cursor-pointer"
                  }
                >
                  {num}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onChangePage(currentPage + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#DCE2DA] bg-white px-3 py-1.5 font-semibold text-[#202722] transition-colors hover:border-[#326B55] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}
