import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  DEFAULT_CONSENT_STATE,
  canLoadAdvertisingScripts,
} from "../src/lib/consent/consentManager.js";

import {
  validateContactSubmission,
  sanitizeTextField,
} from "../src/lib/validation/contactValidation.js";

import { executeOreAnalysisSearch } from "../src/features/ore-finder/engine/search/searchOrchestrator.js";
import { validateOreSearchInputs } from "../src/features/ore-finder/validation/validateInputs.js";
import {
  queryPublishedArticles,
  getPublishedArticleBySlug,
  getRelatedPublishedArticles,
} from "../src/lib/blog.js";
import sitemap from "../src/app/sitemap.js";
import robots from "../src/app/robots.js";

// ============================================================================
// 1. END-TO-END USER JOURNEYS A, B, C & F (Section 16)
// ============================================================================

test("Journey A (New Visitor): configure search, read classifications, and navigate to related guide", () => {
  const searchResponse = executeOreAnalysisSearch({
    edition: "java",
    version: "java-1.21",
    seed: "-4172144997902289642",
    x: 128,
    y: -54,
    z: -256,
    radiusChunks: 8,
    selectedOres: ["diamond", "iron"],
    advanced: {
      sortPreference: "distance-3d",
      elevationFocus: "optimal-peak",
      airExposureMode: "all",
    },
  });

  assert.equal(searchResponse.ok, true);
  assert.equal(searchResponse.classification, "deterministic-candidate");
  assert.ok(searchResponse.candidateResults.length > 0);
  assert.equal(searchResponse.distributionProfiles.length, 2);

  // Follow guide link for diamond air exposure
  const guide = getPublishedArticleBySlug(
    "deepslate-diamond-air-exposure-mechanics"
  );
  assert.ok(guide);
  assert.ok(guide.sections.length >= 3);
  assert.equal(
    guide.sections[2].contextualToolLink.href,
    "/#workspace"
  );
});

test("Journey B & F (Invalid Inputs & Failure Handling): malformed seeds, out-of-bounds coordinates, unsupported version, cancellation", () => {
  // 1. Empty seed & invalid coordinates
  const invalidValidation = validateOreSearchInputs({
    edition: "java",
    version: "java-1.21",
    seed: "   ",
    x: "99999999",
    y: "-999",
    z: "abc",
    radiusChunks: 99,
    selectedOres: [],
  });
  assert.equal(invalidValidation.isValid, false);
  assert.ok(invalidValidation.issues.length >= 4);

  // 2. Unsupported legacy version (1.16–1.17)
  const unsupportedSearch = executeOreAnalysisSearch({
    edition: "java",
    version: "java-1.17-legacy",
    seed: "12345",
    x: 0,
    y: 12,
    z: 0,
    radiusChunks: 4,
    selectedOres: ["diamond"],
  });
  assert.equal(unsupportedSearch.ok, false);
  assert.equal(unsupportedSearch.status, "unsupported");
  assert.equal(unsupportedSearch.classification, "unsupported");
  assert.equal(unsupportedSearch.candidateResults.length, 0);

  // 3. Worker cooperative cancellation
  const cancelledSearch = executeOreAnalysisSearch(
    {
      edition: "java",
      version: "java-1.21",
      seed: "12345",
      x: 0,
      y: -54,
      z: 0,
      radiusChunks: 8,
      selectedOres: ["diamond"],
    },
    { shouldAbort: () => true }
  );
  assert.equal(cancelledSearch.ok, false);
  assert.equal(cancelledSearch.aborted, true);
  assert.equal(cancelledSearch.status, "cancelled");
});

test("Journey C (Blog Reader): category selection, search, TOC, and internal links", () => {
  const miningCategory = queryPublishedArticles({
    category: "mining-strategies",
  });
  assert.equal(miningCategory.totalItems, 1);

  const article = getPublishedArticleBySlug(miningCategory.items[0].slug);
  assert.ok(article);
  assert.ok(article.sections.every((s) => s.id && s.heading));

  const related = getRelatedPublishedArticles(article);
  assert.ok(related.length >= 1);
});

