# OreFinder.io — Minecraft Ore-Generation Technical Research (`ORE_ENGINE_RESEARCH.md`)

**Project:** https://orefinder.io/  
**Phase:** 03 — Verified Ore-Finding Engine & Interactive Results  
**Technology:** JavaScript ES6+ (`BigInt`), JSX, Next.js App Router

---

## 1. Executive Summary & Feasibility Conclusions

Minecraft 1.18+ (*Caves & Cliffs: Part II* through *Tricky Trials* 1.21) fundamentally redesigned Overworld ore generation, expanding the vertical build height to `Y = -64..319`, introducing Deepslate (`Y < 0`), replacing uniform placement with triangular (`trapezoid`) and uniform height providers, and introducing `discard_chance_on_air_exposure`.

Our engineering research establishes what can—and cannot—be deterministically computed in a client-side browser application from a world seed alone:

1. **Seed Normalization & 64-Bit Arithmetic (`100% Exact`):**
   - Numeric seeds within signed 64-bit bounds (`-9,223,372,036,854,775,808` to `9,223,372,036,854,775,807`) map directly to a 64-bit signed `BigInt`.
   - Non-numeric text seeds map deterministically via Java's 32-bit signed polynomial rolling hash `String.hashCode()` (`h = Math.imul(31, h) + charCode | 0`), sign-extended to 64 bits.
2. **PRNG & Chunk Decoration Seeding in Java Edition 1.18–1.21 (`100% Deterministic`):**
   - Java 1.18–1.21 uses `Xoroshiro128++` (`Xoroshiro128PlusPlus`) seeded via `RandomSupport.upgradeSeedTo128bit` (`SILVER_RATIO_64 = 0x6A09E667F3BCC909L`, `GOLDEN_RATIO_64 = 0x9E3779B97F4A7C15L`) and mixed via `Stafford13` (`0xBF58476D1CE4E5B9L`, `0x94D049BB133111EBL`).
   - Chunk decoration seeds (`setDecorationSeed(worldSeed, blockX, blockZ)`) and feature seeds (`decorationSeed + featureIndex + 10000 * step`) are 100% deterministic.
3. **Why Seed-Only Feature Origins Are `DETERMINISTIC_CANDIDATE` (Never `VERIFIED_EXACT`):**
   - While `InSquarePlacement` (`dx = rng.nextInt(16)`, `dz = rng.nextInt(16)`) and `HeightRangePlacement` (`trapezoid` / `uniform`) are deterministic from the feature seed, whether an actual ore block exists in-game at `(x, y, z)` also depends on:
     - **Biome Feature Index Shifts:** Each biome's `GenerationSettings` lists features in step 6 (`UNDERGROUND_ORES`). Biomes with extra features (e.g., Badlands `ore_gold_extra`, Mountain `ore_emerald`, Dripstone Caves `ore_copper_large`) shift `featureIndex`.
     - **Terrain & Cave Replacement:** Ore features only replace `stone_ore_replaceables` or `deepslate_ore_replaceables`. If a cheese/spaghetti/noodle cave carver, aquifer, lava pool, or structure occupies `(x, y, z)`, no ore is placed.
     - **Air-Exposure Discard (`discard_chance_on_air_exposure`):** Buried batches (such as `ore_diamond_buried` = `1.0`, `ore_diamond_large` = `0.7`, `ore_diamond` = `0.5`, `ore_lapis_buried` = `1.0`) roll against adjacent air blocks and discard exposed placements.
   - Therefore, Java 1.18–1.21 seed-derived placements are strictly classified as **`DETERMINISTIC_CANDIDATE` (`"deterministic-candidate"`)**.
