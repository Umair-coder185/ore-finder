/**
 * Minecraft World Seed Processing & Deterministic PRNG Engine
 *
 * Uses 64-bit signed BigInt arithmetic exclusively.
 * Never uses unsafe JavaScript Number arithmetic for 64-bit seed operations.
 *
 * Implemented & Independently Verifiable Algorithms:
 * 1. Java `String.hashCode()` 32-bit signed polynomial rolling hash (`31 * h + charCode`)
 * 2. Signed 64-bit integer (`long`) parsing and bounds validation (`-2^63` to `2^63 - 1`)
 * 3. `Stafford13` 64-bit SplitMix64 mixing function (`RandomSupport.mixStafford13`)
 * 4. `upgradeSeedTo128bit` (`SILVER_RATIO_64` & `GOLDEN_RATIO_64`)
 * 5. `Xoroshiro128++` (`Xoroshiro128PlusPlus`) 128-bit PRNG used in Java 1.18–1.21
 * 6. `LegacyRandomSource` 48-bit LCG (`0x5DEECE66DL`)
 * 7. Chunk decoration seed derivation (`setDecorationSeed` and `setFeatureSeed`)
 */

export const MIN_LONG_64 = -9223372036854775808n;
export const MAX_LONG_64 = 9223372036854775807n;

export const SILVER_RATIO_64 = 7640891576956012809n; // 0x6A09E667F3BCC909L
export const GOLDEN_RATIO_64 = -7046029254386353131n; // 0x9E3779B97F4A7C15L
export const STAFFORD_MIX_1 = -4658895280553007687n; // 0xBF58476D1CE4E5B9L
export const STAFFORD_MIX_2 = -7723592293110705685n; // 0x94D049BB133111EBL

export const LCG_MULTIPLIER = 0x5deece66dn;
export const LCG_ADDEND = 0xbn;
export const LCG_MASK = (1n << 48n) - 1n;

/**
 * Coerces a BigInt to a signed 64-bit two's complement integer (`long`).
 * @param {bigint} value
 * @returns {bigint}
 */
export function toSigned64(value) {
  return BigInt.asIntN(64, value);
}

/**
 * Coerces a BigInt to an unsigned 64-bit integer.
 * @param {bigint} value
 * @returns {bigint}
 */
export function toUnsigned64(value) {
  return BigInt.asUintN(64, value);
}

/**
 * 64-bit left rotation on an unsigned 64-bit BigInt, returning signed 64-bit BigInt.
 * @param {bigint} x
 * @param {number} k
 * @returns {bigint}
 */
export function rotl64(x, k) {
  const u = toUnsigned64(x);
  const shift = BigInt(k & 63);
  if (shift === 0n) return toSigned64(u);
  const rotated = (u << shift) | (u >> (64n - shift));
  return toSigned64(rotated);
}

/**
 * Exact implementation of `java.lang.String.hashCode()`.
 * Formula: s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1] in 32-bit signed arithmetic.
 *
 * Independent test vectors:
 * - javaStringHashCode("") === 0
 * - javaStringHashCode("abc") === 96354
 * - javaStringHashCode("minecraft") === -1610523250
 * - javaStringHashCode("pollinating sandboxes") === 0
 *
 * @param {string} str
 * @returns {number} Signed 32-bit integer
 */
export function javaStringHashCode(str) {
  const input = String(str);
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return hash;
}

/**
 * Parses and resolves a user-entered world seed string into a deterministic
 * 64-bit signed BigInt and metadata descriptor.
 *
 * Rules matching Minecraft's seed input handling:
 * 1. Leading and trailing whitespace is trimmed.
 * 2. Empty input is invalid.
 * 3. If the string matches a signed integer (`^[+-]?\d+$`), it is parsed as a
 *    signed 64-bit integer (`long`). If it overflows `[-2^63, 2^63 - 1]`,
 *    Minecraft Java falls back to `String.hashCode()` in legacy dialogs or rejects
 *    direct numeric parsing; we explicitly report numeric overflow during validation
 *    so users do not accidentally hash a mistyped numeric seed, while also providing
 *    the exact `javaStringHashCode` fallback when requested.
 * 4. Any non-numeric string is converted deterministically via `javaStringHashCode(trimmed)`.
 *
 * @param {string | number | bigint} rawSeed
 * @param {Object} [options]
 * @param {string} [options.edition="java"]
 * @returns {{
 *   isValid: boolean,
 *   rawInput: string,
 *   normalizedInput: string,
 *   inputType: "numeric-64" | "text-hashed" | "invalid",
 *   worldSeedLong: bigint | null,
 *   worldSeedString: string | null,
 *   hashCode32: number | null,
 *   error: string | null
 * }}
 */
