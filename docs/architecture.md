# OreFinder.io — Technical Architecture Documentation (Phase 02)

## 1. Architectural Vision & Scope

OreFinder.io is engineered as a commercial-grade Minecraft world-generation reference and seed analysis platform. Phase 02 transforms the Phase 01 foundation into a complete, custom-designed homepage and interactive Ore Finder UI while maintaining strict technical honesty (zero fabricated coordinates or unverified worldgen algorithms prior to Phase 03 engine integration).

## 2. Technology Stack & JavaScript-Only Policy

- **Framework:** Next.js 16.4.3 (App Router, Cache Components & Partial Prefetching enabled)
- **Language:** JavaScript (ES6+) and JSX exclusively (`jsconfig.json` path aliases `@/*` -> `./src/*`)
- **File Conventions:**
  - `.js` for configuration, domain logic, validation, custom hooks, SEO utilities, and route metadata handlers (`sitemap.js`, `robots.js`)
  - `.jsx` for React Server and Client components and App Router pages
  - JSDoc annotations for static analysis and editor IntelliSense
- **Styling:** Tailwind CSS v4 (`@tailwindcss/turbopack`) paired with semantic CSS custom properties (`src/styles/tokens.css`)
- **Typography:** Next.js Font Optimization (`Manrope`, `Inter`, `JetBrains Mono`)
- **Icons:** `lucide-react`

## 3. Directory Structure

```text
src/
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   ├── globals.css
│   ├── not-found.jsx
│   ├── error.jsx
│   ├── sitemap.js
│   ├── robots.js
│   ├── blog/
│   │   ├── page.jsx
│   │   └── [slug]/page.jsx
│   ├── methodology/page.jsx
│   ├── about/page.jsx
│   ├── contact/page.jsx
│   ├── privacy-policy/page.jsx
│   ├── terms/page.jsx
│   └── disclaimer/page.jsx
├── components/
│   ├── layout/
│   ├── ui/
│   ├── homepage/
│   │   ├── Hero.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── SupportedOres.jsx
│   │   ├── FeaturedGuides.jsx
│   │   └── HomepageFAQ.jsx
│   ├── ore-finder/
│   │   ├── OreFinderWorkspace.jsx
│   │   ├── SearchConfiguration.jsx
│   │   ├── SeedInput.jsx
│   │   ├── EditionSelector.jsx
│   │   ├── VersionSelector.jsx
│   │   ├── CoordinateInputs.jsx
│   │   ├── RadiusSelector.jsx
│   │   ├── OreSelector.jsx
│   │   ├── AdvancedSettings.jsx
│   │   ├── SearchAction.jsx
│   │   ├── ResultsWorkspace.jsx
│   │   ├── ResultsToolbar.jsx
│   │   ├── MapShell.jsx
│   │   ├── ResultCard.jsx
│   │   ├── AccuracyIndicator.jsx
│   │   └── EmptyResults.jsx
│   ├── blog/
│   ├── seo/
│   └── advertising/
├── features/
│   └── ore-finder/
│       ├── types/index.js
│       ├── config/editions.js
│       ├── config/ores.js
│       ├── validation/validateInputs.js
│       ├── hooks/useOreFinderWorkspace.js
│       ├── utils/coordinates.js
│       └── engine/engineContract.js
├── content/
│   └── blog/articles.js
├── lib/
│   ├── seo/metadata.js
│   ├── seo/schema.js
│   └── utils/cn.js
├── config/
│   ├── site.js
│   └── navigation.js
└── styles/
    └── tokens.css
```
