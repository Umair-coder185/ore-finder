"use client";

import { FolderKanban } from "lucide-react";

/**
 * Data-driven Category Navigation bar (Section 5.C).
 *
 * Categories:
 * - All Guides
 * - Ore Guides
 * - Mining Strategies
 * - World Generation
 * - Minecraft Seeds
 * - Java vs Bedrock
 * - Updates & Changes
 *
 * @param {Object} props
 * @param {Array<{ id: string, name: string, description: string, count: number }>} props.categories
 * @param {string} props.activeCategory
 * @param {function(string): void} props.onSelectCategory
 * @param {number} props.totalCount
 */
export function CategoryNavigation({
  categories = [],
  activeCategory = "all",
  onSelectCategory,
  totalCount = 0,
}) {
  return (
    <nav aria-label="Blog article categories" className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#65716B]">
        <FolderKanban className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
        <span>Browse by Topic Category</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          aria-pressed={activeCategory === "all"}
          className={
            activeCategory === "all"
              ? "inline-flex items-center gap-1.5 rounded-lg border border-[#326B55] bg-[#326B55] px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
              : "inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2DA] bg-white px-3.5 py-2 text-xs font-medium text-[#202722] transition-colors hover:border-[#326B55]/50 hover:bg-[#F2F0EA] cursor-pointer"
          }
        >
          <span>All Guides</span>
          <span
            className={
              activeCategory === "all"
                ? "rounded-full bg-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white"
                : "rounded-full bg-[#F2F0EA] px-1.5 py-0.5 font-mono text-[10px] text-[#65716B]"
            }
          >
            {totalCount}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isSelected}
              className={
                isSelected
                  ? "inline-flex items-center gap-1.5 rounded-lg border border-[#326B55] bg-[#326B55] px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-colors cursor-pointer"
                  : "inline-flex items-center gap-1.5 rounded-lg border border-[#DCE2DA] bg-white px-3.5 py-2 text-xs font-medium text-[#202722] transition-colors hover:border-[#326B55]/50 hover:bg-[#F2F0EA] cursor-pointer"
              }
            >
              <span>{cat.name}</span>
              <span
                className={
                  isSelected
                    ? "rounded-full bg-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white"
                    : "rounded-full bg-[#F2F0EA] px-1.5 py-0.5 font-mono text-[10px] text-[#65716B]"
                }
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
