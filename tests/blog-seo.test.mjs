import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_IDS,
  VERIFIED_AUTHORS,
  CONTENT_CLUSTER_MAP,
  ARTICLES_PER_PAGE,
} from "../src/config/blog.js";

import { BLOG_ARTICLES } from "../src/content/blog/articles.js";

import {
  validateArticleMetadata,
  getPublishedArticles,
  getDraftArticles,
  getFeaturedArticle,
  getPublishedArticleBySlug,
  getRelatedPublishedArticles,
  getCategoriesWithCounts,
  queryPublishedArticles,
} from "../src/lib/blog.js";

import { constructMetadata } from "../src/lib/seo.js";
import {
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateBlogIndexSchema,
} from "../src/lib/structured-data.js";

import sitemap from "../src/app/sitemap.js";

// ============================================================================
// 1. METADATA VALIDATION & AUTHOR INTEGRITY TESTS
// ============================================================================

test("Blog CMS: all repository articles pass schema validation & use verified institutional authors", () => {
  assert.ok(BLOG_ARTICLES.length >= 6);

  for (const article of BLOG_ARTICLES) {
    const validation = validateArticleMetadata(article);
    assert.equal(
      validation.isValid,
      true,
      `Article "${article.slug}" failed validation: ${validation.errors.join("; ")}`
    );
    assert.ok(VERIFIED_AUTHORS[article.author]);

    // Verify image asset exists in public/
    const publicImgPath = path.join(
      process.cwd(),
      "public",
      article.image.replace(/^\//, "")
    );
    assert.equal(
      fs.existsSync(publicImgPath),
      true,
      `Missing image asset at ${publicImgPath}`
    );
  }

  // Verify fabricated human author persona is rejected
  const fakeAuthorResult = validateArticleMetadata({
    ...BLOG_ARTICLES[0],
    author: "John Doe Minecraft Expert",
  });
  assert.equal(fakeAuthorResult.isValid, false);
  assert.ok(
    fakeAuthorResult.errors.some((e) => e.includes("Unverified author"))
  );
});

// ============================================================================
// 2. DRAFT EXCLUSION & PUBLISHED CONTENT DISCOVERY TESTS
// ============================================================================

test("Blog CMS: draft articles are strictly excluded from public discovery, slug resolution, and related articles", () => {
  const published = getPublishedArticles();
  const drafts = getDraftArticles();

  assert.equal(published.length, 6);
  assert.equal(drafts.length, 2);

  for (const pub of published) {
    assert.equal(pub.status, "published");
    assert.equal(pub.isApprovedForIndex, true);
  }

  for (const draft of drafts) {
    assert.equal(draft.status, "draft");
    // Draft slug must return null in public slug resolver
    assert.equal(getPublishedArticleBySlug(draft.slug), null);
  }

  // Unknown slug returns null
  assert.equal(getPublishedArticleBySlug("non-existent-guide-slug"), null);

  // Featured article is published
  const featured = getFeaturedArticle();
  assert.ok(featured);
  assert.equal(featured.status, "published");
  assert.equal(featured.featured, true);

  // Related articles never include drafts or self-links
  for (const pub of published) {
    const related = getRelatedPublishedArticles(pub);
    for (const rel of related) {
      assert.equal(rel.status, "published");
      assert.notEqual(rel.slug, pub.slug);
    }
  }
});

// ============================================================================
// 3. CATEGORY FILTERING, SEARCH & PAGINATION TESTS
// ============================================================================

test("Blog CMS: data-driven categories, client search filtering, and real pagination", () => {
  // All 6 categories from Section 5.C exist
  assert.deepEqual(BLOG_CATEGORY_IDS, [
    "ore-guides",
    "mining-strategies",
    "world-generation",
    "minecraft-seeds",
    "java-vs-bedrock",
    "updates-and-changes",
  ]);

  const categoriesWithCounts = getCategoriesWithCounts();
  assert.equal(categoriesWithCounts.length, 6);

  // Topic cluster map covers all 4 clusters (A, B, C, D)
  assert.equal(CONTENT_CLUSTER_MAP.length, 4);

  // Pagination: 6 published articles with perPage = 4 -> Page 1 has 4 items, Page 2 has 2 items
  const page1 = queryPublishedArticles({
    category: "all",
    search: "",
    page: 1,
    perPage: ARTICLES_PER_PAGE,
  });
  assert.equal(page1.totalItems, 6);
  assert.equal(page1.totalPages, 2);
  assert.equal(page1.currentPage, 1);
  assert.equal(page1.items.length, 4);
  assert.equal(page1.hasNextPage, true);
  assert.equal(page1.hasPrevPage, false);

  const page2 = queryPublishedArticles({
    category: "all",
    search: "",
    page: 2,
    perPage: ARTICLES_PER_PAGE,
  });
  assert.equal(page2.currentPage, 2);
  assert.equal(page2.items.length, 2);
  assert.equal(page2.hasNextPage, false);
  assert.equal(page2.hasPrevPage, true);

  // Out-of-bounds page clamps to last valid page (no empty indexable pagination pages)
  const page99 = queryPublishedArticles({
    category: "all",
    search: "",
    page: 99,
    perPage: ARTICLES_PER_PAGE,
  });
  assert.equal(page99.currentPage, 2);
  assert.equal(page99.items.length, 2);

  // Category filter
  const seedGuides = queryPublishedArticles({ category: "minecraft-seeds" });
  assert.equal(seedGuides.totalItems, 1);
  assert.equal(
    seedGuides.items[0].slug,
    "how-minecraft-64-bit-seeds-and-xoroshiro128-work"
  );

  // Search filter
  const searchXoroshiro = queryPublishedArticles({ search: "Xoroshiro128++" });
  assert.ok(searchXoroshiro.totalItems >= 2);

  // Search for draft-only keyword returns 0 results
  const searchDraftOnly = queryPublishedArticles({ search: "Ancient Debris" });
  assert.equal(searchDraftOnly.totalItems, 0);
});

// ============================================================================
// 4. TECHNICAL SEO, CANONICAL URLS, JSON-LD & SITEMAP TESTS
// ============================================================================

test("SEO & Sitemap: canonical URLs, Open Graph, truthful JSON-LD, and draft-free sitemap", () => {
  const sampleArticle = getPublishedArticleBySlug(
    "minecraft-1-21-ore-distribution-strata-guide"
  );
  assert.ok(sampleArticle);

  const meta = constructMetadata({
    title: sampleArticle.title,
    description: sampleArticle.description,
    path: `/blog/${sampleArticle.slug}`,
    noIndex: false,
    type: "article",
    publishedTime: sampleArticle.publishedAt,
    modifiedTime: sampleArticle.updatedAt,
    image: sampleArticle.image,
    imageAlt: sampleArticle.imageAlt,
    tags: sampleArticle.tags,
  });

  assert.equal(
    meta.alternates.canonical,
    "https://orefinder.io/blog/minecraft-1-21-ore-distribution-strata-guide"
  );
  assert.equal(meta.openGraph.type, "article");
  assert.equal(meta.openGraph.publishedTime, "2026-10-20");
  assert.equal(meta.openGraph.modifiedTime, "2026-10-27");
  assert.equal(meta.openGraph.images[0].width, 1200);
  assert.equal(meta.openGraph.images[0].height, 630);
  assert.equal(meta.robots.index, true);

  // JSON-LD BlogPosting matches visible article data
  const articleSchema = generateArticleSchema(sampleArticle);
  assert.equal(articleSchema["@type"], "BlogPosting");
  assert.equal(articleSchema.headline, sampleArticle.title);
  assert.equal(articleSchema.datePublished, sampleArticle.publishedAt);
  assert.equal(articleSchema.dateModified, sampleArticle.updatedAt);
  assert.equal(articleSchema.author["@type"], "Organization");
  assert.equal(articleSchema.author.name, sampleArticle.author);
  assert.equal(articleSchema.aggregateRating, undefined); // No fake ratings

  // JSON-LD BreadcrumbList & Blog Index
  const breadcrumbs = generateBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ]);
  assert.equal(breadcrumbs["@type"], "BreadcrumbList");
  assert.equal(breadcrumbs.itemListElement.length, 2);

  const blogIndexSchema = generateBlogIndexSchema(getPublishedArticles());
  assert.equal(blogIndexSchema["@type"], "Blog");
  assert.equal(blogIndexSchema.blogPost.length, 6);

  const websiteSchema = generateWebsiteSchema();
  assert.equal(websiteSchema["@graph"].length, 3);

  // Sitemap includes all 5 published articles and 0 draft articles
  const sitemapEntries = sitemap();
  const sitemapUrls = sitemapEntries.map((e) => e.url);

  assert.ok(sitemapUrls.includes("https://orefinder.io/"));
  assert.ok(sitemapUrls.includes("https://orefinder.io/blog"));
  assert.ok(
    sitemapUrls.includes(
      "https://orefinder.io/blog/minecraft-1-21-ore-distribution-strata-guide"
    )
  );
  // Drafts must NOT be in sitemap
  assert.equal(
    sitemapUrls.includes(
      "https://orefinder.io/blog/ancient-debris-nether-stratum-analysis"
    ),
    false
  );
  assert.equal(
    sitemapUrls.includes(
      "https://orefinder.io/blog/large-ore-veins-tuff-iron-granite-copper"
    ),
    false
  );
});
