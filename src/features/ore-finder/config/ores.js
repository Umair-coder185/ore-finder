import { DIMENSIONS } from "../types/index.js";

/**
 * Verified Minecraft 1.18–1.21 Geological Ore Catalog
 *
 * The 8 primary supported Overworld ores (Diamond, Iron, Gold, Emerald,
 * Redstone, Lapis Lazuli, Copper, Coal) are ordered first for the
 * interactive Ore Selector and Supported Ores editorial grid.
 */
export const ORE_CATALOG = [
  {
    id: "diamond",
    name: "Diamond Ore",
    shortName: "Diamond",
    symbol: "DM",
    iconType: "gem",
    dimension: DIMENSIONS.OVERWORLD,
    isPrimarySupported: true,
    swatchColor: "#5cd8e6",
    stratumRange: "Y: -64 to 16",
    optimalElevation: "Y: -59 to -53",
    distributionType: "Triangular (Increases toward bedrock)",
    airExposureRule: "50% – 100% buried bias (reduced air exposure in caves)",
    biomeModifier: "All Overworld biomes",
    notes:
      "Concentrates heavily in deep Deepslate layers; large blobs carry strict air-exposure discard rules.",
  },
  {
    id: "iron",
    name: "Iron Ore",
    shortName: "Iron",
    symbol: "FE",
    iconType: "ingot",
    dimension: DIMENSIONS.OVERWORLD,
    isPrimarySupported: true,
    swatchColor: "#d8af93",
    stratumRange: "Y: -64 to 320",
    optimalElevation: "Y: 15 (Underground) / Y: 232 (Peaks)",
    distributionType: "Dual Triangular + Large Tuff Veins (Y: -56 to -8)",
    airExposureRule: "No air discard penalty; mega-veins interleave with Tuff",
    biomeModifier: "All Overworld biomes",
    notes:
      "Features underground blobs peaking at Y=15, mountain peaks at Y=232, and multi-chunk Tuff-Iron veins.",
  },
  {
    id: "gold",
    name: "Gold Ore",
    shortName: "Gold",
    symbol: "AU",
    iconType: "ingot",
    dimension: DIMENSIONS.OVERWORLD,
    isPrimarySupported: true,
    swatchColor: "#e8c558",
    stratumRange: "Y: -64 to 32 (Up to Y: 256 in Badlands)",
    optimalElevation: "Y: -16 (Standard) / Y: 32–256 (Badlands)",
    distributionType: "Triangular (Y: -64 to 32) + Uniform Badlands Bonus",
    airExposureRule: "50% buried bias in lower Deepslate strata",
    biomeModifier: "High-density surface strata in Badlands biomes",
    notes:
      "Peaks at Y=-16 across standard biomes; Badlands add abundant uniform strata above Y=32.",
  },
  {
    id: "emerald",
    name: "Emerald Ore",
    shortName: "Emerald",
    symbol: "EM",
    iconType: "crystal",
    dimension: DIMENSIONS.OVERWORLD,
    isPrimarySupported: true,
    swatchColor: "#48c774",
    stratumRange: "Y: -16 to 320",
    optimalElevation: "Y: 224 to 256 (Peaks at Y: 236)",
    distributionType: "Triangular (Scales with mountain altitude)",
    airExposureRule: "No air exposure discard penalty",
    biomeModifier: "Exclusive to Mountain & Windswept Hills biomes",
    notes:
      "Generates exclusively in mountainous biomes, peaking sharply at high elevations around Y=236.",
  },
  {
    id: "redstone",
    name: "Redstone Ore",
    shortName: "Redstone",
    symbol: "RS",
    iconType: "dust",
    dimension: DIMENSIONS.OVERWORLD,
    isPrimarySupported: true,
    swatchColor: "#e05252",
    stratumRange: "Y: -64 to 15",
    optimalElevation: "Y: -59 to -53",
    distributionType: "Uniform (Y: -64 to -32) + Triangular (Y: -64 to 15)",
    airExposureRule: "No air exposure discard penalty",
    biomeModifier: "All Overworld biomes",
    notes:
      "Shares deep Deepslate elevations with Diamond Ore but generates freely along exposed cavern walls.",
  },
  {
    id: "lapis",
    name: "Lapis Lazuli",
    shortName: "Lapis Lazuli",
    symbol: "LP",
    iconType: "cluster",
    dimension: DIMENSIONS.OVERWORLD,
    isPrimarySupported: true,
    swatchColor: "#5b87e6",
    stratumRange: "Y: -64 to 64",
    optimalElevation: "Y: -1 to 3",
    distributionType: "Triangular (Y: -32 to 32) + Uniform (Y: -64 to 64)",
    airExposureRule: "Buried batch (100% buried) + standard scatter batch",
    biomeModifier: "All Overworld biomes",
    notes:
      "Peaks near the Stone-to-Deepslate transition boundary around Y=0 with a dedicated buried pass.",
  },
  {
    id: "copper",
    name: "Copper Ore",
    shortName: "Copper",
    symbol: "CU",
    iconType: "ingot",
    dimension: DIMENSIONS.OVERWORLD,
    isPrimarySupported: true,
    swatchColor: "#d97d48",
    stratumRange: "Y: -16 to 112",
    optimalElevation: "Y: 47 to 49",
    distributionType: "Triangular + Large Granite Veins (Y: 0 to 48)",
    airExposureRule: "No air exposure discard penalty",
    biomeModifier: "Larger blobs in Dripstone Caves biomes",
    notes:
      "Generates double-sized veins inside Dripstone Caves and forms procedural Granite-Copper mega-veins.",
  },
  {
    id: "coal",
    name: "Coal Ore",
    shortName: "Coal",
    symbol: "CL",
    iconType: "mineral",
    dimension: DIMENSIONS.OVERWORLD,
    isPrimarySupported: true,
    swatchColor: "#8c9690",
    stratumRange: "Y: 0 to 320",
    optimalElevation: "Y: 95 to 96 (Lower) / Y: 136+ (Upper)",
    distributionType: "Triangular (Y: 0 to 192) + Uniform (Y: 136 to 320)",
    airExposureRule: "50% buried bias in lower triangular pass",
    biomeModifier: "All Overworld biomes (absent in Deepslate below Y=0)",
    notes:
      "Does not generate below Y=0; peaks around Y=96 and remains abundant across elevated hills and cliffs.",
  },
];

/**
 * Returns the 8 primary supported ores for the workspace and homepage grid.
 */
export function getSupportedOres() {
  return ORE_CATALOG;
}

/**
 * Helper to filter ores by selected dimension.
 * @param {"overworld" | "nether"} dimension
 */
export function getOresByDimension(dimension) {
  if (!dimension) return ORE_CATALOG;
  return ORE_CATALOG.filter((ore) => ore.dimension === dimension);
}
