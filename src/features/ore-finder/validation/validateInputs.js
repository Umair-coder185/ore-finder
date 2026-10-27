import { VERSION_GROUPS, DIMENSION_OPTIONS, RADIUS_LIMITS } from "../config/editions.js";

const MIN_SIGNED_64 = BigInt("-9223372036854775808");
const MAX_SIGNED_64 = BigInt("9223372036854775807");

/**
 * Validates whether a numeric string fits within a signed 64-bit integer.
 * @param {string} str
 */
function isValidSigned64BitInteger(str) {
  try {
    const val = BigInt(str);
    return val >= MIN_SIGNED_64 && val <= MAX_SIGNED_64;
  } catch {
    return false;
  }
}

/**
 * Comprehensive validation for OreFinder.io workspace inputs.
 * Checks:
 * - Edition & Version compatibility (flags unsupported versions explicitly)
 * - World Seed (numeric 64-bit integer bounds or text seed length)
 * - Player Coordinates X, Y, Z (numeric & within dimension/world borders)
 * - Search Radius (within 1 to 32 chunks)
 * - Selected Ores (at least 1 ore selected)
 *
 * @param {Object} params
 * @returns {{
 *   isValid: boolean,
 *   isVersionSupported: boolean,
 *   versionMeta: Object | null,
 *   issues: Array<{ field: string, message: string }>,
 *   fieldErrors: Record<string, string>
 * }}
 */
export function validateOreSearchInputs(params) {
  /** @type {Array<{ field: string, message: string }>} */
  const issues = [];

  // 1. Edition & Version compatibility check
  const editionVersions = VERSION_GROUPS[params.edition] || [];
  const versionMeta = editionVersions.find((v) => v.value === params.version) || null;
  const isVersionSupported = Boolean(versionMeta && versionMeta.isSupported);

  if (!versionMeta) {
    issues.push({
      field: "version",
      message: "Select a defined Minecraft version from the release list.",
    });
  } else if (!versionMeta.isSupported) {
    issues.push({
      field: "version",
      message: versionMeta.compatibilityNote,
    });
  }

  // 2. World Seed validation
  const trimmedSeed = String(params.seed ?? "").trim();
  if (!trimmedSeed) {
    issues.push({
      field: "seed",
      message: "Enter a world seed (64-bit numeric seed or alphanumeric text phrase).",
    });
  } else if (trimmedSeed.length > 100) {
    issues.push({
      field: "seed",
      message: "World seed must be 100 characters or fewer.",
    });
  } else if (/^[+-]?\d+$/.test(trimmedSeed)) {
    if (!isValidSigned64BitInteger(trimmedSeed)) {
      issues.push({
        field: "seed",
        message:
          "Numeric seed exceeds 64-bit signed integer limits (-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807).",
      });
    }
  }

  // 3. Player Coordinates (X, Y, Z) validation
  const rawX = String(params.x ?? "").trim();
  const rawY = String(params.y ?? "").trim();
  const rawZ = String(params.z ?? "").trim();

  const parsedX = Number(rawX);
  const parsedY = Number(rawY);
  const parsedZ = Number(rawZ);

  if (rawX === "" || Number.isNaN(parsedX) || !Number.isFinite(parsedX)) {
    issues.push({
      field: "x",
      message: "Enter a valid numeric X coordinate.",
    });
  } else if (Math.abs(parsedX) > 29999984) {
    issues.push({
      field: "x",
      message: "X coordinate must be within world border (±29,999,984).",
    });
  }

  if (rawZ === "" || Number.isNaN(parsedZ) || !Number.isFinite(parsedZ)) {
    issues.push({
      field: "z",
      message: "Enter a valid numeric Z coordinate.",
    });
  } else if (Math.abs(parsedZ) > 29999984) {
    issues.push({
      field: "z",
      message: "Z coordinate must be within world border (±29,999,984).",
    });
  }

  const dimensionConfig = DIMENSION_OPTIONS.find((d) => d.value === params.dimension);
  const minY = versionMeta?.yBounds?.min ?? dimensionConfig?.minY ?? -64;
  const maxY = versionMeta?.yBounds?.max ?? dimensionConfig?.maxY ?? 319;

  if (rawY === "" || Number.isNaN(parsedY) || !Number.isFinite(parsedY)) {
    issues.push({
      field: "y",
      message: "Enter a valid numeric Y altitude.",
    });
  } else if (parsedY < minY || parsedY > maxY) {
    issues.push({
      field: "y",
      message: `Y altitude for ${versionMeta?.shortVersion || "this version"} must be between ${minY} and ${maxY}.`,
    });
  }

  // 4. Search Radius validation
  const rawRadius = String(params.radiusChunks ?? "").trim();
  const parsedRadius = Number(rawRadius);
  if (rawRadius === "" || Number.isNaN(parsedRadius) || !Number.isInteger(parsedRadius)) {
    issues.push({
      field: "radiusChunks",
      message: "Search radius must be a whole number of chunks.",
    });
  } else if (parsedRadius < RADIUS_LIMITS.MIN_CHUNKS || parsedRadius > RADIUS_LIMITS.MAX_CHUNKS) {
    issues.push({
      field: "radiusChunks",
      message: `Search radius must be between ${RADIUS_LIMITS.MIN_CHUNKS} and ${RADIUS_LIMITS.MAX_CHUNKS} chunks (16m to 512m radius).`,
    });
  }

  // 5. Ore Selection validation
  if (!Array.isArray(params.selectedOres) || params.selectedOres.length === 0) {
    issues.push({
      field: "selectedOres",
      message: "Select at least one target ore to include in the workspace filter.",
    });
  }

  /** @type {Record<string, string>} */
  const fieldErrors = {};
  for (const issue of issues) {
    if (!fieldErrors[issue.field]) {
      fieldErrors[issue.field] = issue.message;
    }
  }

  return {
    isValid: issues.length === 0,
    isVersionSupported,
    versionMeta,
    issues,
    fieldErrors,
  };
}
