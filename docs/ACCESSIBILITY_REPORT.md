# OreFinder.io — Accessibility Audit Report (`ACCESSIBILITY_REPORT.md`)

**Website:** https://orefinder.io/  
**Target Standard:** WCAG 2.2 Level AA (Section 14)

---

## 1. Accessibility Controls & Semantic Audit

1. **Semantic Landmarks & Skip Link (`src/app/layout.jsx`):**
   - Includes a keyboard-focusable `"Skip to main content"` link (`href="#main-content"`), `<header>`, `<nav>`, `<main id="main-content">`, `<article>`, `<aside>`, and `<footer>`.
2. **Heading Hierarchy:**
   - Every route renders exactly one `<h1>` followed by logical `<h2>` and `<h3>` sections without skipped heading levels.
3. **Form Labels, Error Associations & Live Regions:**
   - All inputs in `SearchConfiguration.jsx`, `SeedInput.jsx`, `CoordinateInputs.jsx`, `RadiusSelector.jsx`, `ArticleSearch.jsx`, `ContactForm.jsx`, and `ConsentPreferencesPanel.jsx` have explicit `<label htmlFor="...">` bindings, `aria-invalid`, `aria-describedby`, and `role="alert"` / `aria-live="polite"` status announcements.
4. **Interactive Visualizations (`MapShell.jsx` & `DistributionChart.jsx`):**
   - The 2D X/Z SVG viewport provides `role="img"`, descriptive `aria-label`, `<title>` tooltips on candidate markers, and accessible button controls (`Zoom In`, `Zoom Out`, `Reset`, `Pan North/South/East/West`).
5. **Color Contrast & Reduced Motion (`src/app/globals.css`):**
   - Light theme charcoal `#202722` on `#F8F7F3` exceeds `13:1` contrast; dark workspace `#F4F7F4` on `#111916` exceeds `15:1` contrast; action accent `#69C598` on `#111916` exceeds `8.5:1` contrast.
   - `prefers-reduced-motion: reduce` disables smooth scrolling and nonessential transitions globally.

---

## 2. Manual Testing Limitations Disclosure

- Automated code and ARIA verification confirms structural compliance, but full WCAG 2.2 AA certification additionally requires manual assistive-technology testing across NVDA, JAWS, and VoiceOver on physical desktop and mobile devices prior to launch.

