/**
 * Pure Coordinate & Chunk Mathematics Utilities
 *
 * In Minecraft, each chunk is 16×16 blocks horizontally, and each region file (MCA)
 * contains 32×32 chunks (512×512 blocks).
 * These utilities are deterministic and safe to use in Phase 01 UI telemetry
 * without fabricating ore generation coordinates.
 */

/**
 * Converts block X/Z coordinates to chunk and region coordinates.
 *
 * @param {number} blockX
 * @param {number} blockZ
 */
export function blockToChunkCoordinates(blockX, blockZ) {
  const safeX = Number.isFinite(blockX) ? Math.floor(blockX) : 0;
  const safeZ = Number.isFinite(blockZ) ? Math.floor(blockZ) : 0;

  const chunkX = Math.floor(safeX / 16);
  const chunkZ = Math.floor(safeZ / 16);
  const regionX = Math.floor(chunkX / 32);
  const regionZ = Math.floor(chunkZ / 32);

  const localX = ((safeX % 16) + 16) % 16;
  const localZ = ((safeZ % 16) + 16) % 16;

  return {
    blockX: safeX,
    blockZ: safeZ,
    chunkX,
    chunkZ,
    regionX,
    regionZ,
    localX,
    localZ,
    chunkBounds: {
      minX: chunkX * 16,
      maxX: chunkX * 16 + 15,
      minZ: chunkZ * 16,
      maxZ: chunkZ * 16 + 15,
    },
  };
}

/**
 * Computes total chunks and horizontal area covered by a square chunk radius.
 * A radius of R chunks covers (2R + 1) × (2R + 1) chunks centered on the origin chunk.
 *
 * @param {number} radiusChunks
 */
export function calculateSearchFootprint(radiusChunks) {
  const r = Math.max(1, Math.min(32, Number(radiusChunks) || 4));
  const diameterChunks = r * 2 + 1;
  const totalChunks = diameterChunks * diameterChunks;
  const diameterBlocks = diameterChunks * 16;

  return {
    radiusChunks: r,
    diameterChunks,
    totalChunks,
    diameterBlocks,
  };
}
