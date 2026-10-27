import {
  resolveWorldSeed,
  javaStringHashCode,
  MIN_LONG_64,
  MAX_LONG_64,
} from "../engine/seed/seedEngine.js";

/**
 * Dedicated seed validation and normalization module.
 */
export function validateSeedInput(rawSeed, edition = "java") {
  return resolveWorldSeed(rawSeed, { edition });
}

export { resolveWorldSeed, javaStringHashCode, MIN_LONG_64, MAX_LONG_64 };
