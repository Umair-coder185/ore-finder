# OreFinder.io — Content Strategy & Topic Cluster Map (`CONTENT_STRATEGY.md`)

**Website:** https://orefinder.io/  
**Phase:** 04 of 06

---

## 1. Six Data-Driven Categories (`src/config/blog.js`)

| Category ID | Display Name | Scope |
|---|---|---|
| `ore-guides` | **Ore Guides** | Vertical strata, placement batches, and air-exposure discard mechanics for individual Minecraft ores. |
| `mining-strategies` | **Mining Strategies** | Practical depth selection, branch-mining tunnel geometry, aquifer navigation, and caving efficiency. |
| `world-generation` | **World Generation** | Technical breakdowns of Minecraft chunk decoration steps, noise routers, and placed-feature pipelines. |
| `minecraft-seeds` | **Minecraft Seeds** | How 64-bit signed numeric seeds and `String.hashCode()` text seeds initialize deterministic PRNG streams. |
| `java-vs-bedrock` | **Java vs Bedrock** | Edition parity comparisons between Java `Xoroshiro128++` and Bedrock C++ `MT19937` world generation. |
| `updates-and-changes` | **Updates & Changes** | Version-by-version ore distribution and worldgen changes across Minecraft 1.18, 1.19, 1.20.2, and 1.21. |

---

## 2. Four Core Content Clusters & Topic Map

### Cluster A — Ore Distribution (`ore-guides` & `world-generation`)
- **Published:** `minecraft-1-21-ore-distribution-strata-guide` (*Minecraft 1.18–1.21 Ore Distribution Strata & Triangular Elevation Rules*) — Covers all 8 Overworld ores (Diamond, Iron, Gold, Emerald, Redstone, Lapis, Copper, Coal).
- **Published:** `deepslate-diamond-air-exposure-mechanics` (*Understanding Air-Exposure Discard Rules in Deepslate Diamond Generation*).
- **Draft (Staged):** `ancient-debris-nether-stratum-analysis` (*Ancient Debris Generation Mechanics & Nether Stratum Geometry*).

### Cluster B — Mining Guides (`mining-strategies`)
- **Published:** `deepslate-branch-mining-vs-caving-strategy` (*Deepslate Branch Mining vs. Cave Exploration: Depth Selection at Y = -54*) — Covers 1×2 branch mining, lava aquifer safety at `Y = -55`, flooded aquifer diving, and dry cave exploration.

### Cluster C — World Generation & Version Changes (`minecraft-seeds`, `java-vs-bedrock`, `updates-and-changes`)
- **Published:** `how-minecraft-64-bit-seeds-and-xoroshiro128-work` (*How Minecraft 64-Bit World Seeds & Xoroshiro128++ Feature Streams Work*).
- **Published:** `java-vs-bedrock-ore-generation-parity` (*Java Edition vs. Bedrock Edition Ore Generation Parity Explained (1.18–1.21)*).
- **Published:** `minecraft-1-20-2-and-1-21-diamond-ore-changes` (*Minecraft 1.20.2 & 1.21 Diamond Ore Update: The ore_diamond_medium Batch*).
- **Draft (Staged):** `large-ore-veins-tuff-iron-granite-copper` (*Procedural Large Ore Veins: Tuff-Iron & Granite-Copper Networks*).

### Cluster D — Ore Finder Education
- Integrated directly into `how-minecraft-64-bit-seeds-and-xoroshiro128-work` and `java-vs-bedrock-ore-generation-parity`, educating users on why Java 1.18–1.21 seed placements are classified as `DETERMINISTIC CANDIDATE` and why Bedrock 1.18–1.21 uses `PROBABILITY / DISTRIBUTION GUIDANCE`.