export function resolveWorldSeed(rawSeed, options = {}) {
  const edition = options.edition || "java";
  const rawInput = rawSeed === null || rawSeed === undefined ? "" : String(rawSeed);
  const normalizedInput = rawInput.trim();

  if (!normalizedInput) {
    return {
      isValid: false,
      rawInput,
      normalizedInput,
      inputType: "invalid",
      worldSeedLong: null,
      worldSeedString: null,
      hashCode32: null,
      error: "World seed cannot be empty.",
    };
  }

  if (normalizedInput.length > 100) {
    return {
      isValid: false,
      rawInput,
      normalizedInput,
      inputType: "invalid",
      worldSeedLong: null,
      worldSeedString: null,
      hashCode32: null,
      error: "World seed must be 100 characters or fewer.",
    };
  }

  // Check if purely numeric (with optional +/- sign)
  if (/^[+-]?\d+$/.test(normalizedInput)) {
    try {
      const parsedBigInt = BigInt(normalizedInput);
      if (parsedBigInt < MIN_LONG_64 || parsedBigInt > MAX_LONG_64) {
        return {
          isValid: false,
          rawInput,
          normalizedInput,
          inputType: "invalid",
          worldSeedLong: null,
          worldSeedString: null,
          hashCode32: null,
          error:
            "Numeric seed exceeds 64-bit signed integer limits (-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807).",
        };
      }

      return {
        isValid: true,
        rawInput,
        normalizedInput,
        inputType: "numeric-64",
        worldSeedLong: parsedBigInt,
        worldSeedString: parsedBigInt.toString(10),
        hashCode32: null,
        edition,
        error: null,
      };
    } catch {
      return {
        isValid: false,
        rawInput,
        normalizedInput,
        inputType: "invalid",
        worldSeedLong: null,
        worldSeedString: null,
        hashCode32: null,
        error: "Invalid numeric seed format.",
      };
    }
  }

  // Non-numeric text seed -> deterministic 32-bit signed polynomial hash
  const hash32 = javaStringHashCode(normalizedInput);
  const seedLong = BigInt(hash32);

  return {
    isValid: true,
    rawInput,
    normalizedInput,
    inputType: "text-hashed",
    worldSeedLong: seedLong,
    worldSeedString: seedLong.toString(10),
    hashCode32: hash32,
    edition,
    error: null,
  };
}

/**
 * Stafford variant 13 64-bit mixing function (`RandomSupport.mixStafford13`).
 * @param {bigint} z
 * @returns {bigint} Signed 64-bit integer
 */
export function mixStafford13(z) {
  let u = toUnsigned64(z);
  u = toUnsigned64((u ^ (u >> 30n)) * toUnsigned64(STAFFORD_MIX_1));
  u = toUnsigned64((u ^ (u >> 27n)) * toUnsigned64(STAFFORD_MIX_2));
  u = toUnsigned64(u ^ (u >> 31n));
  return toSigned64(u);
}

/**
 * Upgrades a 64-bit signed seed to a 128-bit Xoroshiro state (`RandomSupport.upgradeSeedTo128bit`).
 * @param {bigint} seed64
 * @returns {{ seedLo: bigint, seedHi: bigint }}
 */
export function upgradeSeedTo128bit(seed64) {
  const s = toSigned64(seed64);
  const unmixedLo = toSigned64(s ^ SILVER_RATIO_64);
  const unmixedHi = toSigned64(unmixedLo + GOLDEN_RATIO_64);
  return {
    seedLo: mixStafford13(unmixedLo),
    seedHi: mixStafford13(unmixedHi),
  };
}

/**
 * Deterministic Xoroshiro128++ PRNG (`XoroshiroRandomSource` / `Xoroshiro128PlusPlus`)
 * matching Minecraft Java 1.18–1.21 `net.minecraft.world.level.levelgen.Xoroshiro128PlusPlus`.
 */
export class Xoroshiro128PlusPlus {
  /**
   * @param {bigint} seedLo
   * @param {bigint} seedHi
   */
  constructor(seedLo, seedHi) {
    let lo = toSigned64(seedLo);
    let hi = toSigned64(seedHi);
    if ((lo | hi) === 0n) {
      lo = GOLDEN_RATIO_64;
      hi = SILVER_RATIO_64;
    }
    this.seedLo = lo;
    this.seedHi = hi;
  }

  /**
   * Creates an instance from a single 64-bit seed using `upgradeSeedTo128bit`.
   * @param {bigint} seed64
   */
  static fromSeed(seed64) {
    const { seedLo, seedHi } = upgradeSeedTo128bit(seed64);
    return new Xoroshiro128PlusPlus(seedLo, seedHi);
  }

