# OreFinder.io — Version Compatibility Matrix (`VERSION_COMPATIBILITY.md`)

**Project:** https://orefinder.io/  
**Phase:** 03 — Verified Ore-Finding Engine & Interactive Results

---

## Capability Table by Edition & Version

| Edition | Version ID | Version Label | Ruleset Era | Distribution Guidance | Deterministic Candidates | Exact Seed-Only Coordinates | World-File Verification | Highest Classification |
|---|---|---|---|---|---|---|---|---|
| **Java** | `java-1.21` | Java 1.21.x (Tricky Trials) | `java-1.20.2-1.21` | `true` | `true` | `false` | `false` | `deterministic-candidate` |
| **Java** | `java-1.20` | Java 1.20.x (Trails & Tales) | `java-1.20.2-1.21` | `true` | `true` | `false` | `false` | `deterministic-candidate` |
| **Java** | `java-1.19` | Java 1.19.x (The Wild Update) | `java-1.18-1.19` | `true` | `true` | `false` | `false` | `deterministic-candidate` |
| **Java** | `java-1.18` | Java 1.18.x (Caves & Cliffs II) | `java-1.18-1.19` | `true` | `true` | `false` | `false` | `deterministic-candidate` |
| **Java** | `java-1.17-legacy` | Java 1.16 – 1.17 (Legacy) | `unsupported` | `false` | `false` | `false` | `false` | `unsupported` |
| **Bedrock** | `bedrock-1.21` | Bedrock 1.21.x (Tricky Trials) | `bedrock-1.18-1.21` | `true` | `false` | `false` | `false` | `distribution` |
| **Bedrock** | `bedrock-1.20` | Bedrock 1.20.x (Trails & Tales) | `bedrock-1.18-1.21` | `true` | `false` | `false` | `false` | `distribution` |
| **Bedrock** | `bedrock-1.18-1.19` | Bedrock 1.18 – 1.19 | `bedrock-1.18-1.21` | `true` | `false` | `false` | `false` | `distribution` |
| **Bedrock** | `bedrock-1.17-legacy` | Bedrock 1.16 – 1.17 (Legacy) | `unsupported` | `false` | `false` | `false` | `false` | `unsupported` |

---

## Version-Specific Ore Placement Differences

- **Java 1.20.2 – 1.21 (`java-1.20.2-1.21`):** Includes 4 Diamond placement batches (`ore_diamond`, `ore_diamond_medium`, `ore_diamond_large`, `ore_diamond_buried`). `ore_diamond_medium` adds 2 uniform attempts per chunk of up to 8 blocks between `Y = -64` and `Y = -4` (`discard_chance_on_air_exposure = 0.5`).
- **Java 1.18 – 1.19 (`java-1.18-1.19`):** Includes the original 3 Caves & Cliffs Part II Diamond placement batches (`ore_diamond`, `ore_diamond_large`, `ore_diamond_buried`).
- **Bedrock 1.18 – 1.21 (`bedrock-1.18-1.21`):** Shares Overworld Y-level stratum curves and air-exposure rules with Java 1.18–1.21, but disables `deterministicCandidates` because Bedrock's C++ `MT19937` PRNG and chunk decoration step order differ from Java's `Xoroshiro128++`.