// ============================================================================
// 2. PRIVACY, CONSENT, CONTACT SECURITY & ROBOTS/SITEMAP TESTS (Section 5, 6, 10, 13)
// ============================================================================

test("Journey E (Privacy, Consent & Contact Security): consent gating, contact validation, honeypot spam, and HTML sanitization", () => {
  // Default consent has analytics & advertising disabled
  assert.equal(DEFAULT_CONSENT_STATE.essential, true);
  assert.equal(DEFAULT_CONSENT_STATE.analytics, false);
  assert.equal(DEFAULT_CONSENT_STATE.advertising, false);

  // Even if a user consents to advertising, live scripts stay blocked when NEXT_PUBLIC_ENABLE_LIVE_ADS is false
  assert.equal(
    canLoadAdvertisingScripts({
      ...DEFAULT_CONSENT_STATE,
      advertising: true,
    }),
    false
  );

  // HTML tag sanitization prevents XSS/HTML injection in contact fields
  assert.equal(
    sanitizeTextField("<script>alert(1)</script>Hello"),
    "scriptalert(1)/scriptHello"
  );

  // Anti-spam honeypot rejects bots
  const spamAttempt = validateContactSubmission({
    name: "Bot",
    email: "bot@example.com",
    subject: "Spam",
    message: "This is an automated spam message over twenty chars.",
    companyWebsite: "https://spam.example.com",
  });
  assert.equal(spamAttempt.isValid, false);
  assert.equal(spamAttempt.isSpam, true);

  // Invalid contact submission returns field-level errors
  const shortSubmission = validateContactSubmission({
    name: "A",
    email: "invalid-email",
    subject: "Hi",
    message: "Too short",
  });
  assert.equal(shortSubmission.isValid, false);
  assert.ok(shortSubmission.errors.name);
  assert.ok(shortSubmission.errors.email);
  assert.ok(shortSubmission.errors.subject);
  assert.ok(shortSubmission.errors.message);

  // Valid contact submission passes
  const validSubmission = validateContactSubmission({
    name: "Alex Miner",
    email: "alex@example.com",
    subject: "Java 1.21 Diamond Medium Batch Question",
    message:
      "Confirming that ore_diamond_medium spans Y = -64 to -4 uniformly in Java 1.21.",
    companyWebsite: "",
  });
  assert.equal(validSubmission.isValid, true);
  assert.equal(validSubmission.isSpam, false);
  assert.equal(validSubmission.sanitized.email, "alex@example.com");
});

test("Production Readiness: robots.txt, sitemap.xml, and .env.example verification", () => {
  const robotsConfig = robots();
  assert.equal(robotsConfig.sitemap, "https://orefinder.io/sitemap.xml");
  assert.ok(robotsConfig.rules[0].disallow.includes("/api/"));

  const sitemapRoutes = sitemap().map((entry) => entry.url);
  const expectedPublicPages = [
    "https://orefinder.io/",
    "https://orefinder.io/blog",
    "https://orefinder.io/methodology",
    "https://orefinder.io/about",
    "https://orefinder.io/disclaimer",
    "https://orefinder.io/contact",
    "https://orefinder.io/privacy-policy",
    "https://orefinder.io/terms",
  ];

  for (const url of expectedPublicPages) {
    assert.ok(sitemapRoutes.includes(url), `Missing ${url} in sitemap.xml`);
  }

  // Verify .env.example exists and contains no private secrets
  const envExamplePath = path.join(process.cwd(), ".env.example");
  assert.equal(fs.existsSync(envExamplePath), true);
  const envExampleContent = fs.readFileSync(envExamplePath, "utf8");
  assert.ok(envExampleContent.includes("NEXT_PUBLIC_SITE_URL"));
  assert.ok(envExampleContent.includes("CONTACT_WEBHOOK_URL=\"\""));
});

