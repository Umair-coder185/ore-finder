import { siteConfig } from "../../config/site.js";

/**
 * Generates Schema.org Organization + WebSite + SoftwareApplication structured data for the homepage.
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteConfig.url}/#application`,
        name: "OreFinder.io Minecraft Ore Finder Workspace",
        applicationCategory: "GameApplication",
        operatingSystem: "Any (Web Browser)",
        url: siteConfig.url,
        description: siteConfig.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data.
 *
 * @param {Array<{ label: string, href: string }>} items
 */
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, siteConfig.url).toString(),
    })),
  };
}

/**
 * Generates Schema.org BlogPosting structured data for a published article.
 * Only includes truthful properties backed by visible article content.
 * Never fabricates ratings, reviews, or fictional individual credentials.
 *
 * @param {Object} article
 */
export function generateArticleSchema(article) {
  if (!article) return null;
  const articleUrl = new URL(`/blog/${article.slug}`, siteConfig.url).toString();
  const imageUrl = article.image ? new URL(article.image, siteConfig.url).toString() : null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    headline: article.title,
    description: article.description || article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    articleSection: article.categoryMeta?.name || article.category,
    inLanguage: "en-US",
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(Array.isArray(article.tags) && article.tags.length > 0
      ? { keywords: article.tags.join(", ") }
      : {}),
    author: {
      "@type": "Organization",
      name: article.author || "OreFinder Editorial & Technical Documentation Desk",
      url: `${siteConfig.url}/methodology`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/**
 * Generates Schema.org Blog structured data for the `/blog` index page.
 *
 * @param {Array<Object>} publishedArticles
 */
export function generateBlogIndexSchema(publishedArticles = []) {
  const blogUrl = new URL("/blog", siteConfig.url).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${blogUrl}#blog`,
    name: "OreFinder.io Minecraft Guides & Ore-Finding Insights",
    description:
      "Explore practical Minecraft mining guides, ore distribution information, world-generation explanations, and version-specific resources.",
    url: blogUrl,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    blogPost: publishedArticles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: new URL(`/blog/${article.slug}`, siteConfig.url).toString(),
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
    })),
  };
}

/**
 * Generates Schema.org FAQPage structured data.
 *
 * @param {Array<{ question: string, answer: string }>} faqs
 */
export function generateFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
