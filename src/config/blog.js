/**
 * Editorial & Blog Configuration for OreFinder.io (Phase 04)
 *
 * Defines:
 * 1. Data-driven blog categories (Section 5.C)
 * 2. Verified institutional attribution registry (Section 7)
 * 3. Documented Content Strategy Cluster Topic Map (Section 8)
 * 4. Pagination settings (Section 5.F)
 */

export const BLOG_HERO_CONTENT = {
  eyebrow: "OreFinder.io Editorial & Technical Reference",
  headline: "Minecraft Guides & Ore-Finding Insights",
  description:
    "Explore practical Minecraft mining guides, ore distribution information, world-generation explanations, and version-specific resources.",
};

/**
 * Data-driven categories required by Section 5.C.
 */
export const BLOG_CATEGORIES = [
  {
    id: "ore-guides",
    name: "Ore Guides",
    description:
      "Vertical strata, placement batches, and air-exposure discard mechanics for individual Minecraft ores.",
  },
  {
    id: "mining-strategies",
    name: "Mining Strategies",
    description:
      "Practical depth selection, branch-mining tunnel geometry, aquifer navigation, and caving efficiency.",
  },
  {
    id: "world-generation",
    name: "World Generation",
    description:
      "Technical breakdowns of Minecraft chunk decoration steps, noise routers, and placed-feature pipelines.",
  },
  {
    id: "minecraft-seeds",
    name: "Minecraft Seeds",
    description:
      "How 64-bit signed numeric seeds and String.hashCode() text seeds initialize deterministic PRNG streams.",
  },
  {
    id: "java-vs-bedrock",
    name: "Java vs Bedrock",
    description:
      "Edition parity comparisons between Java Xoroshiro128++ and Bedrock C++ MT19937 world generation.",
  },
  {
    id: "updates-and-changes",
    name: "Updates & Changes",
    description:
      "Version-by-version ore distribution and worldgen changes across Minecraft 1.18, 1.19, 1.20.2, and 1.21.",
  },
];

export const BLOG_CATEGORY_IDS = BLOG_CATEGORIES.map((c) => c.id);

/**
 * Verified institutional attribution entities.
 * OreFinder.io never fabricates fictional human author personas or fake credentials.
 */
export const VERIFIED_AUTHORS = {
  "OreFinder Editorial & Technical Documentation Desk": {
    name: "OreFinder Editorial & Technical Documentation Desk",
    role: "Institutional Technical Documentation Team",
    type: "Organization",
    url: "https://orefinder.io/about",
    methodologyUrl: "https://orefinder.io/methodology",
  },
  "OreFinder Technical Documentation Desk": {
    name: "OreFinder Technical Documentation Desk",
    role: "World-Generation & Algorithm Research Group",
    type: "Organization",
    url: "https://orefinder.io/methodology",
    methodologyUrl: "https://orefinder.io/methodology",
  },
};

export const ARTICLES_PER_PAGE = 4;

/**
 * Documented Topic Map across the four core content clusters (Section 8).
 */
export const CONTENT_CLUSTER_MAP = [
  {
    clusterId: "cluster-a-ore-distribution",
    title: "Cluster A — Ore Distribution",
    category: "ore-guides",
    topics: [
      {
        title: "Diamond Ore Distribution & Air-Exposure Discard Rules (1.18–1.21)",
        slug: "deepslate-diamond-air-exposure-mechanics",
        targetStatus: "published",
      },
      {
        title: "Minecraft 1.18–1.21 Overworld Ore Distribution Strata Reference",
        slug: "minecraft-1-21-ore-distribution-strata-guide",
        targetStatus: "published",
      },
      {
        title: "Iron, Copper, Gold, Emerald, Redstone, Lapis & Coal Elevation Profiles",
        slug: "overworld-ore-elevation-profiles-reference",
        targetStatus: "draft",
      },
    ],
  },
  {
    clusterId: "cluster-b-mining-guides",
    title: "Cluster B — Mining Guides",
    category: "mining-strategies",
    topics: [
      {
        title: "Deepslate Branch Mining vs. Caving Depth Selection at Y = -54",
        slug: "deepslate-branch-mining-vs-caving-strategy",
        targetStatus: "published",
      },
    ],
  },
  {
    clusterId: "cluster-c-world-generation",
    title: "Cluster C — World Generation & Seeds",
    category: "world-generation",
    topics: [
      {
        title: "How Minecraft 64-Bit World Seeds & Xoroshiro128++ Feature Streams Work",
        slug: "how-minecraft-64-bit-seeds-and-xoroshiro128-work",
        targetStatus: "published",
      },
      {
        title: "Java Edition vs. Bedrock Edition Ore Generation Parity Explained",
        slug: "java-vs-bedrock-ore-generation-parity",
        targetStatus: "published",
      },
      {
        title: "Minecraft 1.20.2 & 1.21 Medium Diamond Placement Update Analysis",
        slug: "minecraft-1-20-2-and-1-21-diamond-ore-changes",
        targetStatus: "published",
      },
      {
        title: "Procedural Large Ore Veins: Tuff-Iron & Granite-Copper Networks",
        slug: "large-ore-veins-tuff-iron-granite-copper",
        targetStatus: "draft",
      },
    ],
  },
  {
    clusterId: "cluster-d-ore-finder-education",
    title: "Cluster D — Ore Finder Education",
    category: "minecraft-seeds",
    topics: [
      {
        title: "Understanding Deterministic Candidates vs. World-File Verification",
        slug: "how-minecraft-64-bit-seeds-and-xoroshiro128-work",
        targetStatus: "published",
      },
    ],
  },
];

/**
 * Helper to look up a category object by its ID.
 * @param {string} categoryId
 */
export function getCategoryById(categoryId) {
  return (
    BLOG_CATEGORIES.find((cat) => cat.id === categoryId) || {
      id: categoryId || "world-generation",
      name: categoryId || "World Generation",
      description: "Technical Minecraft world-generation and ore analysis reference.",
    }
  );
}
