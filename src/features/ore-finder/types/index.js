/**
 * Domain Contracts & Constants for the OreFinder.io Analysis Workspace
 */

export const EDITIONS = {
  JAVA: "java",
  BEDROCK: "bedrock",
};

export const DIMENSIONS = {
  OVERWORLD: "overworld",
  NETHER: "nether",
};

export const WORKSPACE_STATUS = {
  IDLE: "idle",
  VALIDATING: "validating",
  PHASE_01_STANDBY: "phase_01_standby",
  CALCULATION_UNAVAILABLE: "calculation_unavailable",
  UNSUPPORTED_VERSION: "unsupported_version",
  INVALID_INPUT: "invalid_input",
};

export const RADIUS_MODES = {
  PRESET: "preset",
  CUSTOM: "custom",
};

export const RADIUS_LIMITS = {
  MIN_CHUNKS: 1,
  MAX_CHUNKS: 32,
  DEFAULT_CHUNKS: 8,
};
