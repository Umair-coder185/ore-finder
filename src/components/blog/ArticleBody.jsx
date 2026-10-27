import Link from "next/link";
import { ArrowUpRight, BookCheck, Compass, ExternalLink, Info, ShieldCheck } from "lucide-react";
import { ArticleAdPlacement } from "./ArticleAdPlacement";

/**
 * Editorial Article Body Component (Section 6 items 10–15 & 17).
 *
 * Renders:
 * - Structured article sections with comfortable reading line length
 * - Responsive informational tables (`overflow-x-auto`)
 * - Important notes & technical callouts
 * - Contextual links to the homepage Ore Finder workspace (`/#workspace`)
 * - AdSense-ready in-article display placement after substantial content
 * - Authoritative source references (`article.sources`)
 * - Editorial verification footer
 *
 * @param {Object} props
 * @param {Object} props.article
 */
export function ArticleBody({ article }) {
  if (!article) return null;

  return (
    <article className="space-y-8 rounded-2xl border border-[#DCE2DA] bg-white p-6 shadow-xs sm:p-10">
      {article.sections.map((section, sIdx) => (
        <div key={section.id} className="space-y-8">
          <section id={section.id} className="scroll-mt-24 space-y-4">
            <h2 className="font-heading text-xl font-bold text-[#202722] sm:text-2xl">
              {section.heading}
            </h2>

            {section.paragraphs?.map((paragraph, pIdx) => (
              <p key={pIdx} className="max-w-[70ch] text-base leading-relaxed text-[#202722]/90">
                {paragraph}
              </p>
            ))}

            {/* Responsive Informational Table (Section 6 item 12) */}
            {section.table && (
              <div className="my-5 overflow-hidden rounded-xl border border-[#DCE2DA] bg-[#FAF9F6]">
                {section.table.caption && (
                  <div className="border-b border-[#E4E8E2] bg-[#F2F0EA] px-4 py-2.5 text-xs font-semibold text-[#202722]">
                    {section.table.caption}
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#DCE2DA] bg-white text-[#202722]">
                        {section.table.headers.map((header, hIdx) => (
                          <th
                            key={hIdx}
                            scope="col"
                            className="px-4 py-3 font-heading font-bold whitespace-nowrap"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E8E2]">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="transition-colors hover:bg-white/70">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={
                                cIdx === 0
                                  ? "px-4 py-3 font-semibold text-[#202722] whitespace-nowrap"
                                  : "px-4 py-3 text-[#65716B]"
                              }
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Important Note Callout (Section 6 item 13) */}
            {(section.importantNote || section.technicalNote) && (
              <div
                role="note"
                className="flex items-start gap-3 rounded-xl border border-[#C8DDD0] bg-[#E9F1EC]/75 p-4 text-xs sm:text-sm text-[#202722]"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#326B55]" aria-hidden="true" />
                <div className="leading-relaxed">
                  <strong className="font-semibold text-[#265341]">
                    Important Technical Note:{" "}
                  </strong>
                  <span>{section.importantNote || section.technicalNote}</span>
                </div>
              </div>
            )}

            {/* Contextual Link to Ore Finder Workspace (Section 6 item 15 & Section 11) */}
            {section.contextualToolLink && (
              <div className="mt-4 rounded-xl border border-[#34443B] bg-[#111916] p-5 text-[#F4F7F4]">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#69C598]">
                      <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Interactive Ore Finder Integration</span>
                    </span>
                    <p className="text-xs leading-relaxed text-[#A8B8AF]">
                      {section.contextualToolLink.note}
                    </p>
                  </div>

                  <Link
                    href={section.contextualToolLink.href}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#69C598] px-4 py-2.5 text-xs font-semibold text-[#111916] transition-colors hover:bg-[#57B386]"
                  >
                    <span>{section.contextualToolLink.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* In-Article Ad Placement after the 2nd section (Section 12) */}
          {sIdx === 1 && (
            <ArticleAdPlacement format="in-article" slotId={`article-${article.slug}-mid`} />
          )}
        </div>
      ))}

      {/* Source References Section (Section 6 item 14) */}
      {Array.isArray(article.sources) && article.sources.length > 0 && (
        <section
          aria-labelledby="article-sources-heading"
          className="border-t border-[#E4E8E2] pt-6"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#202722]">
            <BookCheck className="h-4 w-4 text-[#326B55]" aria-hidden="true" />
            <h2 id="article-sources-heading">Technical Sources &amp; Specifications</h2>
          </div>

          <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#65716B]">
            {article.sources.map((src, idx) => (
              <li
                key={idx}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#E4E8E2] bg-[#FAF9F6] px-3.5 py-2.5"
              >
                <div>
                  <span className="font-semibold text-[#202722]">{src.title}</span>
                  {src.publisher && (
                    <span className="ml-2 text-xs text-[#65716B]">({src.publisher})</span>
                  )}
                </div>

                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#326B55] hover:underline"
                  >
                    <span>Reference</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Editorial Footer (Section 6 item 17) */}
      <footer className="rounded-xl border border-[#DCE2DA] bg-[#F8F7F3] p-5 text-xs leading-relaxed text-[#65716B]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 font-semibold text-[#202722]">
            <ShieldCheck className="h-4 w-4 text-[#326B55]" aria-hidden="true" />
            <span>
              Attributed to {article.author || "OreFinder Editorial & Technical Documentation Desk"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-semibold text-[#326B55]">
            <Link href="/methodology" className="hover:underline">
              Verification Methodology
            </Link>
            <span>&bull;</span>
            <Link href="/disclaimer" className="hover:underline">
              Accuracy Classifications
            </Link>
          </div>
        </div>
        <p className="mt-2">
          All world-generation metrics in this guide are cross-checked against vanilla Minecraft
          1.18–1.21 placed_feature definitions. Remember that seed-derived Java 1.18–1.21
          coordinates in OreFinder.io represent{" "}
          <strong className="text-[#202722]">Deterministic Candidates</strong> whose in-game block
          realization depends on local cave carvers, aquifers, and air-exposure discard checks.
        </p>
      </footer>
    </article>
  );
}
