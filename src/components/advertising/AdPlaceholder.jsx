"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils/cn";
import {
  subscribeToConsent,
  getConsentSnapshot,
  getServerConsentSnapshot,
  canLoadAdvertisingScripts,
} from "@/lib/consent/consentManager";

/**
 * CLS-safe, Consent-Gated Advertising Container (Phase 05 + 06 — Section 6 & 7).
 *
 * - Enforces explicit minimum heights (`min-h-[90px]` / `min-h-[250px]`) so CLS <= 0.1.
 * - Physically prevents any third-party ad script from executing unless BOTH:
 *   1. `NEXT_PUBLIC_ENABLE_LIVE_ADS === "true"` and `NEXT_PUBLIC_ADSENSE_CLIENT_ID` are set, AND
 *   2. The user has granted `advertising: true` in `ConsentPreferencesPanel`.
 *
 * @param {Object} props
 * @param {"horizontal" | "in-article" | "sidebar"} [props.format="horizontal"]
 * @param {string} [props.slotId="reserved-slot"]
 * @param {string} [props.className]
 */
export function AdPlaceholder({ format = "horizontal", slotId = "reserved-slot", className }) {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot
  );

  const dimensionConfig = {
    horizontal: {
      minHeight: "min-h-[90px] sm:min-h-[100px]",
      dimensionsLabel: "728×90 / 320×100 Responsive Banner Slot",
    },
    "in-article": {
      minHeight: "min-h-[250px]",
      dimensionsLabel: "Responsive Editorial Display Slot (Min 250px)",
    },
    sidebar: {
      minHeight: "min-h-[250px]",
      dimensionsLabel: "300×250 Companion Slot",
    },
  };

  const current = dimensionConfig[format] || dimensionConfig.horizontal;
  const isLivePermitted = canLoadAdvertisingScripts(consent);

  return (
    <div
      data-ad-slot={slotId}
      data-consent-state={
        isLivePermitted
          ? "consented-and-configured"
          : consent.advertising
            ? "consented-awaiting-publisher-id"
            : "scripts-blocked-by-default"
      }
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#CDD4CA] bg-[#F2F0EA]/70 px-4 py-3 text-center",
        current.minHeight,
        className
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#65716B]">
        Reserved Sponsor Placement &bull; CLS-Protected Container
      </span>
      <span className="mt-1 font-mono text-[11px] text-[#828E88]">
        {current.dimensionsLabel} ({slotId})
      </span>
      <span className="mt-1 font-mono text-[10px] text-[#65716B]">
        {isLivePermitted
          ? "Ready for Authorized Publisher Script"
          : "Live Ad Scripts Disabled (Zero Third-Party Cookies)"}
      </span>
    </div>
  );
}
