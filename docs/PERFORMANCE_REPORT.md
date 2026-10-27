# OreFinder.io — Performance & Core Web Vitals Engineering Report (`PERFORMANCE_REPORT.md`)

**Website:** https://orefinder.io/  
**Stage:** Combined Phase 05 + 06 — Section 11

> **Measurement Transparency Note:** In accordance with Section 11, laboratory algorithm benchmarks measured in Node.js v24.22.1 are reported separately from browser field metrics. No real-user CrUX field telemetry exists prior to public domain deployment.

---

## 1. Laboratory Algorithm & Execution Benchmarks (`Node.js v24.22.1`)

Measured via `npm.cmd test` (`tests/ore-engine.test.mjs`, `tests/blog-seo.test.mjs`, `tests/production-qa.test.mjs`):

| Operation / Benchmark | Measured Duration | Thread / Execution Context |
|---|---|---|
| 64-Bit Seed Resolution & `String.hashCode()` (10 vectors) | `0.24ms – 1.42ms` | Pure synchronous `BigInt` |
| Coordinate & Chunk Floor-Division + Distance Suite | `0.40ms – 2.91ms` | Pure synchronous math |
| 8-Ore Y-Level Distribution Curve Generation (`-64..312`) | `1.69ms – 3.18ms` | Pure synchronous math |
| Java 1.21 Deterministic Candidate Search (`R=3`, `49` chunks) | `12.97ms – 21.21ms` | Web Worker (`oreSearchWorker.js`) + fallback |
| Java 1.21 Standard Workspace Search (`R=8`, `289` chunks) | `38.0ms – 43.0ms` | Web Worker (`oreSearchWorker.js`) + fallback |
| Blog CMS Validation, Search & Pagination Suite | `1.89ms – 12.46ms` | Server Component / Client Memo |
| Full 17-Suite Automated Verification Run | `197ms – 336ms` | Node.js Test Runner |

---

## 2. Core Web Vitals Architectural Optimizations

1. **Largest Contentful Paint (`LCP <= 2.5s` Target):**
   - Hero typography and above-the-fold layout on `/` and `/blog` are server-rendered HTML with self-hosted `next/font/google` (`display: "swap"`).
   - Article hero diagrams use lightweight vector SVGs (`< 3 KB` each) rendered with `next/image` `priority` and explicit `1200×630` dimensions.
2. **Interaction to Next Paint (`INP <= 200ms` Target):**
   - Multi-chunk seed searches run inside `oreSearchWorker.js` with cooperative cancellation (`shouldAbort`) and chunk progress reporting every 25 chunks so the main UI thread never blocks.
   - SVG map markers are capped to the 180 closest candidates (`plottedCandidates`), and candidate cards paginate in slices of 24 (`paginatedCandidates`).
3. **Cumulative Layout Shift (`CLS <= 0.1` Target):**
   - Every image (`1200×630`), map viewport (`aspect-square`), elevation bar chart (`h-28`), and advertising placeholder (`min-h-[90px]` / `min-h-[250px]`) reserves explicit intrinsic dimensions before hydration.

