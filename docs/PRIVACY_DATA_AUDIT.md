# OreFinder.io — Privacy & Data Processing Audit (`PRIVACY_DATA_AUDIT.md`)

**Website:** https://orefinder.io/  
**Stage:** Combined Phase 05 + 06 — Section 6 Audit

---

## 1. Six-Point Data Processing Determination

1. **What data is collected?**
   - **Ore Finder Workspace:** World seeds, X/Y/Z coordinates, chunk radius, and target ore selections are processed **100% locally in the user's browser** (`useOreSearch.js` / `oreSearchWorker.js`). They are never transmitted to any server or database.
   - **Contact Form (`/contact` $\rightarrow$ `POST /api/contact`):** Collects `name`, `email`, `subject`, and `message` when voluntarily submitted by a user.
   - **HTTP Server Logs:** Standard web server access metadata (IP address, request path, user-agent) used for page delivery and in-memory `/api/contact` rate limiting (`5 requests / 60s`).
2. **Which services receive data?**
   - In the default pre-launch configuration (`CONTACT_WEBHOOK_URL=""`, `NEXT_PUBLIC_ENABLE_LIVE_ADS="false"`, `NEXT_PUBLIC_ENABLE_ANALYTICS="false"`), **zero external third-party services receive user data**.
3. **What browser storage is used?**
   - `localStorage` key `orefinder_consent_v1` is written **only** when the user explicitly interacts with `ConsentPreferencesPanel` on `/privacy-policy`. Calling `withdrawConsent()` deletes the key immediately.
4. **Are cookies set?**
   - **Zero tracking, analytics, or advertising cookies** are set by the application.
5. **Which third parties are involved?**
   - Google Fonts (`Manrope`, `Inter`, `JetBrains Mono`) are self-hosted at build time by `next/font/google`, meaning browser clients make zero runtime font requests to `fonts.googleapis.com`.
6. **Which consent requirements apply?**
   - Before activating live Google AdSense (`NEXT_PUBLIC_ENABLE_LIVE_ADS="true"`) for EEA/UK/Swiss traffic, a Google-certified TCF v2.2 CMP must be connected alongside `src/lib/consent/consentManager.js`.

