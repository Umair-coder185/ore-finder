# OreFinder.io — Production Security Audit (`SECURITY_AUDIT.md`)

**Website:** https://orefinder.io/  
**Stage:** Combined Phase 05 + 06 — Section 13

---

## 1. Security Hardening Measures Implemented

1. **HTTP Security Headers (`next.config.mjs`):**
   - `poweredByHeader: false` (removes `X-Powered-By: Next.js` fingerprint).
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - `X-DNS-Prefetch-Control: on`
2. **Input Validation & XSS Prevention:**
   - **Ore Finder Engine:** World seeds are parsed strictly via regex `/^[+-]?\d+$/` into bounded 64-bit `BigInt` values or character-code hashed via `javaStringHashCode()`. Zero `eval`, `Function`, or `dangerouslySetInnerHTML` calls are used on user input.
   - **JSON-LD Serialization (`src/components/seo/JsonLd.jsx`):** Uses `JSON.stringify(data)` on trusted server-constructed schema objects.
   - **Contact Endpoint (`src/app/api/contact/route.js` & `src/lib/validation/contactValidation.js`):**
     - Strips `<` and `>` characters (`sanitizeTextField`) to prevent HTML/tag injection.
     - Enforces length bounds on `name` (2–80), `email` (max 120), `subject` (4–120), and `message` (20–2500).
     - Enforces a hidden honeypot field (`companyWebsite`) and per-IP rate limiting (`5 requests / 60s`).
3. **External Link Security:**
   - All external reference links in `ArticleBody.jsx` and `privacy-policy/page.jsx` include `target="_blank"` with `rel="noopener noreferrer"`.
4. **Secrets & Environment Isolation:**
   - Verified zero API keys, tokens, or credentials exist in the repository. `.env.example` documents variable names only.
   - `CONTACT_WEBHOOK_URL` is read exclusively inside the server-only Route Handler (`src/app/api/contact/route.js`) and is never prefixed with `NEXT_PUBLIC_`.

