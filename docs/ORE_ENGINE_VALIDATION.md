# OreFinder.io — Final Ore Engine Validation Report (`ORE_ENGINE_VALIDATION.md`)

**Website:** https://orefinder.io/  
**Stage:** Combined Phase 05 + 06 — Section 12 Regression Audit

---

## 1. Regression Verification Summary

All 16 engine subsystems in `src/features/ore-finder/` were re-audited and tested via `tests/ore-engine.test.mjs` and `tests/production-qa.test.mjs`:

1. **Seed Parsing (`seedEngine.js`):** Positive, negative, zero, and 64-bit boundary integers (`9223372036854775807`, `-9223372036854775808`) resolve via `BigInt`; text seeds hash via `javaStringHashCode()`; 64-bit integer overflows (`9223372036854775808`) are rejected cleanly.
2. **Edition & Version Compatibility (`capabilityRegistry.js`):**
   - Java 1.20–1.21 (`java-1.20.2-1.21`): 4 diamond passes (`ore_diamond_medium` included), `DETERMINISTIC_CANDIDATE`.
   - Java 1.18–1.19 (`java-1.18-1.19`): 3 diamond passes, `DETERMINISTIC_CANDIDATE`.
   - Bedrock 1.18–1.21 (`bedrock-1.18-1.21`): `DISTRIBUTION_GUIDANCE` only (`candidateResults = []`, `x: null, y: null, z: null`).
   - Legacy 1.16–1.17 (`*-1.17-legacy`): `UNSUPPORTED`.
3. **Coordinate & Negative Chunk Math (`coordinateEngine.js`):** Floor division (`Math.floor(x / 16)`) verified at `(0,0)`, `(15,15)`, `(-1,-1)`, `(-16,-16)`, and `(-17,-17)`.
4. **Worker Cancellation & Search Limits (`searchOrchestrator.js`, `oreSearchWorker.js`):** Cooperative `shouldAbort()` halts chunk iteration immediately and returns `status: "cancelled"`.

