import { EDITIONS, DIMENSIONS, RADIUS_LIMITS } from "../types/index.js";

/**
 * Centralized Minecraft Edition & Version Configuration
 * Includes version compatibility metadata and explicit unsupported-version flags.
 */
export const EDITION_OPTIONS = [
  {
    id: EDITIONS.JAVA,
    label: "Java Edition",
    shortLabel: "Java",
    platformNote: "Windows, macOS, Linux",
    prngModel: "Xoroshiro128++ Decorator Stream",
    description:
      "Standard PC edition with 64-bit world seeds and modern Caves & Cliffs II+ multi-noise feature placement.",
  },
  {
    id: EDITIONS.BEDROCK,
    label: "Bedrock Edition",
    shortLabel: "Bedrock",
    platformNote: "Console, Mobile, Windows",
    prngModel: "MT19937 Decorator Stream",
    description:
      "Cross-platform edition sharing 1.18–1.21 vertical ore strata with edition-specific feature seeding.",
  },
];

export const VERSION_GROUPS = {
  [EDITIONS.JAVA]: [
    {
      value: "java-1.21",
      label: "Java 1.21.x (Tricky Trials)",
      shortVersion: "1.21.x",
      era: "Modern Deepslate Strata (1.18+)",
      isSupported: true,
      yBounds: { min: -64, max: 319 },
      compatibilityNote:
        "Supported configuration profile. Uses modern -64 to 319 vertical world height and triangular ore distributions.",
      supportedDimensions: [DIMENSIONS.OVERWORLD, DIMENSIONS.NETHER],
    },
    {
      value: "java-1.20",
      label: "Java 1.20.x (Trails & Tales)",
      shortVersion: "1.20.x",
      era: "Modern Deepslate Strata (1.18+)",
      isSupported: true,
      yBounds: { min: -64, max: 319 },
      compatibilityNote:
        "Supported configuration profile. Full parity with modern 1.18+ Overworld and Deepslate ore tables.",
      supportedDimensions: [DIMENSIONS.OVERWORLD, DIMENSIONS.NETHER],
    },
    {
      value: "java-1.19",
      label: "Java 1.19.x (The Wild Update)",
      shortVersion: "1.19.x",
      era: "Modern Deepslate Strata (1.18+)",
      isSupported: true,
      yBounds: { min: -64, max: 319 },
      compatibilityNote:
        "Supported configuration profile. Standard Caves & Cliffs Part II vertical ore distribution.",
      supportedDimensions: [DIMENSIONS.OVERWORLD, DIMENSIONS.NETHER],
    },
    {
      value: "java-1.18",
      label: "Java 1.18.x (Caves & Cliffs Part II)",
      shortVersion: "1.18.x",
      era: "Modern Deepslate Strata (1.18+)",
      isSupported: true,
      yBounds: { min: -64, max: 319 },
      compatibilityNote:
        "Supported configuration profile. First release introducing Y = -64 Deepslate strata and large ore veins.",
      supportedDimensions: [DIMENSIONS.OVERWORLD, DIMENSIONS.NETHER],
    },
    {
      value: "java-1.17-legacy",
      label: "Java 1.16 – 1.17 (Legacy Pre-Deepslate — Unsupported)",
      shortVersion: "1.16–1.17",
      era: "Legacy Uniform Strata (Y: 0 to 255)",
      isSupported: false,
      yBounds: { min: 0, max: 255 },
      compatibilityNote:
        "Unsupported version profile: Pre-1.18 worlds use legacy Y = 0 to 255 uniform generation without Deepslate strata or triangular Caves & Cliffs distributions.",
      supportedDimensions: [DIMENSIONS.OVERWORLD, DIMENSIONS.NETHER],
    },
  ],
  [EDITIONS.BEDROCK]: [
    {
      value: "bedrock-1.21",
      label: "Bedrock 1.21.x (Tricky Trials)",
      shortVersion: "1.21.x",
      era: "Modern Unified Strata (1.18+)",
      isSupported: true,
      yBounds: { min: -64, max: 319 },
      compatibilityNote:
        "Supported configuration profile. Aligned with modern 1.18+ vertical Y-level distribution bounds.",
      supportedDimensions: [DIMENSIONS.OVERWORLD, DIMENSIONS.NETHER],
    },
    {
      value: "bedrock-1.20",
      label: "Bedrock 1.20.x (Trails & Tales)",
      shortVersion: "1.20.x",
      era: "Modern Unified Strata (1.18+)",
      isSupported: true,
      yBounds: { min: -64, max: 319 },
      compatibilityNote:
        "Supported configuration profile. Uses -64 to 319 world bounds and modern triangular ore peaks.",
      supportedDimensions: [DIMENSIONS.OVERWORLD, DIMENSIONS.NETHER],
    },
    {
      value: "bedrock-1.18-1.19",
      label: "Bedrock 1.18 – 1.19 (Caves & Cliffs II)",
      shortVersion: "1.18–1.19",
      era: "Modern Unified Strata (1.18+)",
      isSupported: true,
      yBounds: { min: -64, max: 319 },
      compatibilityNote:
        "Supported configuration profile. Modern Deepslate and mountain ore distribution rules.",
      supportedDimensions: [DIMENSIONS.OVERWORLD, DIMENSIONS.NETHER],
    },
    {
      value: "bedrock-1.17-legacy",
      label: "Bedrock 1.16 – 1.17 (Legacy Pre-Caves & Cliffs — Unsupported)",
      shortVersion: "1.16–1.17",
      era: "Legacy Uniform Strata (Y: 0 to 255)",
      isSupported: false,
      yBounds: { min: 0, max: 255 },
      compatibilityNote:
        "Unsupported version profile: Pre-1.18 Bedrock worlds use legacy 0–255 vertical limits and are excluded from 1.18+ Deepslate analysis.",
      supportedDimensions: [DIMENSIONS.OVERWORLD, DIMENSIONS.NETHER],
    },
  ],
};

