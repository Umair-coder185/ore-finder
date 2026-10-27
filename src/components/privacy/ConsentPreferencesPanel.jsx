"use client";

import { useState, useSyncExternalStore } from "react";
import { ShieldCheck, RotateCcw, Check } from "lucide-react";
import {
  subscribeToConsent,
  getConsentSnapshot,
  getServerConsentSnapshot,
  saveConsentChoices,
  withdrawConsent,
} from "@/lib/consent/consentManager";
import { Button } from "@/components/ui/Button";

/**
 * Interactive Privacy & Consent Preferences Control Panel (Section 6).
 *
 * Allows users to inspect what browser storage is used, opt into or out of
 * future analytics/advertising categories, or completely clear stored consent records.
 */
export function ConsentPreferencesPanel() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );
  const [statusMessage, setStatusMessage] = useState("");

  function handleSave(nextChoices) {
    saveConsentChoices(nextChoices);
    setStatusMessage("Privacy preferences saved to local browser storage.");
    setTimeout(() => setStatusMessage(""), 3500);
  }

  function handleWithdraw() {
    withdrawConsent();
    setStatusMessage("Optional consent withdrawn and local storage preference record removed.");
    setTimeout(() => setStatusMessage(""), 3500);
  }

  return (
    <div
      id="consent-preferences"
      className="rounded-2xl border border-[#DCE2DA] bg-white p-6 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E8E2] pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#326B55]" aria-hidden="true" />
          <h2 className="font-heading text-lg font-bold text-[#202722]">
            Interactive Privacy &amp; Consent Controls
          </h2>
        </div>

        <span className="rounded-full border border-[#C8DDD0] bg-[#E9F1EC] px-3 py-1 font-mono text-[11px] font-semibold text-[#265341]">
          {consent.decided ? "Custom Preferences Stored" : "Default: All Optional Off"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[#65716B]">
        OreFinder.io does not activate nonessential analytics or advertising scripts by default. Use
        the controls below to manage your preferences or clear any saved consent state from your
        browser&apos;s <code className="font-mono text-xs text-[#202722]">localStorage</code>.
      </p>

      <div className="mt-5 space-y-3">
        {/* 1. Essential */}
        <div className="flex items-start justify-between gap-4 rounded-xl border border-[#E4E8E2] bg-[#FAF9F6] p-4">
          <div>
            <h3 className="font-heading text-sm font-bold text-[#202722]">
              Strictly Necessary &amp; Local Tool Execution
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#65716B]">
              Required for local Web Worker seed calculations, X/Z coordinate map rendering, and
              security headers. Sets zero third-party tracking cookies.
            </p>
          </div>
          <span className="shrink-0 rounded bg-[#E9F1EC] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#265341]">
            Always Active
          </span>
        </div>

        {/* 2. Analytics */}
        <div className="flex items-start justify-between gap-4 rounded-xl border border-[#E4E8E2] bg-[#FAF9F6] p-4">
          <div>
            <label
              htmlFor="consent-toggle-analytics"
              className="font-heading text-sm font-bold text-[#202722] cursor-pointer"
            >
              Optional Performance &amp; Usage Analytics (Inactive in Current Build)
            </label>
            <p className="mt-1 text-xs leading-relaxed text-[#65716B]">
              Controls whether future aggregated analytics scripts may run once configured by the
              site operator.
            </p>
          </div>
          <input
            id="consent-toggle-analytics"
            type="checkbox"
            checked={consent.analytics}
            onChange={(e) =>
              handleSave({
                analytics: e.target.checked,
                advertising: consent.advertising,
              })
            }
            className="mt-1 h-4 w-4 accent-[#326B55] cursor-pointer"
          />
        </div>

        {/* 3. Advertising */}
        <div className="flex items-start justify-between gap-4 rounded-xl border border-[#E4E8E2] bg-[#FAF9F6] p-4">
          <div>
            <label
              htmlFor="consent-toggle-advertising"
              className="font-heading text-sm font-bold text-[#202722] cursor-pointer"
            >
              Optional Display Advertising (Google AdSense Readiness)
            </label>
            <p className="mt-1 text-xs leading-relaxed text-[#65716B]">
              Controls whether editorial display ad slots may load third-party ad scripts once live
              advertising is approved and enabled.
            </p>
          </div>
          <input
            id="consent-toggle-advertising"
            type="checkbox"
            checked={consent.advertising}
            onChange={(e) =>
              handleSave({
                analytics: consent.analytics,
                advertising: e.target.checked,
              })
            }
            className="mt-1 h-4 w-4 accent-[#326B55] cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E8E2] pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSave({ analytics: false, advertising: false })}
          >
            <span>Reject Optional Categories</span>
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={handleWithdraw}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Withdraw &amp; Clear Stored Record</span>
          </Button>
        </div>

        {consent.updatedAt && (
          <span className="font-mono text-[11px] text-[#65716B]">
            Last updated: {consent.updatedAt.slice(0, 10)}
          </span>
        )}
      </div>

      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#E9F1EC] px-3 py-1.5 text-xs font-semibold text-[#265341]"
        >
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
