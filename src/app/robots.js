import { siteConfig } from "../config/site.js";

/**
 * Generates robots.txt rules for OreFinder.io (Section 10).
 *
 * - Permits crawling of all public pages and rendering resources.
 * - Excludes `/api/` server endpoints from search indexing.
 * - Includes canonical sitemap reference.
 *
 * @returns {import("next").MetadataRoute.Robots}
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
