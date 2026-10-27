# OreFinder.io — Phase 03 Completion Report (`PHASE_03_REPORT.md`)

**Website:** https://orefinder.io/  
**Phase:** 03 of 06 — Verified Ore-Finding Engine & Interactive Results  
**Technology Stack:** Next.js 16.4.3 App Router, React 19.3, JavaScript ES6+ (`BigInt`), JSX, Tailwind CSS v4

---

## A. Functional Implementation

1. **Seed Processing & 64-Bit PRNG Engine (`src/features/ore-finder/engine/seed/seedEngine.js`):**
   - Implemented pure 64-bit `BigInt` signed arithmetic (`toSigned64`, `toUnsigned64`, `rotl64`), exact Java `String.hashCode()` (`javaStringHashCode`), `resolveWorldSeed()`, `mixStafford13()`, `upgradeSeedTo128bit()`, `Xoroshiro128PlusPlus`, `LegacyRandom`, `deriveChunkDecorationSeed()`, and `deriveFeatureSeed()`.
2. **Coordinate & Chunk Engine (`src/features/ore-finder/engine/coordinates/coordinateEngine.js`):**
   - Implemented `worldToChunk()`, `chunkToWorldBounds()`, `chunkLocalToWorld()`, `computeCoordinateDistances()`, `computeSearchBoundaries()`, `isWithinSearchRadius()`, and `sortCoordinateResults()`.
3. **Capability Registry & Distribution Engine (`capabilityRegistry.js` & `distributionEngine.js`):**
   - Registered explicit version capabilities for Java 1.18–1.21, Bedrock 1.18–1.21, and legacy 1.16–1.17.
   - Implemented vanilla `placed_feature` batch specifications and Y-level elevation density curves (`Y = -64..312`) for all 8 ores (`diamond`, `iron`, `gold`, `emerald`, `redstone`, `lapis`, `copper`, `coal`), including 1.20.2+ `ore_diamond_medium` differentiation.
4. **Deterministic Candidate Generator & Web Worker (`candidateGenerator.js`, `searchOrchestrator.js`, `oreSearchWorker.js`):**
   - Implemented `generateDeterministicCandidates()` for Java 1.18–1.21 with cooperative cancellation (`shouldAbort`) and chunk progress callbacks (`onProgress`).
   - Connected background Web Worker execution with synchronous fallback in `useOreSearch.js`.
5. **Interactive Results Visualization (`MapShell.jsx`, `DistributionChart.jsx`, `ResultCard.jsx`, `ResultsToolbar.jsx`, `ResultsWorkspace.jsx`):**
   - Interactive 2D SVG X/Z coordinate map with zoom (`Zoom In`, `Zoom Out`, `Reset`), pan (`N/S/E/W`), chunk grid lines, player origin marker, color-coded candidate markers, coordinate inspector bar, and `/tp` copy buttons.
   - Interactive Y-level distribution bar chart (`Y = -64` to `Y = 256`) with recommended mining bands, vanilla batch breakdowns, and air-exposure discard rules.

## B. Compatibility Matrix

- **Java 1.21 / 1.20 (`java-1.20.2-1.21`):** `distribution: true`, `deterministicCandidates: true`, `exactCoordinates: false` $\rightarrow$ **`DETERMINISTIC_CANDIDATE`**
- **Java 1.19 / 1.18 (`java-1.18-1.19`):** `distribution: true`, `deterministicCandidates: true`, `exactCoordinates: false` $\rightarrow$ **`DETERMINISTIC_CANDIDATE`**
- **Bedrock 1.21 / 1.20 / 1.18–1.19 (`bedrock-1.18-1.21`):** `distribution: true`, `deterministicCandidates: false`, `exactCoordinates: false` $\rightarrow$ **`DISTRIBUTION_GUIDANCE`**
- **Java / Bedrock 1.16–1.17 (`*-1.17-legacy`):** All capabilities `false` $\rightarrow$ **`UNSUPPORTED`**

## C. Accuracy Evidence & Known Limitations

- All 8 automated test suites in `tests/ore-engine.test.mjs` pass (`0` failures).
- Seed-only Java 1.18–1.21 placements are strictly labeled `DETERMINISTIC CANDIDATE` because full 3D density-function terrain noise, cave carvers, aquifers, biome feature index shifts, and air-exposure discard rolls require full chunk block state evaluation or world-file verification.
- Bedrock 1.18–1.21 is strictly labeled `PROBABILITY / DISTRIBUTION GUIDANCE` and never plots speculative X/Z coordinates.

