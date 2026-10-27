/**
 * Coordinate & Chunk Mathematics Engine (Phase 03)
 *
 * Implements:
 * - World-to-chunk conversion (floor division for negative coordinates)
 * - Chunk-to-world conversion
 * - Local chunk coordinates (0..15)
 * - Search boundaries & chunk grid enumeration
 * - 3D Euclidean distance, 2D Horizontal X/Z distance, Vertical Y distance
 * - Explicit radius containment checks
 * - Deterministic result sorting
 */

export const CHUNK_SIZE = 16;
export const REGION_CHUNKS = 32;
export const WORLD_BORDER_MAX = 29999984;

/**
 * Converts world block X/Z coordinates to chunk and MCA region coordinates.
 * Uses `Math.floor` so negative coordinates map accurately (e.g. X = -1 -> chunkX = -1, localX = 15).
 *
 * @param {number} blockX
 * @param {number} blockZ
 */
export function worldToChunk(blockX, blockZ) {
  const x = Number.isFinite(Number(blockX)) ? Math.floor(Number(blockX)) : 0;
  const z = Number.isFinite(Number(blockZ)) ? Math.floor(Number(blockZ)) : 0;

  const chunkX = Math.floor(x / CHUNK_SIZE);
  const chunkZ = Math.floor(z / CHUNK_SIZE);

  const regionX = Math.floor(chunkX / REGION_CHUNKS);
  const regionZ = Math.floor(chunkZ / REGION_CHUNKS);

  const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
  const localZ = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

  return {
    blockX: x,
    blockZ: z,
    chunkX,
    chunkZ,
    regionX,
    regionZ,
    localX,
    localZ,
    chunkBounds: chunkToWorldBounds(chunkX, chunkZ),
  };
}

/**
 * Converts chunk coordinates `[chunkX, chunkZ]` to world block boundaries.
 *
 * @param {number} chunkX
 * @param {number} chunkZ
 */
export function chunkToWorldBounds(chunkX, chunkZ) {
  const cx = Math.floor(Number(chunkX) || 0);
  const cz = Math.floor(Number(chunkZ) || 0);
  const minX = cx * CHUNK_SIZE;
  const minZ = cz * CHUNK_SIZE;
  return {
    chunkX: cx,
    chunkZ: cz,
    minX,
    maxX: minX + (CHUNK_SIZE - 1),
    minZ,
    maxZ: minZ + (CHUNK_SIZE - 1),
    centerX: minX + 8,
    centerZ: minZ + 8,
  };
}

/**
 * Converts chunk coordinates plus local offset `(0..15)` into world block coordinates.
 *
 * @param {number} chunkX
 * @param {number} chunkZ
 * @param {number} localX
 * @param {number} localZ
 */
export function chunkLocalToWorld(chunkX, chunkZ, localX = 0, localZ = 0) {
  const lx = Math.max(0, Math.min(15, Math.floor(Number(localX) || 0)));
  const lz = Math.max(0, Math.min(15, Math.floor(Number(localZ) || 0)));
  return {
    x: Math.floor(Number(chunkX) || 0) * CHUNK_SIZE + lx,
    z: Math.floor(Number(chunkZ) || 0) * CHUNK_SIZE + lz,
  };
}

/**
 * Computes 3D Euclidean distance, 2D Horizontal X/Z distance, and Vertical Y distance
 * between two 3D points.
 *
 * @param {{ x: number, y: number, z: number }} origin
 * @param {{ x: number, y: number, z: number }} target
 */
export function computeCoordinateDistances(origin, target) {
  const dx = Number(target.x) - Number(origin.x);
  const dy = Number(target.y) - Number(origin.y);
  const dz = Number(target.z) - Number(origin.z);

  const distanceHorizontal = Math.hypot(dx, dz);
  const distance3D = Math.hypot(dx, dy, dz);
  const distanceVertical = Math.abs(dy);

  return {
    dx,
    dy,
    dz,
    distance3D: Math.round(distance3D * 10) / 10,
    distanceHorizontal: Math.round(distanceHorizontal * 10) / 10,
    distanceVertical: Math.round(distanceVertical * 10) / 10,
  };
}