4. **Why Bedrock Edition 1.18–1.21 Uses `DISTRIBUTION_GUIDANCE`:**
   - Bedrock Edition uses C++ `MT19937` (Mersenne Twister) with platform-specific feature decoration ordering that does not share Java's `Xoroshiro128++` stream.
   - However, Mojang aligned Bedrock 1.18–1.21 Overworld ore Y-level distributions, triangular peaks, and air-exposure rules with Java 1.18–1.21.
   - Therefore, Bedrock 1.18–1.21 is strictly classified as **`DISTRIBUTION_GUIDANCE` (`"distribution"`)**, providing verified Y-level curves and mining recommendations without fabricating X/Z coordinates.

---

## 2. Vanilla Placed-Feature Specifications (1.18–1.21)

| Ore | Placed Feature Batch | Era | Count / Rarity | Vein Size | Distribution | Y-Range | Peak Y | Air Discard |
|---|---|---|---|---|---|---|---|---|
| **Diamond** | `ore_diamond` (Small) | 1.18–1.21 | 7 / chunk | 4 | Trapezoid | -64 to 16 | -64 | 50% (`0.5`) |
| **Diamond** | `ore_diamond_medium` | **1.20.2–1.21** | 2 / chunk | 8 | Uniform | -64 to -4 | Uniform | 50% (`0.5`) |
| **Diamond** | `ore_diamond_large` | 1.18–1.21 | 1 / 9 chunks | 12 | Trapezoid | -64 to 16 | -64 | 70% (`0.7`) |
| **Diamond** | `ore_diamond_buried` | 1.18–1.21 | 4 / chunk | 8 | Trapezoid | -64 to 16 | -64 | 100% (`1.0`) |
| **Iron** | `ore_iron_small` | 1.18–1.21 | 10 / chunk | 4 | Uniform | -64 to 72 | Uniform | 0% (`0.0`) |
| **Iron** | `ore_iron_middle` | 1.18–1.21 | 10 / chunk | 9 | Trapezoid | -24 to 56 | 16 | 0% (`0.0`) |
| **Iron** | `ore_iron_upper` | 1.18–1.21 | 90 / chunk | 9 | Trapezoid | 80 to 384 | 232 | 0% (`0.0`) |
| **Gold** | `ore_gold` | 1.18–1.21 | 4 / chunk | 9 | Trapezoid | -64 to 32 | -16 | 50% (`0.5`) |
| **Gold** | `ore_gold_lower` | 1.18–1.21 | 1 / 2 chunks | 9 | Uniform | -64 to -48 | Uniform | 50% (`0.5`) |
| **Gold** | `ore_gold_extra` (Badlands) | 1.18–1.21 | 50 / chunk | 9 | Uniform | 32 to 256 | Uniform | 0% (`0.0`) |
| **Emerald** | `ore_emerald` (Mountains) | 1.18–1.21 | 100 / chunk | 3 | Trapezoid | -16 to 480 | 236 | 0% (`0.0`) |
| **Redstone** | `ore_redstone_lower` | 1.18–1.21 | 8 / chunk | 8 | Trapezoid | -64 to -32 | -64 | 0% (`0.0`) |
| **Redstone** | `ore_redstone` | 1.18–1.21 | 4 / chunk | 8 | Uniform | -64 to 15 | Uniform | 0% (`0.0`) |
| **Lapis** | `ore_lapis` | 1.18–1.21 | 2 / chunk | 7 | Trapezoid | -32 to 32 | 0 | 0% (`0.0`) |
| **Lapis** | `ore_lapis_buried` | 1.18–1.21 | 4 / chunk | 7 | Uniform | -64 to 64 | Uniform | 100% (`1.0`) |
| **Copper** | `ore_copper` / `ore_copper_large` | 1.18–1.21 | 16 / chunk | 10–20 | Trapezoid | -16 to 112 | 48 | 0% (`0.0`) |
| **Coal** | `ore_coal_lower` | 1.18–1.21 | 20 / chunk | 17 | Trapezoid | 0 to 192 | 96 | 50% (`0.5`) |
| **Coal** | `ore_coal_upper` | 1.18–1.21 | 30 / chunk | 17 | Uniform | 136 to 320 | Uniform | 0% (`0.0`) |

