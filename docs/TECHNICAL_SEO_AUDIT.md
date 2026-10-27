# OreFinder.io — Enterprise-Grade Technical SEO Audit (`TECHNICAL_SEO_AUDIT.md`)

**Website:** https://orefinder.io/  
**Canonical Origin:** `https://orefinder.io`  
**Stage:** Combined Phase 05 + 06 — Sections 8, 9 & 10

---

## 1. Public Route Metadata & Canonical Audit

| Route | Title | Canonical URL | Indexable | JSON-LD Schema Types |
|---|---|---|---|---|
| `/` | `Find Minecraft Ores. Explore Smarter. \| OreFinder.io` | `https://orefinder.io/` | `index, follow` | `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage` |
| `/blog` | `Minecraft Guides & Ore-Finding Insights \| OreFinder.io` | `https://orefinder.io/blog` | `index, follow` | `BreadcrumbList`, `Blog` |
| `/blog/[slug]` | `{Article Title} \| OreFinder.io` | `https://orefinder.io/blog/{slug}` | `index, follow` (Published only) | `BreadcrumbList`, `BlogPosting` |
| `/methodology` | `Technical Methodology — 64-Bit Seed Math... \| OreFinder.io` | `https://orefinder.io/methodology` | `index, follow` | `BreadcrumbList` |
| `/about` | `About OreFinder.io — Mission, Scope... \| OreFinder.io` | `https://orefinder.io/about` | `index, follow` | `BreadcrumbList` |
| `/disclaimer` | `Technical & Trademark Disclaimer \| OreFinder.io` | `https://orefinder.io/disclaimer` | `index, follow` | `BreadcrumbList` |
| `/contact` | `Contact & Technical Feedback \| OreFinder.io` | `https://orefinder.io/contact` | `index, follow` | `BreadcrumbList` |
| `/privacy-policy` | `Privacy Policy & Data Processing Disclosures \| OreFinder.io` | `https://orefinder.io/privacy-policy` | `index, follow` | `BreadcrumbList` |
| `/terms` | `Terms and Conditions of Use \| OreFinder.io` | `https://orefinder.io/terms` | `index, follow` | `BreadcrumbList` |

---

## 2. Draft & Nonpublic Isolation Verification

- Draft blog articles (`large-ore-veins-tuff-iron-granite-copper`, `ancient-debris-nether-stratum-analysis`) are filtered out by `getPublishedArticles()` and `getPublishedArticleBySlug()`.
- Requesting a draft or nonexistent slug on `/blog/[slug]` invokes Next.js `notFound()` with `robots: { index: false, follow: true }`.
- `src/app/sitemap.js` includes all 8 public static routes + 6 published blog articles (`14` total canonical URLs) and `0` draft URLs.
- `src/app/robots.js` allows `/` and disallows `/api/`, referencing `https://orefinder.io/sitemap.xml`.

