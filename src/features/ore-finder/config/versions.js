import { VERSION_GROUPS } from "./editions.js";
import { getVersionCapability } from "../engine/compatibility/capabilityRegistry.js";

/**
 * Version catalog & capability lookup utilities.
 */
export function getVersionsByEdition(edition) {
  const list = VERSION_GROUPS[edition] || [];
  return list.map((ver) => ({
    ...ver,
    capability: getVersionCapability(edition, ver.value),
  }));
}

export { VERSION_GROUPS, getVersionCapability };
