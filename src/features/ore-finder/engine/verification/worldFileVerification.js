/**
 * Optional World File Verification Capability Assessment (Phase 03)
 *
 * Documents the architectural contract and security/format constraints for
 * future local read-only Minecraft save-file inspection:
 * - Java Edition: Anvil `.mca` region files (`r.X.Z.mca`) containing zlib/LZ4-compressed
 *   NBT chunk sections (`sections[].block_states.palette` and packed 64-bit `data` arrays).
 * - Bedrock Edition: Modified LevelDB key-value store (`db/` directory with SubChunkPrefix
 *   records).
 *
 * Phase 03 Status:
 * Disabled (`worldFileVerification: false`) to avoid bundling unverified third-party
 * binary NBT/LevelDB parsers in Phase 03. Seed-based deterministic candidates and
 * save-file block scanning represent distinct epistemological evidence tiers and are
 * never conflated.
 */

export const WORLD_FILE_VERIFICATION_SPEC = {
  enabledInPhase03: false,
  evidenceClassification: "verified-exact",
  securityConstraints: {
    localBrowserProcessingOnly: true,
    serverUploadPermitted: false,
    maxRegionFileSizeBytes: 16 * 1024 * 1024, // 16 MB safety ceiling per .mca region file
  },
  supportedFormats: {
    java: {
      extension: ".mca",
      formatName: "Anvil Region Format (Minecraft 1.18+ Block States Palette)",
      status: "Planned for future phase",
    },
    bedrock: {
      extension: "LevelDB",
      formatName: "Bedrock LevelDB SubChunk Storage",
      status: "Planned for future phase",
    },
  },
};

/**
 * Returns the current status of local world-file verification.
 */
export function getWorldFileVerificationStatus() {
  return WORLD_FILE_VERIFICATION_SPEC;
}
