# OreFinder.io — Safe Production Deployment Guide (`DEPLOYMENT_GUIDE.md`)

**Website:** https://orefinder.io/  
**Stage:** Combined Phase 05 + 06 — Sections 17, 18 & 19

> **Deployment Safety Rule:** No automated deployment has been triggered. Follow these steps only after completing the owner review items in `docs/LAUNCH_CHECKLIST.md`.

---

## 1. Local Production Build & Verification

```bash
# 1. Install dependencies cleanly
npm ci

# 2. Run ESLint and automated test suites (17 suites)
npm run lint
npm test

# 3. Create optimized Next.js production build
npm run build

# 4. Start local production server on port 3000
npm run start
```

---

## 2. Environment Variable Configuration (`.env.example`)

Configure the following environment variables in your hosting provider (e.g., Vercel, Cloudflare Pages, or Docker/Node.js server):

- `NEXT_PUBLIC_SITE_URL="https://orefinder.io"`
- `CONTACT_WEBHOOK_URL=""` *(Set to your verified server-side mail/webhook endpoint once ready)*
- `NEXT_PUBLIC_ENABLE_LIVE_ADS="false"` *(Keep `"false"` until Google AdSense approves the domain and CMP consent is active)*
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID=""` *(Set to `ca-pub-XXXXXXXXXXXXXXXX` only after approval)*

---

## 3. Post-Launch Integrations (Search Console & `ads.txt`)

1. **Google Search Console:**
   - Verify domain ownership of `orefinder.io` via DNS TXT record.
   - Submit `https://orefinder.io/sitemap.xml` in the Sitemaps panel.
2. **`public/ads.txt` (After AdSense Approval Only):**
   - Once Google AdSense provides your official Publisher ID, create `public/ads.txt` containing:
     `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
3. **Rollback Strategy:**
   - Every deployment is stateless (file-based blog + client-side `BigInt` engine). Rolling back to a prior Git tag or immutable build artifact is instantaneous and requires zero database migrations.

