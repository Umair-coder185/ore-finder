import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Clock, Layers } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/**
 * Reusable Editorial Article Card (Section 5.E).
 *
 * Displays:
 * - Featured image with intrinsic dimensions and lazy loading
 * - Category label
 * - Descriptive title
 * - Excerpt
 * - Publication date
 * - Reading time
 *
 * @param {Object} props
 * @param {Object} props.article
 */
export function ArticleCard({ article }) {
  if (!article) return null;

  const categoryLabel = article.categoryMeta?.name || article.category;
  const publishedDate = article.publishedAt || article.lastReviewed;

  return (
    <Card
      as="article"
      variant="light"
      padding="none"
      className="group flex h-full flex-col justify-between overflow-hidden transition-colors hover:border-[#326B55]/50"
    >
      <div>
        {article.image && (
          <Link
            href={`/blog/${article.slug}`}
            tabIndex={-1}
            aria-hidden="true"
            className="block overflow-hidden border-b border-[#E4E8E2] bg-[#111916]"
          >
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              width={1200}
              height={630}
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="emerald">{categoryLabel}</Badge>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#65716B]">
              <Layers className="h-3 w-3 text-[#326B55]" aria-hidden="true" />
              <span>{article.targetVersions}</span>
            </span>
          </div>

          <h3 className="mt-3.5 font-heading text-lg font-bold leading-snug text-[#202722] group-hover:text-[#326B55]">
            <Link href={`/blog/${article.slug}`} className="focus-visible:rounded">
              {article.title}
            </Link>
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-[#65716B]">
            {article.description || article.excerpt}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#E4E8E2] bg-[#FAF9F6] px-5 py-3.5 text-xs text-[#65716B] sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          {publishedDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
              <time dateTime={publishedDate}>{publishedDate}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
            <span>{article.readingTime}</span>
          </span>
        </div>

        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-[#326B55] group-hover:underline"
        >
          <span>Read Guide</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
