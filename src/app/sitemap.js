import { siteConfig } from "../config/site.js";
import { getPublishedArticles } from "../lib/blog.js";

/**
 * Generates sitemap.xml dynamically from public canonical routes and published articles (Section 10).
 *
 * SEO INTEGRITY POLICY:
 * - Includes only legitimate public canonical URLs and `status === "published"` articles.
 * - Excludes drafts (`status === "draft"`), `/api/*` endpoints, and development previews.
 * - Uses genuine modification dates (`updatedAt`).
 *
 * @returns {import("next").MetadataRoute.Sitemap}
 */
export default function sitemap() {
  const staticRoutes = [
    {
      url: `${siteConfig.url}/`,
      lastModified: "2026-10-27",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: "2026-10-27",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/methodology`,
      lastModified: "2026-10-27",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: "2026-10-27",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/disclaimer`,
      lastModified: "2026-10-27",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: "2026-10-27",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/privacy-policy`,
      lastModified: "2026-10-27",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: "2026-10-27",
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const publishedArticleRoutes = getPublishedArticles().map((article) => ({
    url: `${siteConfig.url}/blog/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...publishedArticleRoutes];
}
