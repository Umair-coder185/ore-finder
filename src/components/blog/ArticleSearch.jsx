"use client";

import { Search, X } from "lucide-react";

/**
 * Accessible Client-Side Article Search Input (Section 5.D).
 *
 * Searches across published article titles, descriptions, tags, and Minecraft versions.
 * Provides:
 * - Search input with explicit `<label>`
 * - Clear button with keyboard focus support
 * - Result count feedback via `aria-live="polite"`
 *
 * @param {Object} props
 * @param {string} props.query
 * @param {function(string): void} props.onChangeQuery
 * @param {function(): void} props.onClear
 * @param {number} props.matchCount
 */
export function ArticleSearch({ query = "", onChangeQuery, onClear, matchCount = 0 }) {
  return (
    <div role="search" aria-label="Search published Minecraft guides" className="w-full">
      <label
        htmlFor="blog-article-search-input"
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#65716B]"
      >
        Search Guides &amp; Mechanics
      </label>

      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#65716B]"
          aria-hidden="true"
        />
        <input
          id="blog-article-search-input"
          type="search"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder="Search by ore, Y-level, Xoroshiro128++, 1.21, branch mining…"
          className="h-10 w-full rounded-lg border border-[#DCE2DA] bg-white pr-20 pl-10 text-sm text-[#202722] placeholder:text-[#828E88] focus:border-[#326B55] focus:outline-none"
        />

        {query.trim().length > 0 && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear article search query"
            className="absolute right-2 inline-flex items-center gap-1 rounded-md bg-[#F2F0EA] px-2 py-1 text-xs font-medium text-[#202722] hover:bg-[#E4E8E2] cursor-pointer"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div aria-live="polite" className="mt-1.5 text-xs text-[#65716B]">
        {query.trim().length > 0 ? (
          <span>
            Found <strong className="text-[#202722]">{matchCount}</strong>{" "}
            {matchCount === 1 ? "published guide" : "published guides"} matching{" "}
            <span className="font-mono text-[#326B55]">&ldquo;{query.trim()}&rdquo;</span>
          </span>
        ) : (
          <span>
            Filter by title, ore type, elevation stratum, PRNG algorithm, or release version.
          </span>
        )}
      </div>
    </div>
  );
}
