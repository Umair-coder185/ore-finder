import { validateOreSearchInputs } from "./validateInputs.js";

/**
 * Validates complete search configuration parameters.
 */
export function validateSearchConfiguration(params) {
  return validateOreSearchInputs(params);
}

export { validateOreSearchInputs };
