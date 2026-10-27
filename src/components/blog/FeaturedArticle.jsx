import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock, Layers, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

/**
 * Prominent Featured Article Card on `/blog` (Section 5.B).
 *
 * Includes:
 * - Featured image with explicit intrinsic dimensions
 * - Category label
 * - Title
 * - Excerpt
 * - Publication date
 * - Reading time
 * - Article link
 *
 * Only rendered when a published featured article exists.
 *
 * @param {Object} props
 * @param {Object|null} props.article
 */
export function FeaturedArticle({ article }) {
  if (!article || article.status !== "published") {
    return null;
  }

  const categoryName = article.categoryMeta?.name || article.category;

  return (
    <section aria-labelledby="featured-guide-heading" className="mt-8 sm:mt-10">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#326B55]">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        <span id="featured-guide-heading">Featured Technical Reference</span>
      </div>

      <article className="group overflow-hidden rounded-2xl border border-[#DCE2DA] bg-white shadow-xs transition-colors hover:border-[#326B55]/50">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Featured Technical Illustration */}
          <div className="relative overflow-hidden border-b border-[#E4E8E2] bg-[#111916] lg:col-span-6 lg:border-r lg:border-b-0">
            <Link
              href={`/blog/${article.slug}`}
              className="block h-full w-full focus-visible:outline-none"
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image
                src={article.image}
                alt={article.imageAlt || article.title}
                width={1200}
                height={630}
                priority
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </Link>
          </div>

          {/* Featured Editorial Details */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="emerald">{categoryName}</Badge>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-[#65716B]">
                  <Layers className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
                  <span>{article.targetVersions}</span>
                </span>
              </div>

              <h2 className="mt-4 font-heading text-xl font-bold leading-snug text-[#202722] group-hover:text-[#326B55] sm:text-2xl">
                <Link href={`/blog/${article.slug}`} className="focus-visible:rounded">
                  {article.title}
                </Link>
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#65716B] sm:text-base">
                {article.description || article.excerpt}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E8E2] pt-4 text-xs text-[#65716B]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
                  <time dateTime={article.publishedAt}>Published {article.publishedAt}</time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
                  <span>{article.readingTime}</span>
                </span>
              </div>

              <Link
                href={`/blog/${article.slug}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#E9F1EC] px-3 py-1.5 font-semibold text-[#265341] transition-colors hover:bg-[#D8E7DE]"
              >
                <span>Read Featured Guide</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
