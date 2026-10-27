/**
 * Formatting utilities for coordinates, seeds, distances, and teleport commands.
 */

/**
 * Formats an `(x, y, z)` coordinate triplet for display.
 * @param {number | null | undefined} x
 * @param {number | null | undefined} y
 * @param {number | null | undefined} z
 */
export function formatCoordinates(x, y, z) {
  if (x === null || x === undefined || z === null || z === undefined) {
    return "Distribution Guidance (No Block XYZ)";
  }
  return `X: ${x}, Y: ${y ?? 0}, Z: ${z}`;
}

/**
 * Formats a Minecraft `/tp` command for a given coordinate triplet.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
export function formatTeleportCommand(x, y, z) {
  const safeX = Number.isFinite(Number(x)) ? Math.floor(Number(x)) : 0;
  const safeY = Number.isFinite(Number(y)) ? Math.floor(Number(y)) : -54;
  const safeZ = Number.isFinite(Number(z)) ? Math.floor(Number(z)) : 0;
  return `/tp @s ${safeX} ${safeY} ${safeZ}`;
}

/**
 * Formats distance in meters/blocks with unit suffix.
 * @param {number | null | undefined} distance
 */
export function formatBlockDistance(distance) {
  if (distance === null || distance === undefined || !Number.isFinite(distance)) {
    return "—";
  }
  return `${distance.toFixed(1)}m`;
}
