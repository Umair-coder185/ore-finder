# OreFinder.io — Responsive Quality Assurance Report (`RESPONSIVE_QA.md`)

**Website:** https://orefinder.io/  
**Stage:** Combined Phase 05 + 06 — Section 15

---

## Viewport Breakpoint Architecture (`320px` to `1920px`)

| Breakpoint Group | Viewports Covered | Layout Behavior & Overflow Protections |
|---|---|---|
| **Compact Mobile** | `320px`, `360px`, `390px`, `430px` | Single-column stack; `MobileNavigation.jsx` drawer; `OreSelector.jsx` 1-to-2 column cards; `MapShell.jsx` responsive `aspect-square` SVG; `DistributionChart.jsx` 8-column bar grid (`grid-cols-8`); `ArticleBody.jsx` tables wrapped in `overflow-x-auto`; collapsible mobile `TableOfContents.jsx`. |
| **Tablet** | `768px` (`md`) | 2-column article grids (`md:grid-cols-2`); 2-column ore stratum reference cards; expanded coordinate input row (`sm:grid-cols-3`). |
| **Desktop & Wide** | `1024px` (`lg`), `1280px` (`xl`), `1440px`, `1920px` | 12-column split Ore Finder workspace (`lg:col-span-5` Configuration + `lg:col-span-7` Results Workspace); 12-column article template (`lg:col-span-8` reading column + `lg:col-span-4` sticky TOC/utility sidebar); 16-column Y-level bar chart (`sm:grid-cols-16`); max container width `1280px` (`max-w-7xl`). |

