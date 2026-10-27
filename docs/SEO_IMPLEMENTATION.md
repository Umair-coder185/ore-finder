# OreFinder.io — Advanced Technical SEO Implementation (`SEO_IMPLEMENTATION.md`)

**Website:** https://orefinder.io/  
**Phase:** 04 of 06

---

## 1. Page Metadata & Canonical Architecture (`src/lib/seo.js`)

Every route uses `constructMetadata()` to generate:
- Unique `<title>` (`{Article Title} | OreFinder.io`)
- Unique `<meta name="description">`
- Explicit canonical URL (`https://orefinder.io/blog/{slug}`)
- Open Graph metadata (`og:title`, `og:description`, `og:url`, `og:type="article"`, `article:published_time`, `article:modified_time`, `article:tag`, and `og:image` with `1200×630` dimensions)
- Robots directives (`index: true, follow: true` for published pages; `index: false, follow: true` for missing/draft routes).

---

## 2. Truthful JSON-LD Structured Data (`src/lib/structured-data.js`)

1. **Homepage (`/`):** `Organization` + `WebSite` + `SoftwareApplication` + `FAQPage`.
2. **Blog Index (`/blog`):** `BreadcrumbList` (`Home` $\rightarrow$ `Blog`) + `Blog` listing all published `BlogPosting` items.
3. **Article Pages (`/blog/[slug]`):**
   - `BreadcrumbList` (`Home` $\rightarrow$ `Blog` $\rightarrow$ `{Article Title}`)
   - `BlogPosting` containing `headline`, `description`, `datePublished`, `dateModified`, `articleSection`, `keywords`, `image`, `author` (`@type: "Organization"`, `name: "OreFinder Editorial & Technical Documentation Desk"`), and `publisher` (`@type: "Organization"`, `name: "OreFinder.io"`).
   - Zero fabricated `aggregateRating` or `review` fields are emitted.

---

## 3. Dynamic Sitemap (`src/app/sitemap.js`) & Internal Linking

- `src/app/sitemap.js` dynamically queries `getPublishedArticles()` and includes only public static routes and `status === "published"` articles with their genuine `updatedAt` timestamps.
- Draft articles (`large-ore-veins-tuff-iron-granite-copper` and `ancient-debris-nether-stratum-analysis`) are verified by automated tests (`tests/blog-seo.test.mjs`) to be 100% absent from `sitemap.xml`.
- Meaningful internal links connect the Homepage (`FeaturedGuides.jsx`), the Ore Finder Workspace (`/#workspace`), the Blog Index (`/blog`), Methodology (`/methodology`), and Related Articles (`RelatedArticles.jsx`).