/**
 * Computes explicit search boundaries around an origin block and chunk radius.
 *
 * Search Radius Definition:
 * - `radiusChunks` defines a square grid of `[originChunkX - R .. originChunkX + R]`
 *   and `[originChunkZ - R .. originChunkZ + R]`, plus a horizontal block radius
 *   of `R * 16` blocks for circular horizontal containment when requested.
 *
 * @param {number} originBlockX
 * @param {number} originBlockZ
 * @param {number} radiusChunks
 */
export function computeSearchBoundaries(originBlockX, originBlockZ, radiusChunks) {
  const r = Math.max(1, Math.min(32, Math.floor(Number(radiusChunks) || 8)));
  const originChunk = worldToChunk(originBlockX, originBlockZ);

  const minChunkX = originChunk.chunkX - r;
  const maxChunkX = originChunk.chunkX + r;
  const minChunkZ = originChunk.chunkZ - r;
  const maxChunkZ = originChunk.chunkZ + r;

  const diameterChunks = r * 2 + 1;
  const totalChunks = diameterChunks * diameterChunks;
  const radiusBlocks = r * CHUNK_SIZE;
  const diameterBlocks = diameterChunks * CHUNK_SIZE;

  return {
    originChunkX: originChunk.chunkX,
    originChunkZ: originChunk.chunkZ,
    radiusChunks: r,
    radiusBlocks,
    diameterChunks,
    diameterBlocks,
    totalChunks,
    chunkRange: {
      minChunkX,
      maxChunkX,
      minChunkZ,
      maxChunkZ,
    },
    worldBlockBounds: {
      minX: minChunkX * CHUNK_SIZE,
      maxX: maxChunkX * CHUNK_SIZE + (CHUNK_SIZE - 1),
      minZ: minChunkZ * CHUNK_SIZE,
      maxZ: maxChunkZ * CHUNK_SIZE + (CHUNK_SIZE - 1),
    },
  };
}

/**
 * Checks whether a target block `(x, y, z)` lies within the configured search radius.
 * Supports `"chunk-square"` (within the `(2R+1)×(2R+1)` chunk square) or
 * `"horizontal-circle"` (within `R * 16` horizontal blocks of origin X/Z).
 *
 * @param {{ x: number, y: number, z: number }} origin
 * @param {{ x: number, y: number, z: number }} target
 * @param {number} radiusChunks
 * @param {"chunk-square" | "horizontal-circle"} [mode="chunk-square"]
 */
export function isWithinSearchRadius(origin, target, radiusChunks, mode = "chunk-square") {
  const bounds = computeSearchBoundaries(origin.x, origin.z, radiusChunks);
  if (mode === "horizontal-circle") {
    const dist = Math.hypot(target.x - origin.x, target.z - origin.z);
    return dist <= bounds.radiusBlocks;
  }

  const targetChunk = worldToChunk(target.x, target.z);
  return (
    targetChunk.chunkX >= bounds.chunkRange.minChunkX &&
    targetChunk.chunkX <= bounds.chunkRange.maxChunkX &&
    targetChunk.chunkZ >= bounds.chunkRange.minChunkZ &&
    targetChunk.chunkZ <= bounds.chunkRange.maxChunkZ
  );
}

/**
 * Deterministically sorts candidate results with stable tie-breaking.
 *
 * @param {Array<Object>} results
 * @param {"distance-3d" | "distance-horizontal" | "elevation-y"} [sortBy="distance-3d"]
 */
export function sortCoordinateResults(results = [], sortBy = "distance-3d") {
  return [...results].sort((a, b) => {
    if (sortBy === "distance-horizontal") {
      const diff = (a.distanceHorizontal ?? 0) - (b.distanceHorizontal ?? 0);
      if (diff !== 0) return diff;
    } else if (sortBy === "elevation-y") {
      const diff = (a.y ?? 0) - (b.y ?? 0);
      if (diff !== 0) return diff;
    } else {
      const diff = (a.distance3D ?? 0) - (b.distance3D ?? 0);
      if (diff !== 0) return diff;
    }

    // Deterministic tie-breakers: x, z, y, id
    if ((a.x ?? 0) !== (b.x ?? 0)) return (a.x ?? 0) - (b.x ?? 0);
    if ((a.z ?? 0) !== (b.z ?? 0)) return (a.z ?? 0) - (b.z ?? 0);
    if ((a.y ?? 0) !== (b.y ?? 0)) return (a.y ?? 0) - (b.y ?? 0);
    return String(a.id).localeCompare(String(b.id));
  });
}