  /**
   * Generates the next 64-bit signed integer (`nextLong()`).
   * @returns {bigint}
   */
  nextLong() {
    const s0 = this.seedLo;
    let s1 = this.seedHi;
    const result = toSigned64(rotl64(toSigned64(s0 + s1), 17) + s0);

    s1 = toSigned64(s1 ^ s0);
    this.seedLo = toSigned64(rotl64(s0, 49) ^ s1 ^ toSigned64(s1 << 21n));
    this.seedHi = rotl64(s1, 28);

    return result;
  }

  /**
   * Returns an unsigned n-bit value from the top bits of `nextLong()`.
   * @param {number} bits
   * @returns {bigint}
   */
  nextBits(bits) {
    return toUnsigned64(this.nextLong()) >> BigInt(64 - bits);
  }

  /**
   * Generates a uniformly distributed integer in `[0, bound)` matching
   * Minecraft's `XoroshiroRandomSource.nextInt(int bound)`.
   * @param {number} bound
   * @returns {number}
   */
  nextInt(bound) {
    if (!Number.isInteger(bound) || bound <= 0) {
      throw new RangeError("bound must be a positive integer");
    }
    const b = BigInt(bound);
    // Unsigned 32-bit value from the lower 32 bits of nextLong (or top 32 bits)
    let r = toUnsigned64(this.nextLong()) & 0xffffffffn;
    let m = r * b;
    let low = m & 0xffffffffn;
    if (low < b) {
      const t = (0x100000000n - b) % b;
      while (low < t) {
        r = toUnsigned64(this.nextLong()) & 0xffffffffn;
        m = r * b;
        low = m & 0xffffffffn;
      }
    }
    return Number(m >> 32n);
  }

  /**
   * Generates a float in `[0, 1)` matching `nextFloat()` (24 bits of precision).
   * @returns {number}
   */
  nextFloat() {
    return Number(this.nextBits(24)) * 5.960464477539063e-8; // 2^-24
  }
}

/**
 * Legacy 48-bit Linear Congruential Generator (`java.util.Random` / `LegacyRandomSource`).
 */
export class LegacyRandom {
  /**
   * @param {bigint} seed64
   */
  constructor(seed64) {
    this.seed = (toUnsigned64(seed64) ^ LCG_MULTIPLIER) & LCG_MASK;
  }

  /**
   * @param {number} bits
   * @returns {number} Signed 32-bit int
   */
  next(bits) {
    this.seed = (this.seed * LCG_MULTIPLIER + LCG_ADDEND) & LCG_MASK;
    return Number(BigInt.asIntN(32, this.seed >> BigInt(48 - bits)));
  }

  /**
   * @returns {bigint} Signed 64-bit long
   */
  nextLong() {
    const high = BigInt(this.next(32));
    const low = BigInt(this.next(32));
    return toSigned64((high << 32n) + low);
  }
}

/**
 * Derives the 64-bit chunk decoration seed (`WorldgenRandom.setDecorationSeed`).
 *
 * In Minecraft Java:
 * 1. Seeds the generator with `worldSeed`.
 * 2. Draws `a = nextLong() | 1L` and `b = nextLong() | 1L`.
 * 3. Returns `(blockX * a + blockZ * b) ^ worldSeed` (64-bit signed overflow).
 *
 * @param {bigint} worldSeed
 * @param {number} chunkMinBlockX - `chunkX * 16`
 * @param {number} chunkMinBlockZ - `chunkZ * 16`
 * @returns {bigint}
 */
export function deriveChunkDecorationSeed(worldSeed, chunkMinBlockX, chunkMinBlockZ) {
  const rng = Xoroshiro128PlusPlus.fromSeed(worldSeed);
  const a = toSigned64(rng.nextLong() | 1n);
  const b = toSigned64(rng.nextLong() | 1n);
  const x = BigInt(Math.floor(chunkMinBlockX));
  const z = BigInt(Math.floor(chunkMinBlockZ));
  const mixed = toSigned64(toSigned64(x * a) + toSigned64(z * b));
  return toSigned64(mixed ^ toSigned64(worldSeed));
}

/**
 * Derives the feature-specific seed (`WorldgenRandom.setFeatureSeed`).
 * Formula: `decorationSeed + index + (10000 * step)`
 *
 * @param {bigint} decorationSeed
 * @param {number} featureIndex
 * @param {number} generationStep - e.g. 6 for `UNDERGROUND_ORES`
 * @returns {bigint}
 */
export function deriveFeatureSeed(decorationSeed, featureIndex, generationStep = 6) {
  const offset = BigInt(featureIndex) + BigInt(10000 * generationStep);
  return toSigned64(toSigned64(decorationSeed) + offset);
}
