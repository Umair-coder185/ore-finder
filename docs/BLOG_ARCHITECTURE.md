# OreFinder.io — Editorial & Blog Architecture (`BLOG_ARCHITECTURE.md`)

**Website:** https://orefinder.io/  
**Phase:** 04 of 06 — Premium Blog, Editorial Design, Advanced SEO & AdSense-Ready Architecture  
**Technology Stack:** Next.js 16.4.3 App Router, React 19.3, JavaScript ES6+, JSX, Tailwind CSS v4

---

## 1. Architectural Overview

The OreFinder.io editorial platform is designed as a file-based, zero-database content management system built natively in ES6+ JavaScript and JSX. It integrates into the Premium Hybrid design system:
- **Editorial Environment (`#F8F7F3` Background / `#FFFFFF` Surface / `#202722` Charcoal / `#326B55` Emerald):** Used across `/blog` and `/blog/[slug]` for long-form readability.
- **Dark Technical Cards (`#111916` / `#69C598`):** Used for SVG technical diagrams and contextual Ore Finder workspace integration cards.

```text
src/
├── app/
│   └── blog/
│       ├── page.jsx                  # Server Component blog landing page + JSON-LD
│       └── [slug]/
│           └── page.jsx              # Server Component article page + generateStaticParams + JSON-LD
├── components/
│   └── blog/
│       ├── BlogHero.jsx              # Editorial hero ("Minecraft Guides & Ore-Finding Insights")
│       ├── FeaturedArticle.jsx       # Prominent featured article position
│       ├── CategoryNavigation.jsx    # Data-driven category filter pills with counts
│       ├── ArticleSearch.jsx         # Accessible client-side search with clear button
│       ├── ArticleGrid.jsx           # Responsive article card grid + real pagination
│       ├── ArticleCard.jsx           # Reusable article card (image, category, title, excerpt, date, reading time)
│       ├── BlogIndexClient.jsx       # Interactive search, category & pagination orchestrator
│       ├── ArticleHeader.jsx         # Category, headline, summary, metadata & hero figure
│       ├── ArticleMetadata.jsx       # Verified attribution, publishedAt, updatedAt, readingTime
│       ├── TableOfContents.jsx       # Collapsible mobile + sticky desktop TOC
│       ├── ArticleBody.jsx           # Sections, responsive tables, callouts, sources & footer
│       ├── RelatedArticles.jsx       # Related published articles grid
│       ├── ArticleAdPlacement.jsx    # AdSense-ready editorial display container
│       └── ArticleLayout.jsx         # 17-point professional article template
├── config/
│   └── blog.js                       # Categories, verified authors, topic clusters, pagination config
├── content/
│   └── blog/
│       └── articles.js               # Structured article repository (published & draft entries)
└── lib/
    ├── blog.js                       # Metadata validator, draft filter, search & pagination engine
    ├── seo.js                        # Canonical, Open Graph & robots metadata builder
    └── structured-data.js            # Organization, WebSite, BreadcrumbList, Blog & BlogPosting JSON-LD
```

---

## 2. How Articles Are Created, Validated & Published

1. **Article Authoring:** Articles are defined in `src/content/blog/articles.js` conforming to the schema validated by `validateArticleMetadata()` in `src/lib/blog.js`.
2. **Draft Workflow (`status: "draft"`):**
   - Any article with `status: "draft"` is automatically excluded by `getPublishedArticles()`, `getPublishedArticleBySlug()`, `getRelatedPublishedArticles()`, `FeaturedGuides`, and `src/app/sitemap.js`.
   - Requesting `/blog/<draft-slug>` triggers Next.js `notFound()` (HTTP 404 with `noindex`).
3. **Publishing (`status: "published"`):**
   - Once an article passes technical review and `validateArticleMetadata(article).isValid === true`, changing `status` from `"draft"` to `"published"` automatically adds it to `/blog`, `generateStaticParams()`, category counts, client search, homepage featured guides, and `sitemap.xml`.
4. **Future Headless CMS Readiness:**
   - Because all pages and components consume content strictly through `src/lib/blog.js` (`getPublishedArticles`, `getPublishedArticleBySlug`, `queryPublishedArticles`), a future headless CMS or MDX loader can be swapped inside `src/lib/blog.js` without modifying a single React component.

