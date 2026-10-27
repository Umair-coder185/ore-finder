# OreFinder.io — Accuracy & Independent Validation Report (`ACCURACY_VALIDATION.md`)

**Project:** https://orefinder.io/  
**Phase:** 03 — Verified Ore-Finding Engine & Interactive Results  
**Automated Test Suite:** `tests/ore-engine.test.mjs` (`npm test`)

---

## 1. Independent Reference Validation Methodology

Every mathematical and algorithmic primitive in `src/features/ore-finder/engine/` is validated against independent reference specifications:

1. **Java `String.hashCode()` 32-bit Signed Polynomial Rolling Hash (`seedEngine.js`):**
   - Verified against the OpenJDK `java.lang.String.hashCode` specification ($s[0] \cdot 31^{n-1} + s[1] \cdot 31^{n-2} + \dots + s[n-1]$ modulo $2^{32}$ signed):
     - `""` $\rightarrow$ `0`
     - `"a"` $\rightarrow$ `97`
     - `"abc"` $\rightarrow$ `96354`
     - `"minecraft"` $\rightarrow$ `695073197`
     - `"pollinating sandboxes"` $\rightarrow$ `0` (canonical zero-hash Minecraft seed string)
2. **Signed 64-Bit Integer Bounds (`seedEngine.js`):**
   - Verified exact `BigInt` handling at signed 64-bit limits:
     - `MAX_LONG_64` = `9223372036854775807n` ($2^{63} - 1$)
     - `MIN_LONG_64` = `-9223372036854775808n` ($-2^{63}$)
     - Overflow inputs (`9223372036854775808`, `-9223372036854775809`) are deterministically rejected with explicit bounds errors instead of silently losing precision in IEEE-754 `Number` float math.
3. **SplitMix64 `Stafford13` & `Xoroshiro128PlusPlus` (`seedEngine.js`):**
   - Verified constants (`SILVER_RATIO_64 = 0x6A09E667F3BCC909n`, `GOLDEN_RATIO_64 = -7046029254386353131n`, `STAFFORD_MIX_1 = -4658895280553007687n`, `STAFFORD_MIX_2 = -7723592293110705685n`) and `rotl64(seedLo + seedHi, 17) + seedLo` state transitions.
4. **Negative & Positive Block-to-Chunk Floor Division (`coordinateEngine.js`):**
   - Verified across origin and negative chunk boundaries:
     - `(0, 0)` $\rightarrow$ `chunk [0, 0]`, `local (0, 0)`
     - `(15, 15)` $\rightarrow$ `chunk [0, 0]`, `local (15, 15)`
     - `(-1, -1)` $\rightarrow$ `chunk [-1, -1]`, `local (15, 15)`
     - `(-16, -16)` $\rightarrow$ `chunk [-1, -1]`, `local (0, 0)`
     - `(-17, -17)` $\rightarrow$ `chunk [-2, -2]`, `local (15, 15)`
5. **Vanilla `placed_feature` Stratum Specifications (`distributionEngine.js`):**
   - Cross-checked against official Minecraft 1.18–1.21 vanilla `data/minecraft/worldgen/placed_feature/ore_*.json` and `configured_feature/ore_*.json` definitions for all 8 supported Overworld ores (`diamond`, `iron`, `gold`, `emerald`, `redstone`, `lapis`, `copper`, `coal`), including the 1.20.2+ `ore_diamond_medium` batch differentiation.

---

## 2. Automated Test Suite Results

Running `npm test` (`node --test tests/ore-engine.test.mjs`) executes 8 comprehensive test suites covering 45+ assertions:
- `Seed Engine: positive, negative, zero, and 64-bit boundary numeric seeds` — **PASS**
- `Seed Engine: text seeds match exact Java String.hashCode() reference vectors` — **PASS**
- `Seed Engine: invalid and overflow numeric seeds are rejected cleanly` — **PASS**
- `Seed Engine: deterministic PRNG reproducibility & independent SplitMix64/Xoroshiro128++ vectors` — **PASS**
- `Coordinate Engine: positive and negative world-to-chunk floor division` — **PASS**
- `Coordinate Engine: 3D, horizontal, and vertical distance calculations & boundaries` — **PASS**
- `Distribution Engine: all 8 ores supported & version differentiation between 1.21 and 1.18` — **PASS**
- `Search Orchestrator: deterministic output, strict result classification, and cancellation` — **PASS**

