# OreFinder.io — Pre-Launch Owner Checklist (`LAUNCH_CHECKLIST.md`)

**Website:** https://orefinder.io/  
**Stage:** Combined Phase 05 + 06

---

## Mandatory Owner Actions Before Public Launch

- [ ] **1. Legal Entity & Postal Address Confirmation:** Replace `[OWNER CONFIRMATION REQUIRED]` placeholders in `/about`, `/privacy-policy`, and `/terms` with your confirmed operator name, address, and governing law.
- [ ] **2. Contact Webhook Configuration:** Configure `CONTACT_WEBHOOK_URL` in your production environment so `POST /api/contact` forwards validated inquiries to your support inbox (`editorial@orefinder.io`).
- [ ] **3. Domain & TLS Setup:** Point `orefinder.io` (and redirect `www.orefinder.io` $\rightarrow$ `https://orefinder.io`) with HTTPS/TLS enabled.
- [ ] **4. Google Search Console:** Verify ownership of `https://orefinder.io` and submit `https://orefinder.io/sitemap.xml`.
- [ ] **5. Google AdSense Application (Optional, Post-Launch):**
  - Apply for Google AdSense only after steps 1–4 are live.
  - Connect a Google-certified TCF v2.2 CMP for EEA/UK traffic.
  - Add `public/ads.txt` with your real `pub-*` ID and set `NEXT_PUBLIC_ENABLE_LIVE_ADS="true"`.

