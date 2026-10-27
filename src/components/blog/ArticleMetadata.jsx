import Link from "next/link";
import { Calendar, Clock, FileCheck2, Layers, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

/**
 * Displays verified article metadata (Section 6):
 * - Category label
 * - Target Minecraft versions
 * - Publication date (`publishedAt`)
 * - Last meaningful update date (`updatedAt`)
 * - Reading time
 * - Verified institutional author attribution (`author`)
 *
 * @param {Object} props
 * @param {Object} props.article
 */
export function ArticleMetadata({ article }) {
  if (!article) return null;

  const categoryName = article.categoryMeta?.name || article.category;
  const publishedDate = article.publishedAt || article.lastReviewed;
  const updatedDate = article.updatedAt || article.lastReviewed;
  const authorName = article.author || "OreFinder Editorial & Technical Documentation Desk";

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-[#65716B]">
      <Badge variant="emerald">{categoryName}</Badge>

      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#202722]">
        <Layers className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
        <span>{article.targetVersions}</span>
      </span>

      {publishedDate && (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
          <span>
            Published <time dateTime={publishedDate}>{publishedDate}</time>
          </span>
        </span>
      )}

      {updatedDate && (
        <span className="inline-flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
          <span>
            Updated <time dateTime={updatedDate}>{updatedDate}</time>
          </span>
        </span>
      )}

      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
        <span>{article.readingTime}</span>
      </span>

      <Link
        href="/methodology"
        className="inline-flex items-center gap-1.5 font-semibold text-[#202722] hover:text-[#326B55] hover:underline"
      >
        <FileCheck2 className="h-3.5 w-3.5 text-[#326B55]" aria-hidden="true" />
        <span>{authorName}</span>
      </Link>
    </div>
  );
}
