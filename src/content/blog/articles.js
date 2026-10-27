/**
 * File-Based Editorial Content Repository for OreFinder.io (Phase 04)
 *
 * EDITORIAL & TECHNICAL INTEGRITY POLICY:
 * - No fabricated human author personas are used; attribution is assigned exclusively
 *   to verified institutional entities ("OreFinder Editorial & Technical Documentation Desk").
 * - Articles with `status: "draft"` are strictly excluded from public discovery,
 *   search results, category listings, related links, and `sitemap.xml`.
 * - Every published article cites verifiable vanilla Minecraft 1.18–1.21 world-generation
 *   data pack definitions and OpenJDK/Mojang technical specifications.
 */

export const BLOG_ARTICLES = [
  {
    title: "Minecraft 1.18–1.21 Ore Distribution Strata & Triangular Elevation Rules",
    slug: "minecraft-1-21-ore-distribution-strata-guide",
    description:
      "A complete technical reference covering how Minecraft 1.18 through 1.21 structures Overworld ore elevation bands (-64 to 319), trapezoid peaks, and air-exposure discard weights.",
    excerpt:
      "A complete technical reference covering how Minecraft 1.18 through 1.21 structures Overworld ore elevation bands (-64 to 319), trapezoid peaks, and air-exposure discard weights.",
    category: "world-generation",
    author: "OreFinder Editorial & Technical Documentation Desk",
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-27",
    status: "published",
    featured: true,
    image: "/images/blog/ore-distribution-strata.svg",
    imageAlt:
      "Technical elevation chart comparing triangular and uniform ore placement curves from Y = -64 to Y = 319 in Minecraft 1.18–1.21",
    readingTime: "8 min read",
    tags: ["ore distribution", "trapezoid height provider", "deepslate", "worldgen", "1.21"],
    minecraftVersions: ["1.21", "1.20", "1.19", "1.18"],
    targetVersions: "Java & Bedrock 1.18 – 1.21",
    sources: [
      {
        title:
          "Minecraft Vanilla Worldgen Data Pack — data/minecraft/worldgen/placed_feature/ore_*.json",
        publisher: "Mojang Studios (Minecraft 1.21 Client Jar)",
        url: "https://minecraft.wiki/w/Ore_(feature)",
      },
      {
        title: "Caves & Cliffs: Part II (Java Edition 1.18) World Generation Reference",
        publisher: "Minecraft Wiki Technical Documentation",
        url: "https://minecraft.wiki/w/Ore#Distribution",
      },
    ],
    relatedSlugs: [
      "deepslate-diamond-air-exposure-mechanics",
      "deepslate-branch-mining-vs-caving-strategy",
      "minecraft-1-20-2-and-1-21-diamond-ore-changes",
    ],
    sections: [
      {
        id: "vertical-world-expansion",
        heading: "1. Vertical World Expansion (Y = -64 to 319)",
        paragraphs: [
          "Starting in Minecraft 1.18 (Caves & Cliffs: Part II) and continuing through 1.21 (Tricky Trials), Overworld vertical generation spans 384 blocks from Y = -64 to Y = 319. Below Y = 0, regular Stone transitions into Deepslate, which hosts the highest-density veins of Diamond, Redstone, Gold, and buried Lapis Lazuli.",
          "Rather than spawning ores uniformly between a minimum and maximum altitude as in pre-1.18 releases, modern Minecraft world generation combines uniform placement passes with triangular (trapezoid) height providers. In a triangular height provider with plateau = 0, two independent random integers are summed, concentrating placement attempts near the center of the vertical window.",
        ],
        importantNote:
          "All elevation ranges in this reference are derived directly from vanilla Minecraft 1.18–1.21 placed_feature JSON specifications and match the OreFinder.io Distribution Engine.",
      },
      {
        id: "overworld-ore-strata-summary-table",
        heading: "2. Verified Overworld Ore Strata Summary (1.18–1.21)",
        paragraphs: [
          "Each Overworld ore is placed via two to four independent placed_feature batches during chunk decoration step 6 (UNDERGROUND_ORES). The table below summarizes the primary vertical bounds, peak elevation, and air-exposure discard behavior for all eight core Overworld ores.",
        ],
        table: {
          caption: "Vanilla Minecraft 1.18–1.21 Overworld Ore Placement Specifications",
          headers: [
            "Ore Type",
            "Total Stratum Range",
            "Peak Density Y-Level",
            "Primary Distribution",
            "Air-Exposure Discard",
          ],
          rows: [
            [
              "Diamond Ore",
              "Y = -64 to 16",
              "Y = -59 to -53",
              "Trapezoid + Uniform (1.20.2+)",
              "50% / 70% / 100% by batch",
            ],
            [
              "Iron Ore",
              "Y = -64 to 320",
              "Y = 16 (Underground) / Y = 232 (Peaks)",
              "Trapezoid + Small Uniform",
              "0% (No air discard)",
            ],
            [
              "Gold Ore",
              "Y = -64 to 32 (256 Badlands)",
              "Y = -16",
              "Trapezoid + Uniform Lower/Badlands",
              "50% (0% in Badlands)",
            ],
            [
              "Emerald Ore",
              "Y = -16 to 320 (Mountains)",
              "Y = 236",
              "Trapezoid (Mountain Biomes Only)",
              "0% (No air discard)",
            ],
            [
              "Redstone Ore",
              "Y = -64 to 15",
              "Y = -63 to -59",
              "Trapezoid Lower + Uniform",
              "0% (No air discard)",
            ],
            [
              "Lapis Lazuli",
              "Y = -64 to 64",
              "Y = 0",
              "Trapezoid + Buried Uniform",
              "0% (Primary) / 100% (Buried)",
            ],
            [
              "Copper Ore",
              "Y = -16 to 112",
              "Y = 48",
              "Trapezoid (2x size in Dripstone)",
              "0% (No air discard)",
            ],
            [
              "Coal Ore",
              "Y = 0 to 320",
              "Y = 96 (Lower) / Y = 136+ (Upper)",
              "Trapezoid Lower + Uniform Upper",
              "50% (Lower) / 0% (Upper)",
            ],
          ],
        },
      },
      {
        id: "interpreting-distribution-vs-candidates",
        heading: "3. Using Distribution Curves Alongside Seed Candidates",
        paragraphs: [
          "Even when analyzing a specific 64-bit Java Edition seed, vertical distribution curves remain essential. Because a chunk decoration seed rolls candidate Y-levels according to these exact trapezoid and uniform providers, filtering your search to the optimal elevation band eliminates low-probability outlier attempts.",
          "In the OreFinder.io workspace, you can inspect the interactive Y-Level Distribution Chart for any combination of ores alongside the 2D X/Z chunk viewport.",
        ],
        contextualToolLink: {
          label: "Inspect Live Y-Level Distribution Curves in the Ore Finder Workspace",
          href: "/#workspace",
          note: "Supports Java Edition 1.18–1.21 (Deterministic Candidates + Distribution) and Bedrock Edition 1.18–1.21 (Verified Distribution Guidance).",
        },
      },
    ],
  },
  {
    title: "Understanding Air-Exposure Discard Rules in Deepslate Diamond Generation",
    slug: "deepslate-diamond-air-exposure-mechanics",
    description:
      "Why open caverns yield fewer intact diamond blobs than solid Deepslate or flooded aquifers: an examination of the discard_chance_on_air_exposure parameter across all four diamond batches.",
    excerpt:
      "Why open caverns yield fewer intact diamond blobs than solid Deepslate or flooded aquifers: an examination of the discard_chance_on_air_exposure parameter across all four diamond batches.",
    category: "ore-guides",
    author: "OreFinder Editorial & Technical Documentation Desk",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-27",
    status: "published",
    featured: false,
    image: "/images/blog/diamond-air-exposure.svg",
    imageAlt:
      "Diagram comparing open cave air discard checks against buried Deepslate and flooded aquifer diamond retention",
    readingTime: "7 min read",
    tags: [
      "diamond ore",
      "air exposure",
      "discard_chance_on_air_exposure",
      "aquifers",
      "deepslate",
    ],
    minecraftVersions: ["1.21", "1.20", "1.19", "1.18"],
    targetVersions: "Java & Bedrock 1.18 – 1.21",
    sources: [
      {
        title:
          "Minecraft ConfiguredFeature Specification — ore_diamond, ore_diamond_medium, ore_diamond_large, ore_diamond_buried",
        publisher: "Mojang Studios (Minecraft 1.21 Data Pack)",
        url: "https://minecraft.wiki/w/Diamond_Ore#Natural_generation",
      },
    ],
    relatedSlugs: [
      "minecraft-1-21-ore-distribution-strata-guide",
      "deepslate-branch-mining-vs-caving-strategy",
      "minecraft-1-20-2-and-1-21-diamond-ore-changes",
    ],
    sections: [
      {
        id: "air-exposure-discard-parameter",
        heading: "1. How discard_chance_on_air_exposure Works",
        paragraphs: [
          "When Minecraft's OreFeature generator places blocks around a candidate feature origin, it checks whether each target block in the vein is adjacent to an air block. If a block touches air, the generator rolls against the batch's configured `discard_chance_on_air_exposure` probability (0.0 to 1.0).",
          "This mechanic was introduced in Minecraft 1.18 to prevent massive noise caves from exposing overwhelming quantities of high-tier ores on cavern walls, preserving the reward of branch mining and underwater aquifer exploration.",
        ],
        importantNote:
          "Water blocks inside flooded aquifers do NOT count as air during feature placement. As a result, submerged cave walls retain 100% of their generated diamond blocks.",
      },
      {
        id: "four-diamond-placement-batches",
        heading: "2. Breakdown of All Four Diamond Placement Batches",
        paragraphs: [
          "In Minecraft 1.20.2 and 1.21, Diamond Ore is generated across four distinct batches per chunk. Understanding their individual discard rates explains why candidate coordinates in solid Deepslate are far more reliable than candidates intersecting open caverns.",
        ],
        table: {
          caption: "Diamond Ore Placement Batches in Minecraft 1.20.2 – 1.21",
          headers: [
            "Placed Feature ID",
            "Attempts / Frequency",
            "Max Vein Size",
            "Height Provider",
            "Air-Exposure Discard",
          ],
          rows: [
            [
              "ore_diamond (Small)",
              "7 per chunk",
              "4 blocks",
              "Trapezoid (-64 to 16, peak -64)",
              "50% (0.5)",
            ],
            [
              "ore_diamond_medium (1.20.2+)",
              "2 per chunk",
              "8 blocks",
              "Uniform (-64 to -4)",
              "50% (0.5)",
            ],
            [
              "ore_diamond_large",
              "1 per 9 chunks (rarity_filter: 9)",
              "12 blocks",
              "Trapezoid (-64 to 16, peak -64)",
              "70% (0.7)",
            ],
            [
              "ore_diamond_buried",
              "4 per chunk",
              "8 blocks",
              "Trapezoid (-64 to 16, peak -64)",
              "100% (1.0 — Strictly Buried)",
            ],
          ],
        },
      },
      {
        id: "filtering-buried-candidates-in-orefinder",
        heading: "3. Filtering Buried vs. Cave-Exposed Candidates",
        paragraphs: [
          "Because `ore_diamond_buried` has a 100% discard rate on air exposure, it can never spawn exposed in dry caves. When branch mining through solid Deepslate at Y = -54, however, all four batches remain active.",
        ],
        contextualToolLink: {
          label: "Filter Diamond Placement Batches in the Ore Finder Workspace",
          href: "/#workspace",
          note: "Use Advanced Options → Air-Exposure Filter to inspect buried-biased placement batches.",
        },
      },
    ],
  },
  {
    title: "Deepslate Branch Mining vs. Cave Exploration: Depth Selection at Y = -54",
    slug: "deepslate-branch-mining-vs-caving-strategy",
    description:
      "An evidence-based mining strategy guide comparing 1x2 branch mining at Y = -54, flooded aquifer diving, and dry cavern exploration for Diamond, Redstone, Gold, and Iron.",
    excerpt:
      "An evidence-based mining strategy guide comparing 1x2 branch mining at Y = -54, flooded aquifer diving, and dry cavern exploration for Diamond, Redstone, Gold, and Iron.",
    category: "mining-strategies",
    author: "OreFinder Editorial & Technical Documentation Desk",
    publishedAt: "2026-10-22",
    updatedAt: "2026-10-27",
    status: "published",
    featured: false,
    image: "/images/blog/branch-mining-strategy.svg",
    imageAlt:
      "Cross-section diagram showing 1x2 branch mining tunnels at Y = -54 above the Y = -55 lava aquifer horizon",
    readingTime: "6 min read",
    tags: ["branch mining", "mining strategy", "Y=-54", "lava aquifer", "caving"],
    minecraftVersions: ["1.21", "1.20", "1.19", "1.18"],
    targetVersions: "Java & Bedrock 1.18 – 1.21",
    sources: [
      {
        title: "Minecraft NoiseGeneratorSettings — Overworld Lava Aquifer Level (-54)",
        publisher: "Minecraft Wiki Technical Reference",
        url: "https://minecraft.wiki/w/Altitude",
      },
    ],
    relatedSlugs: [
      "deepslate-diamond-air-exposure-mechanics",
      "minecraft-1-21-ore-distribution-strata-guide",
    ],
    sections: [
      {
        id: "why-y-minus-54-is-optimal",
        heading: "1. Why Y = -54 Is the Standard Deepslate Horizon",
        paragraphs: [
          "In Minecraft 1.18–1.21, triangular density for both Diamond (`ore_diamond*`) and lower Redstone (`ore_redstone_lower`) increases steadily toward Y = -59, just above the Bedrock ceiling (`Y = -64` to `-60`). However, global Overworld noise settings flood open cave basins below Y = -54 with Lava.",
          "Standing on a floor of Y = -54 places your tunnel ceiling at Y = -53 and eye level at Y = -52.5. If your pickaxe breaches a deep cavern, the lava surface sits flush with your floor block at Y = -55, allowing you to bridge across or pour water to form Obsidian without overhead lava flooding your tunnel.",
        ],
        importantNote:
          "Mining lower at Y = -58 or Y = -59 yields slightly higher raw diamond density per chunk, but requires constant fire-resistance preparation when breaching lava-filled caverns.",
      },
      {
        id: "method-comparison-table",
        heading: "2. Comparing Branch Mining, Aquifer Diving, and Dry Caving",
        paragraphs: [
          "Different mining objectives call for different excavation strategies depending on whether your priority is buried Diamond/Lapis or unpenalized Iron/Copper/Coal.",
        ],
        table: {
          caption: "Mining Strategy Comparison by Target Ore & Air-Exposure Rule",
          headers: [
            "Excavation Method",
            "Recommended Altitude",
            "Best Target Ores",
            "Air-Exposure Impact",
          ],
          rows: [
            [
              "1×2 Branch Mining (3-Block Spacing)",
              "Y = -54 (Deepslate)",
              "Diamond, Redstone, Buried Lapis, Lower Gold",
              "Bypasses air-exposure discard completely",
            ],
            [
              "Flooded Aquifer Diving (Respiration / Doors)",
              "Y = -54 to -16",
              "Diamond, Lapis, Gold, Deep Iron",
              "Water prevents air-exposure discard on walls",
            ],
            [
              "Dry Noise-Cave Exploration",
              "Y = -16 to 48",
              "Iron (Y=16), Copper (Y=48), Lapis (Y=0)",
              "Iron & Copper have 0% air discard penalty",
            ],
            [
              "High-Altitude Peak Surface Mining",
              "Y = 136 to 256",
              "Iron (Y=232), Emerald (Y=236), Coal (Y=136+)",
              "0% air discard on exposed mountain cliffs",
            ],
          ],
        },
      },
      {
        id: "planning-tunnel-origins",
        heading: "3. Staging Your Origin Coordinates in OreFinder.io",
        paragraphs: [
          "Before excavating a long branch-mining corridor, enter your player's X, Y (-54), and Z coordinates into the Ore Finder workspace to inspect chunk boundaries (`16×16` grid lines) and candidate placements within your chosen chunk radius.",
        ],
        contextualToolLink: {
          label: "Stage Your Y = -54 Mining Origin in the Ore Finder Workspace",
          href: "/#workspace",
          note: "Copy ready-to-use /tp commands for your origin or any deterministic candidate.",
        },
      },
    ],
  },
  {
    title: "How Minecraft 64-Bit World Seeds & Xoroshiro128++ Feature Streams Work",
    slug: "how-minecraft-64-bit-seeds-and-xoroshiro128-work",
    description:
      "A mathematical deep dive into Java String.hashCode() seed conversion, 64-bit BigInt arithmetic, Stafford13 SplitMix64 state initialization, and why seed-only ore coordinates are Deterministic Candidates.",
    excerpt:
      "A mathematical deep dive into Java String.hashCode() seed conversion, 64-bit BigInt arithmetic, Stafford13 SplitMix64 state initialization, and why seed-only ore coordinates are Deterministic Candidates.",
    category: "minecraft-seeds",
    author: "OreFinder Editorial & Technical Documentation Desk",
    publishedAt: "2026-10-23",
    updatedAt: "2026-10-27",
    status: "published",
    featured: false,
    image: "/images/blog/seed-prng-pipeline.svg",
    imageAlt:
      "Flowchart illustrating 64-bit world seed conversion, chunk decoration seed derivation, and Xoroshiro128++ feature seeding",
    readingTime: "9 min read",
    tags: [
      "minecraft seeds",
      "xoroshiro128++",
      "BigInt",
      "String.hashCode",
      "deterministic candidate",
    ],
    minecraftVersions: ["1.21", "1.20", "1.19", "1.18"],
    targetVersions: "Java Edition 1.18 – 1.21",
    sources: [
      {
        title: "OpenJDK java.lang.String.hashCode() Specification",
        publisher: "Oracle / OpenJDK Standard Library Documentation",
        url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html#hashCode()",
      },
      {
        title: "Xoroshiro128++ PRNG & SplitMix64 Stafford13 Mixing Reference",
        publisher: "David Blackman & Sebastiano Vigna (PRNG Specification)",
        url: "https://prng.di.unimi.it/",
      },
    ],
    relatedSlugs: [
      "java-vs-bedrock-ore-generation-parity",
      "minecraft-1-21-ore-distribution-strata-guide",
    ],
    sections: [
      {
        id: "numeric-vs-text-seed-parsing",
        heading: "1. Numeric 64-Bit Seeds vs. Java String.hashCode()",
        paragraphs: [
          "Minecraft world seeds in Java Edition are signed 64-bit integers (`long`), spanning from -9,223,372,036,854,775,808 (-2^63) to 9,223,372,036,854,775,807 (2^63 - 1). Because standard JavaScript `Number` values use IEEE-754 double-precision floats that lose integer precision beyond 2^53 - 1 (9,007,199,254,740,991), all seed arithmetic in OreFinder.io is executed exclusively using 64-bit two's-complement `BigInt` operations.",
          'When a player enters a non-numeric text seed (such as `"minecraft"`), Minecraft converts the text into a signed 32-bit integer using `java.lang.String.hashCode()`: `h = (31 * h + charCode) | 0`. For example, `"abc"` hashes to `96354`, `"minecraft"` hashes to `695073197`, and `"pollinating sandboxes"` hashes to `0`.',
        ],
        importantNote:
          "Never use standard 53-bit JavaScript Numbers for Minecraft seed calculations: rounding errors on the lowest 11 bits completely corrupt the PRNG stream.",
      },
      {
        id: "chunk-decoration-and-feature-seeding",
        heading: "2. Deriving Chunk Decoration & Feature Seeds",
        paragraphs: [
          "To populate features inside chunk `[chunkX, chunkZ]` (whose northwestern corner sits at `blockX = chunkX * 16`, `blockZ = chunkZ * 16`), Minecraft derives a deterministic `decorationSeed` and then offsets it for each feature index and generation step:",
        ],
        table: {
          caption: "Java Edition 1.18–1.21 Seed Derivation Stages",
          headers: ["Pipeline Stage", "Mathematical Operation", "PRNG / Mixing Primitive"],
          rows: [
            [
              "1. 128-Bit Seed Upgrade",
              "unmixedLo = seed ^ 0x6A09E667F3BCC909L; unmixedHi = unmixedLo + (-7046029254386353131L)",
              "Stafford13 SplitMix64 mixing on both 64-bit halves",
            ],
            [
              "2. Chunk Decoration Seed",
              "(blockX * a) ^ (blockZ * b) ^ worldSeedLong",
              "Two odd 64-bit multipliers drawn from worldSeedLong",
            ],
            [
              "3. Placed Feature Seed",
              "decorationSeed + featureIndex + (10000 * step)",
              "Step 6 = UNDERGROUND_ORES (offset +60000)",
            ],
            [
              "4. InSquare & Height Roll",
              "dx = nextInt(16), dz = nextInt(16), y = sampleHeight(rng)",
              "Xoroshiro128PlusPlus.fromSeed(featureSeed)",
            ],
          ],
        },
      },
      {
        id: "why-seed-candidates-are-not-verified-exact",
        heading: "3. Why Seed-Only Coordinates Are Deterministic Candidates",
        paragraphs: [
          "While the `Xoroshiro128++` feature stream is 100% reproducible from the seed and chunk coordinates, the final block placement inside a live Minecraft world also depends on local biome feature ordering, whether the target block is replaceable Stone/Deepslate (versus carved away by a cave or aquifer), and the `discard_chance_on_air_exposure` check.",
          "For that reason, OreFinder.io strictly labels seed-derived Java 1.18–1.21 placements as `DETERMINISTIC CANDIDATE` and never misrepresents them as guaranteed `VERIFIED EXACT` blocks without world-file verification.",
        ],
        contextualToolLink: {
          label: "Test 64-Bit Numeric & Text Seeds in the Ore Finder Workspace",
          href: "/#workspace",
          note: "Displays live 64-bit BigInt validation and String.hashCode() conversion for text seeds.",
        },
      },
    ],
  },
  {
    title: "Java Edition vs. Bedrock Edition Ore Generation Parity Explained (1.18–1.21)",
    slug: "java-vs-bedrock-ore-generation-parity",
    description:
      "Why Java and Bedrock share identical 64-bit seed ranges and Y-level ore distribution curves in 1.18–1.21, yet produce different block-level ore coordinates due to PRNG divergence.",
    excerpt:
      "Why Java and Bedrock share identical 64-bit seed ranges and Y-level ore distribution curves in 1.18–1.21, yet produce different block-level ore coordinates due to PRNG divergence.",
    category: "java-vs-bedrock",
    author: "OreFinder Editorial & Technical Documentation Desk",
    publishedAt: "2026-10-24",
    updatedAt: "2026-10-27",
    status: "published",
    featured: false,
    image: "/images/blog/java-vs-bedrock-parity.svg",
    imageAlt:
      "Comparison diagram between Java Edition Xoroshiro128++ and Bedrock Edition C++ MT19937 ore generation pipelines",
    readingTime: "6 min read",
    tags: [
      "java vs bedrock",
      "edition parity",
      "MT19937",
      "xoroshiro128++",
      "distribution guidance",
    ],
    minecraftVersions: ["1.21", "1.20", "1.19", "1.18"],
    targetVersions: "Java & Bedrock 1.18 – 1.21",
    sources: [
      {
        title: "Minecraft Parity & Seed Generation Overview (1.18+)",
        publisher: "Minecraft Wiki Technical Documentation",
        url: "https://minecraft.wiki/w/Seed_(world_generation)",
      },
    ],
    relatedSlugs: [
      "how-minecraft-64-bit-seeds-and-xoroshiro128-work",
      "minecraft-1-21-ore-distribution-strata-guide",
    ],
    sections: [
      {
        id: "what-is-identical-between-editions",
        heading: "1. What Java and Bedrock Share in 1.18–1.21",
        paragraphs: [
          "Starting in the 1.18 Caves & Cliffs overhaul, Mojang unified the macro-scale terrain noise, biome layouts for 64-bit seeds, and Overworld ore vertical distribution charts between Java Edition and Bedrock Edition.",
          "Whether you play on Java 1.21 or Bedrock 1.21, Diamond Ore peaks in lower Deepslate (`Y = -59` to `-53`), Copper Ore peaks at `Y = 48`, underground Iron Ore peaks at `Y = 16`, and Lapis Lazuli peaks at `Y = 0`.",
        ],
      },
      {
        id: "why-individual-ore-coordinates-diverge",
        heading: "2. Why Block-Level Ore Coordinates Diverge Between Editions",
        paragraphs: [
          "Despite sharing macro biome maps and vertical ore strata, the two editions use different pseudo-random number generators and feature decoration schedules during chunk population:",
        ],
        table: {
          caption: "Java Edition vs. Bedrock Edition Worldgen Comparison (1.18–1.21)",
          headers: [
            "Technical Attribute",
            "Java Edition (1.18–1.21)",
            "Bedrock Edition (1.18–1.21)",
          ],
          rows: [
            ["Vertical World Bounds", "Y = -64 to 319", "Y = -64 to 319"],
            [
              "Ore Elevation Curves & Peaks",
              "Identical 1.18+ Trapezoid & Uniform Strata",
              "Identical 1.18+ Trapezoid & Uniform Strata",
            ],
            [
              "Feature Decoration PRNG",
              "128-bit Xoroshiro128++ (Stafford13 mixed)",
              "C++ 32-bit MT19937 (Mersenne Twister)",
            ],
            [
              "OreFinder.io Result Classification",
              "Deterministic Candidate + Distribution",
              "Verified Distribution Guidance",
            ],
          ],
        },
        importantNote:
          "Because Bedrock's C++ MT19937 decorator order differs from Java's Xoroshiro128++, OreFinder.io never fabricates or plots speculative X/Z coordinates when Bedrock Edition is selected.",
      },
      {
        id: "switching-editions-in-workspace",
        heading: "3. Switching Between Java and Bedrock in OreFinder.io",
        paragraphs: [
          "When you toggle from Java Edition to Bedrock Edition in the homepage workspace, the engine automatically switches its highest result classification to `PROBABILITY / DISTRIBUTION GUIDANCE` and updates the viewport to focus on verified Y-level curves.",
        ],
        contextualToolLink: {
          label: "Compare Java & Bedrock Modes in the Ore Finder Workspace",
          href: "/#workspace",
          note: "Transparently displays capability badges for every edition and version.",
        },
      },
    ],
  },
  {
    title: "Minecraft 1.20.2 & 1.21 Diamond Ore Update: The ore_diamond_medium Batch",
    slug: "minecraft-1-20-2-and-1-21-diamond-ore-changes",
    description:
      "How Minecraft 1.20.2 and 1.21 added a fourth diamond placement pass (ore_diamond_medium) between Y = -64 and Y = -4, increasing upper-Deepslate diamond frequency.",
    excerpt:
      "How Minecraft 1.20.2 and 1.21 added a fourth diamond placement pass (ore_diamond_medium) between Y = -64 and Y = -4, increasing upper-Deepslate diamond frequency.",
    category: "updates-and-changes",
    author: "OreFinder Editorial & Technical Documentation Desk",
    publishedAt: "2026-10-25",
    updatedAt: "2026-10-27",
    status: "published",
    featured: false,
    image: "/images/blog/updates-1-20-2-diamond.svg",
    imageAlt:
      "Comparison chart showing 3 diamond placement passes in Minecraft 1.18–1.19 versus 4 passes including ore_diamond_medium in 1.20.2–1.21",
    readingTime: "5 min read",
    tags: ["1.20.2 update", "1.21", "ore_diamond_medium", "diamond changes", "deepslate"],
    minecraftVersions: ["1.21", "1.20", "1.19", "1.18"],
    targetVersions: "Java & Bedrock 1.20.2 – 1.21",
    sources: [
      {
        title: "Minecraft Java Edition 1.20.2 Official Release Changelog (World Generation)",
        publisher: "Mojang Studios",
        url: "https://minecraft.wiki/w/Java_Edition_1.20.2#World_generation",
      },
    ],
    relatedSlugs: [
      "deepslate-diamond-air-exposure-mechanics",
      "minecraft-1-21-ore-distribution-strata-guide",
    ],
    sections: [
      {
        id: "what-changed-in-1-20-2",
        heading: "1. What Changed in Minecraft 1.20.2 & 1.21?",
        paragraphs: [
          "In Minecraft 1.18 and 1.19, Diamond Ore generated via three placed features: `ore_diamond` (small, 7 attempts/chunk), `ore_diamond_large` (1 attempt per 9 chunks), and `ore_diamond_buried` (4 attempts/chunk). All three used a bottom-weighted triangular distribution peaking at Y = -64, making diamonds relatively scarce in upper Deepslate (`Y = -32` to `-4`).",
          "Starting in Minecraft 1.20.2 and continuing through 1.21, Mojang introduced a fourth placement batch: `ore_diamond_medium`.",
        ],
        importantNote:
          "OreFinder.io automatically differentiates between the 1.18–1.19 ruleset (3 diamond batches) and the 1.20–1.21 ruleset (4 diamond batches) when you change versions.",
      },
      {
        id: "ore-diamond-medium-specification",
        heading: "2. Technical Specification of ore_diamond_medium",
        paragraphs: [
          "Unlike the three triangular batches, `ore_diamond_medium` uses a `uniform` height provider spanning `Y = -64` to `Y = -4`. This provides a consistent baseline of medium-sized diamond veins across the entire Deepslate layer.",
        ],
        table: {
          caption: "Comparison of 1.18–1.19 vs. 1.20.2–1.21 Diamond Rulesets",
          headers: [
            "Ruleset Era",
            "Active Placed Features",
            "Upper Deepslate (Y = -32 to -4) Density",
            "Peak Mining Horizon",
          ],
          rows: [
            [
              "Minecraft 1.18 – 1.19",
              "3 batches (Small, Large, Buried)",
              "Low (Triangular taper only)",
              "Y = -59 to -53",
            ],
            [
              "Minecraft 1.20.2 – 1.21",
              "4 batches (+ ore_diamond_medium)",
              "Increased (+2 uniform veins/chunk up to size 8)",
              "Y = -59 to -53 (with boosted upper Deepslate)",
            ],
          ],
        },
      },
      {
        id: "inspect-version-differences",
        heading: "3. Comparing 1.18 vs. 1.21 in the Workspace",
        paragraphs: [
          "You can observe this exact ruleset change in the OreFinder.io Y-Level Distribution Chart by switching the Version selector between `Java 1.21.x` (4 vanilla feature passes) and `Java 1.18.x` (3 vanilla feature passes).",
        ],
        contextualToolLink: {
          label: "Compare 1.21 vs. 1.18 Diamond Batches in the Workspace",
          href: "/#workspace",
          note: "Switch between Java 1.21 and Java 1.18 to inspect the 4-pass vs. 3-pass breakdown.",
        },
      },
    ],
  },

  // ==========================================================================
  // DRAFT ARTICLES (Excluded from public blog index, search, and sitemap.xml)
  // ==========================================================================
  {
    title: "Procedural Large Ore Veins: Tuff-Iron & Granite-Copper Networks",
    slug: "large-ore-veins-tuff-iron-granite-copper",
    description:
      "Differentiating standard chunk-level ore blobs from multi-chunk 3D noise ore veins introduced in the Caves & Cliffs overhaul.",
    excerpt:
      "Differentiating standard chunk-level ore blobs from multi-chunk 3D noise ore veins introduced in the Caves & Cliffs overhaul.",
    category: "world-generation",
    author: "OreFinder Editorial & Technical Documentation Desk",
    publishedAt: "2026-10-27",
    updatedAt: "2026-10-27",
    status: "draft",
    featured: false,
    image: "/images/blog/large-ore-veins.svg",
    imageAlt: "Diagram of 3D noise-driven Granite-Copper and Tuff-Iron procedural large ore veins",
    readingTime: "5 min read",
    tags: ["large ore veins", "tuff iron", "granite copper", "noise router"],
    minecraftVersions: ["1.21", "1.20", "1.19", "1.18"],
    targetVersions: "Java & Bedrock 1.18 – 1.21",
    sources: [
      {
        title: "Minecraft Ore Vein (Noise Router) Technical Specification",
        publisher: "Minecraft Wiki",
        url: "https://minecraft.wiki/w/Ore_vein",
      },
    ],
    relatedSlugs: ["minecraft-1-21-ore-distribution-strata-guide"],
    sections: [
      {
        id: "noise-driven-mega-veins",
        heading: "1. 3D Noise-Driven Mega-Veins vs. Standard Ore Blobs",
        paragraphs: [
          "In addition to standard chunk-level ore blobs, Minecraft 1.18+ generates sprawling procedural ore veins driven by 3D noise channels (`vein_toggle`, `vein_ridged`, `vein_gap`).",
        ],
      },
    ],
  },
  {
    title: "Ancient Debris Generation Mechanics & Nether Stratum Geometry",
    slug: "ancient-debris-nether-stratum-analysis",
    description:
      "How Ancient Debris combines a primary triangular distribution at Y = 8–22 with a secondary uniform scatter across the Nether column.",
    excerpt:
      "How Ancient Debris combines a primary triangular distribution at Y = 8–22 with a secondary uniform scatter across the Nether column.",
    category: "ore-guides",
    author: "OreFinder Editorial & Technical Documentation Desk",
    publishedAt: "2026-10-27",
    updatedAt: "2026-10-27",
    status: "draft",
    featured: false,
    image: "/images/blog/ore-distribution-strata.svg",
    imageAlt: "Ancient Debris Nether elevation distribution diagram",
    readingTime: "4 min read",
    tags: ["ancient debris", "nether", "buried ore"],
    minecraftVersions: ["1.21", "1.20", "1.19", "1.18"],
    targetVersions: "Java & Bedrock 1.16 – 1.21",
    sources: [
      {
        title: "Ancient Debris Placed Feature Specification",
        publisher: "Minecraft Wiki",
        url: "https://minecraft.wiki/w/Ancient_Debris",
      },
    ],
    relatedSlugs: ["minecraft-1-21-ore-distribution-strata-guide"],
    sections: [
      {
        id: "two-pass-nether-generation",
        heading: "1. Two-Pass Nether Placement Per Chunk",
        paragraphs: [
          "Ancient Debris generates in two separate passes per chunk in the Nether (`ore_ancient_debris_large` and `ore_debris_small`).",
        ],
      },
    ],
  },
];

/**
 * Legacy helper exports preserved for backward compatibility while delegating
 * public discovery to `src/lib/blog.js`.
 */
export function getAllArticles() {
  return BLOG_ARTICLES.filter((article) => article.status === "published");
}

export function getArticleBySlug(slug) {
  return BLOG_ARTICLES.find((article) => article.slug === slug && article.status === "published");
}

export function getRelatedArticles(article) {
  if (!article?.relatedSlugs) return [];
  return article.relatedSlugs.map((slug) => getArticleBySlug(slug)).filter(Boolean);
}
