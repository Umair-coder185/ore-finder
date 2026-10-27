# OreFinder.io — Final Production Architecture (`FINAL_ARCHITECTURE.md`)

**Website:** https://orefinder.io/  
**Stage:** Combined Phase 05 + 06 — Final Hardening & Launch Preparation  
**Technology Stack:** Next.js 16.4.3 App Router, React 19.3, JavaScript ES6+ (`BigInt`), JSX, Tailwind CSS v4, Lucide React

---

## 1. System Architecture & Language Compliance

- **Strict JavaScript + JSX Architecture:** 100% of source files use `.js` (domain engine, validation, SEO, consent, configuration) and `.jsx` (React Server and Client Components) configured via `jsconfig.json`. Zero `.ts` or `.tsx` files exist anywhere in the repository.
- **React Server Components (RSC) by Default:**
  - All route entry points (`src/app/page.jsx`, `src/app/blog/page.jsx`, `src/app/blog/[slug]/page.jsx`, `src/app/about/page.jsx`, `src/app/contact/page.jsx`, `src/app/privacy-policy/page.jsx`, `src/app/terms/page.jsx`, `src/app/disclaimer/page.jsx`, `src/app/methodology/page.jsx`) are Server Components that prerender semantic HTML and JSON-LD structured data.
  - Client interactivity (`"use client"`) is strictly scoped to interactive islands: `OreFinderWorkspace.jsx` (`useOreSearch.js`), `BlogIndexClient.jsx`, `TableOfContents.jsx`, `ContactForm.jsx`, `ConsentPreferencesPanel.jsx`, and `AdPlaceholder.jsx`.

---

## 2. Complete Route & Module Inventory

| Route / Endpoint | File Path | Component Type | Purpose |
|---|---|---|---|
| `/` | `src/app/page.jsx` | Server + Client Workspace | Homepage Hero + Integrated Dark Ore Finder Workspace + Editorial Sections |
| `/blog` | `src/app/blog/page.jsx` | Server + Client Filter | Editorial Landing Page, Featured Guide, 6 Categories, Search & Pagination |
| `/blog/[slug]` | `src/app/blog/[slug]/page.jsx` | Server (`generateStaticParams`) | 17-Point Technical Article Template (Published Slugs Only) |
| `/methodology` | `src/app/methodology/page.jsx` | Server Component | Scientific & Algorithmic Documentation (`BigInt`, `Xoroshiro128++`) |
| `/about` | `src/app/about/page.jsx` | Server Component | Platform Mission, Supported Capabilities & Institutional Attribution |
| `/contact` | `src/app/contact/page.jsx` | Server + Client Form | Accessible Correspondence Form with Client + Server Validation |
| `/privacy-policy` | `src/app/privacy-policy/page.jsx` | Server + Client Controls | Data Processing Disclosures + Interactive `ConsentPreferencesPanel` |
| `/terms` | `src/app/terms/page.jsx` | Server Component | Terms of Use, Accuracy Disclaimers & Intellectual Property |
| `/disclaimer` | `src/app/disclaimer/page.jsx` | Server Component | Mojang Trademark Independence & 4-Tier Result Classification Definitions |
| `/api/contact` | `src/app/api/contact/route.js` | Route Handler (`POST`) | Rate-Limited, Honeypot-Protected Contact Validation & Webhook Relay |
| `/sitemap.xml` | `src/app/sitemap.js` | Metadata Route | Dynamic XML Sitemap of Public Pages + Published Articles |
| `/robots.txt` | `src/app/robots.js` | Metadata Route | Crawler Directives (Allows `/`, Disallows `/api/`) |

