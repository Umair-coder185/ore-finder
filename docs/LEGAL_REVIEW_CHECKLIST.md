# OreFinder.io — Legal & Owner Review Checklist (`LEGAL_REVIEW_CHECKLIST.md`)

**Website:** https://orefinder.io/  
**Stage:** Combined Phase 05 + 06

---

## Items Flagged `[OWNER CONFIRMATION REQUIRED]` Across Legal Pages

In compliance with Section 5 (never inventing business details, company registrations, postal addresses, or governing law), the following placeholders are explicitly marked on `/about`, `/contact`, `/privacy-policy`, and `/terms` for owner confirmation before commercial launch:

1. **Operator / Legal Entity Name (`/about`, `/privacy-policy`, `/terms`):**
   - Replace `[OWNER CONFIRMATION REQUIRED]` with the legal entity or individual operator name.
2. **Registered Postal / Correspondence Address (`/about`, `/privacy-policy`):**
   - Insert valid business or correspondence address if required by applicable jurisdiction or Google AdSense account verification.
3. **Active Support & Privacy Mailbox (`/contact`, `/privacy-policy`):**
   - Confirm active mail routing for `editorial@orefinder.io` and configure `CONTACT_WEBHOOK_URL` in production environment variables.
4. **Governing Law & Venue (`/terms`):**
   - Specify the governing state/country law and dispute resolution venue in Section 5 of `/terms`.