export const DIMENSION_OPTIONS = [
  {
    value: DIMENSIONS.OVERWORLD,
    label: "Overworld",
    yRangeLabel: "Y: -64 to 319",
    minY: -64,
    maxY: 319,
  },
  {
    value: DIMENSIONS.NETHER,
    label: "The Nether",
    yRangeLabel: "Y: 0 to 127",
    minY: 0,
    maxY: 127,
  },
];

export const SEARCH_RADIUS_PRESETS = [
  {
    value: 4,
    label: "4 Chunks",
    sublabel: "64m radius",
    description: "Fast local chunk neighborhood (9×9 chunks)",
  },
  {
    value: 8,
    label: "8 Chunks",
    sublabel: "128m radius",
    description: "Standard exploration survey (17×17 chunks)",
  },
  {
    value: 12,
    label: "12 Chunks",
    sublabel: "192m radius",
    description: "Medium regional scan (25×25 chunks)",
  },
  {
    value: 16,
    label: "16 Chunks",
    sublabel: "256m radius",
    description: "Extended MCA sector scan (33×33 chunks)",
  },
];

export const SEARCH_RADIUS_OPTIONS = SEARCH_RADIUS_PRESETS.map((p) => ({
  value: p.value,
  label: `${p.label} (${p.sublabel})`,
}));

export const ADVANCED_OPTIONS_DEFAULTS = {
  airExposureMode: "all",
  elevationFocus: "optimal-peak",
  includeLargeNoiseVeins: true,
  sortPreference: "distance-3d",
};

export const AIR_EXPOSURE_OPTIONS = [
  {
    value: "all",
    label: "All Placements (Buried & Cave-Exposed)",
    description: "Includes both buried stone/deepslate veins and veins adjacent to cave air.",
  },
  {
    value: "buried-only",
    label: "Buried Strata Only (High-Yield Blobs)",
    description: "Targets unexposed veins that bypass Minecraft's air-exposure discard penalty.",
  },
  {
    value: "cave-exposed",
    label: "Cavern-Compatible Strata",
    description: "Prioritizes ore batches with 0% air-exposure discard penalty.",
  },
];

export const ELEVATION_FOCUS_OPTIONS = [
  {
    value: "optimal-peak",
    label: "Optimal Triangular Peak Window",
    description: "Focuses analysis near each selected ore's highest-probability Y-elevation.",
  },
  {
    value: "full-stratum",
    label: "Full Vertical Generation Range",
    description: "Includes both primary triangular peaks and secondary uniform scatter passes.",
  },
  {
    value: "player-level",
    label: "Player Altitude Band (±16 Blocks of Y)",
    description: "Scopes vertical inspection around your current Y coordinate.",
  },
];

export const SORT_PREFERENCE_OPTIONS = [
  { value: "distance-3d", label: "3D Euclidean Distance (Nearest First)" },
  { value: "distance-horizontal", label: "Horizontal X/Z Distance" },
  { value: "elevation-y", label: "Vertical Elevation (Y-Level)" },
];

export { RADIUS_LIMITS };
