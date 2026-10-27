import { ArticleCard } from "./ArticleCard";

/**
 * Displays related published technical guides at the bottom of an article (Section 6 item 16).
 *
 * @param {Object} props
 * @param {Array<Object>} props.articles
 */
export function RelatedArticles({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section
      aria-labelledby="related-guides-heading"
      className="mt-14 border-t border-[#E4E8E2] pt-12"
    >
      <div className="mb-6">
        <h2
          id="related-guides-heading"
          className="font-heading text-xl font-bold text-[#202722] sm:text-2xl"
        >
          Related Technical Guides
        </h2>
        <p className="mt-1 text-sm text-[#65716B]">
          Complementary world-generation references, seed mechanics, and ore stratum breakdowns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
