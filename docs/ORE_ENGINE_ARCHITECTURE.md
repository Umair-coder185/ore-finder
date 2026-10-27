# OreFinder.io — Engine Architecture (`ORE_ENGINE_ARCHITECTURE.md`)

**Project:** https://orefinder.io/  
**Phase:** 03 — Verified Ore-Finding Engine & Interactive Results

---

## 1. Architectural Overview

The OreFinder calculation engine is isolated under `src/features/ore-finder/` using pure ES6+ JavaScript modules (`BigInt`, zero React/DOM dependencies inside `engine/`) so that the exact same code runs inside:
1. Browser Web Workers (`src/features/ore-finder/engine/workers/oreSearchWorker.js`)
2. Client fallback execution (`src/features/ore-finder/hooks/useOreSearch.js`)
3. Node.js automated test suites (`tests/ore-engine.test.mjs`)

```
src/features/ore-finder/
  config/
    editions.js
    versions.js
    ores.js
  engine/
    seed/
      seedEngine.js              # 64-bit BigInt math, Java String.hashCode, SplitMix64, Xoroshiro128++
    coordinates/
      coordinateEngine.js        # Floor-division world<->chunk math, 3D/2D distances, deterministic sort
    compatibility/
      capabilityRegistry.js      # Edition/version capability matrix & result classification ceilings
    distribution/
      distributionEngine.js      # Vanilla 1.18-1.21 placed_feature specs & Y-level density curves
    generation/
      candidateGenerator.js      # Deterministic Java 1.18-1.21 candidate feature origin generator
    verification/
      worldFileVerification.js   # Technical specification & scope assessment for Anvil/LevelDB parsing
    search/
      searchOrchestrator.js      # Primary pipeline coordinating validation, distribution & candidates
    workers/
      oreSearchWorker.js         # Background Web Worker with progress & cooperative cancellation
  hooks/
    useOreSearch.js              # Primary React hook managing Worker lifecycle, pagination & UI state
    useOreFinderWorkspace.js     # Workspace compatibility hook
  validation/
    seedValidation.js
    searchValidation.js
    validateInputs.js
  utils/
    coordinates.js
    distance.js
    formatting.js
  types/
    index.js
    resultContracts.js           # Enforces VERIFIED_EXACT / DETERMINISTIC_CANDIDATE / DISTRIBUTION / UNSUPPORTED
```

---

## 2. Result Contract & Epistemological Guardrails

Every item returned by the engine is constructed through `createSearchResultItem()` in `src/features/ore-finder/types/resultContracts.js`.

If `classification` is `DISTRIBUTION_GUIDANCE` or `UNSUPPORTED`, `createSearchResultItem()` forcibly sets `x: null`, `y: null`, `z: null`, `chunkX: null`, `chunkZ: null`, and `distance3D: null`, making it impossible for a distribution-only result to accidentally render as a map coordinate.

