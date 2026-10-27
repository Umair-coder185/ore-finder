# OreFinder.io — Editorial & Attribution Guidelines (`EDITORIAL_GUIDELINES.md`)

**Website:** https://orefinder.io/  
**Phase:** 04 of 06

---

## 1. Attribution & Author Integrity Policy

- **No Fabricated Human Personas:** OreFinder.io strictly prohibits inventing fictional individual author names, fake biographies, or unverified personal credentials.
- **Institutional Attribution:** All published technical guides are attributed to `OreFinder Editorial & Technical Documentation Desk` (enforced programmatically by `VERIFIED_AUTHORS` in `src/config/blog.js` and `validateArticleMetadata()` in `src/lib/blog.js`).
- **Genuine Timestamps:** Every article specifies `publishedAt` and `updatedAt` in `YYYY-MM-DD` format. Artificial freshness bumping without substantive technical updates is prohibited.

---

## 2. Technical Accuracy & Source Verification Standards

1. **Primary Sources Only:** Every numeric claim regarding Y-levels, vein sizes, attempts per chunk, rarity filters, or air-exposure discard ratios must match vanilla Minecraft `placed_feature` / `configured_feature` data pack definitions and our Phase 03 engine (`src/features/ore-finder/engine/distribution/distributionEngine.js`).
2. **Consistent Accuracy Classifications:**
   - Articles must never claim that a world seed alone guarantees 100% exact in-game ore block coordinates without terrain/cave/aquifer verification.
   - Articles must use the exact terminology established in Phase 03: **`Deterministic Candidate`** (for Java 1.18–1.21 seed feature origins) and **`Probability / Distribution Guidance`** (for elevation curves and Bedrock 1.18–1.21).
3. **Original Visual Assets:**
   - All article hero diagrams in `public/images/blog/*.svg` are original, custom-authored technical SVG diagrams with explicit `width="1200"` and `height="630"` dimensions and descriptive `alt` text. Copyrighted Mojang promotional artwork and generic stock photography are never used.

