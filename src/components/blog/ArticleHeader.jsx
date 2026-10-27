import Image from "next/image";
import { ArticleMetadata } from "./ArticleMetadata";

/**
 * Editorial Article Header (Section 6 items 2–8):
 * - Category, publication date, update date, reading time & verified author attribution
 * - Article headline (`h1`)
 * - Article summary (`description`)
 * - Responsive Hero Image with explicit intrinsic dimensions (`1200×630`)
 *
 * @param {Object} props
 * @param {Object} props.article
 */
export function ArticleHeader({ article }) {
  if (!article) return null;

  return (
    <header className="mt-6 space-y-6">
      <div className="max-w-3xl space-y-4">
        <ArticleMetadata article={article} />

        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#202722] sm:text-4xl sm:leading-[1.15]">
          {article.title}
        </h1>

        <p className="text-base leading-relaxed text-[#65716B] sm:text-lg">
          {article.description || article.excerpt}
        </p>
      </div>

      {article.image && (
        <figure className="overflow-hidden rounded-2xl border border-[#DCE2DA] bg-[#111916] shadow-xs">
          <Image
            src={article.image}
            alt={article.imageAlt || article.title}
            width={1200}
            height={630}
            priority
            className="aspect-[1200/630] max-h-[440px] w-full object-cover"
          />
          {article.imageAlt && (
            <figcaption className="border-t border-[#26332C] bg-[#15201B] px-4 py-2.5 text-xs text-[#A8B8AF]">
              <span className="font-mono font-semibold text-[#69C598]">Figure 01: </span>
              <span>{article.imageAlt}</span>
            </figcaption>
          )}
        </figure>
      )}
    </header>
  );
}
