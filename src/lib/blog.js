import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_IDS,
  VERIFIED_AUTHORS,
  ARTICLES_PER_PAGE,
  getCategoryById,
} from "../config/blog.js";
import { BLOG_ARTICLES } from "../content/blog/articles.js";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates an article's metadata against the Phase 04 editorial schema (Section 7).
 *
 * Rules enforced:
 * 1. Required strings: `title`, `slug`, `description`, `category`, `author`, `publishedAt`, `updatedAt`, `status`, `image`
 * 2. Valid category in `BLOG_CATEGORY_IDS`
 * 3. Verified institutional author in `VERIFIED_AUTHORS` (prevents fabricated human personas)
 * 4. Valid ISO dates (`YYYY-MM-DD`) for `publishedAt` and `updatedAt`
 * 5. Valid status (`"draft"` or `"published"`)
 * 6. Arrays for `tags`, `minecraftVersions`, `sources`, `sections`
 *
 * @param {Object} article
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateArticleMetadata(article) {
  const errors = [];

  if (!article || typeof article !== "object") {
    return { isValid: false, errors: ["Article must be an object."] };
  }

  const requiredStrings = [
    "title",
    "slug",
    "description",
    "category",
    "author",
    "publishedAt",
    "updatedAt",
    "status",
    "image",
  ];

  for (const field of requiredStrings) {
    if (typeof article[field] !== "string" || !article[field].trim()) {
      errors.push(`Missing or empty required string field: "${field}".`);
    }
  }

  if (article.category && !BLOG_CATEGORY_IDS.includes(article.category)) {
    errors.push(
      `Invalid category "${article.category}". Must be one of: ${BLOG_CATEGORY_IDS.join(", ")}.`
    );
  }

  if (article.author && !VERIFIED_AUTHORS[article.author]) {
    errors.push(
      `Unverified author "${article.author}". Fabricated individual author personas are prohibited.`
    );
  }

  if (article.publishedAt && !ISO_DATE_REGEX.test(article.publishedAt)) {
    errors.push(`Invalid publishedAt date "${article.publishedAt}". Expected YYYY-MM-DD.`);
  }

  if (article.updatedAt && !ISO_DATE_REGEX.test(article.updatedAt)) {
    errors.push(`Invalid updatedAt date "${article.updatedAt}". Expected YYYY-MM-DD.`);
  }

  if (article.status !== "draft" && article.status !== "published") {
    errors.push(`Invalid status "${article.status}". Expected "draft" or "published".`);
  }

  if (typeof article.featured !== "boolean") {
    errors.push(`Field "featured" must be a boolean.`);
  }

  if (!Array.isArray(article.tags)) {
    errors.push(`Field "tags" must be an array.`);
  }

  if (!Array.isArray(article.minecraftVersions)) {
    errors.push(`Field "minecraftVersions" must be an array.`);
  }

  if (!Array.isArray(article.sources) || article.sources.length === 0) {
    errors.push(`Field "sources" must be a non-empty array of citations.`);
  }

  if (!Array.isArray(article.sections) || article.sections.length === 0) {
    errors.push(`Field "sections" must be a non-empty array.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Enriches a validated article with resolved category and author metadata.
 * @param {Object} article
 */
function enrichArticle(article) {
  const categoryMeta = getCategoryById(article.category);
  const authorMeta = VERIFIED_AUTHORS[article.author] || {
    name: article.author,
    role: "Technical Documentation Team",
    type: "Organization",
    url: "https://orefinder.io/about",
  };

  return {
    ...article,
    categoryMeta,
    authorMeta,
    isApprovedForIndex: article.status === "published",
    lastReviewed: article.updatedAt,
    editorialTeam: article.author,
  };
}

/**
 * Returns all validated, published articles sorted newest-first.
 * Draft or invalid articles are strictly excluded.
 */
export function getPublishedArticles() {
  return BLOG_ARTICLES.filter((article) => {
    const validation = validateArticleMetadata(article);
    return validation.isValid && article.status === "published";
  })
    .map(enrichArticle)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Returns all draft articles (for editorial workflow inspection and automated tests).
 */
export function getDraftArticles() {
  return BLOG_ARTICLES.filter((article) => article.status === "draft").map(enrichArticle);
}

/**
 * Returns the primary featured published article, or `null` if none exists.
 */
export function getFeaturedArticle() {
  const published = getPublishedArticles();
  if (published.length === 0) return null;
  return published.find((a) => a.featured) || published[0];
}

/**
 * Resolves a single published article by slug.
 * Returns `null` if the slug does not exist or if the article is a `draft`.
 *
 * @param {string} slug
 */
export function getPublishedArticleBySlug(slug) {
  if (!slug || typeof slug !== "string") return null;
  const published = getPublishedArticles();
  return published.find((article) => article.slug === slug) || null;
}

/**
 * Resolves related published articles for an article.
 * Never returns draft articles or self-links.
 *
 * @param {Object} article
 */
export function getRelatedPublishedArticles(article) {
  if (!article) return [];
  const published = getPublishedArticles();
  const explicitSlugs = Array.isArray(article.relatedSlugs) ? article.relatedSlugs : [];

  const matched = explicitSlugs
    .map((slug) => published.find((a) => a.slug === slug && a.slug !== article.slug))
    .filter(Boolean);

  if (matched.length >= 2) {
    return matched.slice(0, 3);
  }

  // Fallback to same-category published articles if needed
  const fallback = published.filter(
    (a) =>
      a.slug !== article.slug &&
      !matched.some((m) => m.slug === a.slug) &&
      a.category === article.category
  );

  return [...matched, ...fallback].slice(0, 3);
}

/**
 * Returns all data-driven categories with their published article counts.
 */
export function getCategoriesWithCounts() {
  const published = getPublishedArticles();
  return BLOG_CATEGORIES.map((category) => {
    const count = published.filter((a) => a.category === category.id).length;
    return {
      ...category,
      count,
    };
  });
}

/**
 * Filters and paginates published articles by category and search query.
 * Never creates out-of-range empty pages when articles exist.
 *
 * @param {Object} options
 * @param {string} [options.category="all"]
 * @param {string} [options.search=""]
 * @param {number} [options.page=1]
 * @param {number} [options.perPage=ARTICLES_PER_PAGE]
 */
export function queryPublishedArticles({
  category = "all",
  search = "",
  page = 1,
  perPage = ARTICLES_PER_PAGE,
} = {}) {
  const allPublished = getPublishedArticles();
  const normalizedCategory =
    category && category !== "all" && BLOG_CATEGORY_IDS.includes(category) ? category : "all";
  const normalizedQuery = String(search || "")
    .trim()
    .toLowerCase();

  const filtered = allPublished.filter((article) => {
    if (normalizedCategory !== "all" && article.category !== normalizedCategory) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      article.title,
      article.description,
      article.excerpt,
      article.categoryMeta?.name,
      article.targetVersions,
      ...(article.tags || []),
      ...(article.minecraftVersions || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  const safePerPage = Math.max(1, Math.floor(Number(perPage) || ARTICLES_PER_PAGE));
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePerPage));
  const requestedPage = Math.floor(Number(page) || 1);
  const currentPage = Math.max(1, Math.min(totalPages, requestedPage));

  const startIndex = (currentPage - 1) * safePerPage;
  const items = filtered.slice(startIndex, startIndex + safePerPage);

  return {
    items,
    totalItems,
    totalPages,
    currentPage,
    perPage: safePerPage,
    category: normalizedCategory,
    search: String(search || "").trim(),
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}
