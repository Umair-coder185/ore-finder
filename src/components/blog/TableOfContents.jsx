"use client";

import { useState } from "react";
import { ChevronDown, ListTree } from "lucide-react";

/**
 * Accessible Table of Contents (Section 6 item 9).
 *
 * - On mobile (`< lg`): Collapses cleanly via an accessible toggle button
 * - On desktop (`lg+`): Displays expanded inside the sticky sidebar
 *
 * @param {Object} props
 * @param {Array<{ id: string, heading: string }>} props.sections
 */
export function TableOfContents({ sections = [] }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!sections.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl border border-[#DCE2DA] bg-white p-4 sm:p-5"
    >
      {/* Header / Mobile Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTree className="h-4 w-4 text-[#326B55]" aria-hidden="true" />
          <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#202722]">
            On This Page ({sections.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-expanded={isMobileOpen}
          className="inline-flex items-center gap-1 rounded-md border border-[#DCE2DA] bg-[#F8F7F3] px-2.5 py-1 text-xs font-semibold text-[#202722] lg:hidden cursor-pointer"
        >
          <span>{isMobileOpen ? "Hide" : "Contents"}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${isMobileOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Links List (Collapsible on Mobile, Always Visible on Desktop) */}
      <ol
        className={`mt-3.5 space-y-2.5 border-t border-[#E4E8E2] pt-3.5 text-xs sm:text-sm ${
          isMobileOpen ? "block" : "hidden lg:block"
        }`}
      >
        {sections.map((section, idx) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-start gap-2 rounded text-[#65716B] transition-colors hover:text-[#326B55] focus-visible:outline-2 focus-visible:outline-[#326B55]"
            >
              <span className="font-mono text-xs text-[#828E88]">0{idx + 1}.</span>
              <span className="leading-snug">{section.heading}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
