/**
 * Privacy & Consent Engineering Module (Phase 05 + 06 — Section 6)
 *
 * Truthfully manages user consent state for optional analytics and advertising technologies.
 *
 * Architectural Facts:
 * 1. By default, OreFinder.io sets ZERO tracking cookies and loads ZERO third-party
 *    analytics or advertising scripts.
 * 2. The Ore Finder calculation engine (`seedEngine.js`, `candidateGenerator.js`,
 *    `distributionEngine.js`) executes 100% locally in the user's browser (Main Thread / Web Worker).
 * 3. Consent preferences are persisted in `localStorage` under `orefinder_consent_v1`
 *    ONLY when a user explicitly saves or withdraws preferences.
 * 4. Optional third-party integrations (Google AdSense / Analytics) remain gated behind BOTH:
 *    - Explicit environment configuration (`NEXT_PUBLIC_ENABLE_LIVE_ADS === "true"`)
 *    - Explicit user consent (`advertising === true` or `analytics === true`).
 */

export const CONSENT_STORAGE_KEY = "orefinder_consent_v1";

export const DEFAULT_CONSENT_STATE = {
  version: "1.0",
  decided: false,
  updatedAt: null,
  essential: true, // Required for core UI functionality & security
  analytics: false, // Default off until explicit opt-in
  advertising: false, // Default off until explicit opt-in
};

/**
 * Reads the stored consent record from `localStorage` if available.
 * Safe to call in SSR / Node.js environments (returns `DEFAULT_CONSENT_STATE`).
 */
export function getStoredConsent() {
  if (typeof window === "undefined" || !window.localStorage) {
    return { ...DEFAULT_CONSENT_STATE };
  }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_CONSENT_STATE };
    }
    const parsed = JSON.parse(raw);
    return {
      version: "1.0",
      decided: Boolean(parsed.decided),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
      essential: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
    };
  } catch {
    return { ...DEFAULT_CONSENT_STATE };
  }
}

/**
 * Saves an explicit user consent choice to `localStorage` and dispatches
 * a custom `"orefinder:consent-updated"` event so gated components react immediately.
 *
 * @param {{ analytics?: boolean, advertising?: boolean }} choices
 */
export function saveConsentChoices(choices = {}) {
  const record = {
    version: "1.0",
    decided: true,
    updatedAt: new Date().toISOString(),
    essential: true,
    analytics: Boolean(choices.analytics),
    advertising: Boolean(choices.advertising),
  };

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
      window.dispatchEvent(new CustomEvent("orefinder:consent-updated", { detail: record }));
    } catch {
      // Ignore storage quota errors in restricted browsing modes
    }
  }

  return record;
}

/**
 * Withdraws all optional consent and deletes the stored record from `localStorage`.
 */
export function withdrawConsent() {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      window.dispatchEvent(
        new CustomEvent("orefinder:consent-updated", {
          detail: { ...DEFAULT_CONSENT_STATE },
        })
      );
    } catch {
      // Ignore storage errors
    }
  }
  return { ...DEFAULT_CONSENT_STATE };
}

/**
 * Determines whether live advertising scripts are permitted to execute.
 * Requires BOTH owner environment activation AND explicit user advertising consent.
 *
 * @param {Object} consentState
 */
export function canLoadAdvertisingScripts(consentState = DEFAULT_CONSENT_STATE) {
  const isOwnerEnabled =
    typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_ENABLE_LIVE_ADS === "true" &&
    Boolean(process.env?.NEXT_PUBLIC_ADSENSE_CLIENT_ID);

  return Boolean(isOwnerEnabled && consentState?.advertising === true);
}

let cachedRawConsent = null;
let cachedConsentObject = DEFAULT_CONSENT_STATE;

/**
 * Referentially stable snapshot reader for React `useSyncExternalStore`.
 */
export function getConsentSnapshot() {
  if (typeof window === "undefined" || !window.localStorage) {
    return DEFAULT_CONSENT_STATE;
  }
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      cachedRawConsent = null;
      cachedConsentObject = DEFAULT_CONSENT_STATE;
      return DEFAULT_CONSENT_STATE;
    }
    if (raw === cachedRawConsent) {
      return cachedConsentObject;
    }
    cachedRawConsent = raw;
    cachedConsentObject = getStoredConsent();
    return cachedConsentObject;
  } catch {
    return DEFAULT_CONSENT_STATE;
  }
}

/**
 * Server snapshot for React `useSyncExternalStore` (prevents SSR/client hydration mismatch).
 */
export function getServerConsentSnapshot() {
  return DEFAULT_CONSENT_STATE;
}

/**
 * Subscription helper for React `useSyncExternalStore`.
 * @param {function(): void} callback
 */
export function subscribeToConsent(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("orefinder:consent-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("orefinder:consent-updated", callback);
    window.removeEventListener("storage", callback);
  };
}
