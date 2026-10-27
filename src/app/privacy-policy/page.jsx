import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { ConsentPreferencesPanel } from "@/components/privacy/ConsentPreferencesPanel";

export const metadata = constructMetadata({
  title: "Privacy Policy & Data Processing Disclosures",
  description:
    "Comprehensive privacy policy and data processing disclosures for OreFinder.io, covering local browser seed computation, storage, consent controls, and advertising readiness.",
  path: "/privacy-policy",
  noIndex: false,
});

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ]);

  return (
    <div className="py-10 sm:py-16">
      <JsonLd data={breadcrumbSchema} />

      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        <header className="mt-6 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Privacy &amp; Data Governance
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#202722] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-base leading-relaxed text-[#65716B]">
            Effective Date: October 27, 2026 &bull; Last Updated: October 27, 2026
          </p>
        </header>

        <div className="mt-6">
          <Alert
            variant="info"
            title="Operator & Legal Review Notice ([OWNER CONFIRMATION REQUIRED])"
          >
            This policy accurately reflects the technical data-processing behavior of the
            OreFinder.io codebase. Sections marked{" "}
            <code className="font-mono">[OWNER CONFIRMATION REQUIRED]</code> identify operator
            identity, mailing address, and jurisdiction-specific DPO details that must be confirmed
            by the site owner prior to activating third-party advertising.
          </Alert>
        </div>

        <Card variant="light" padding="lg" className="mt-8 space-y-8">
          <section className="space-y-2.5">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              1. Information Collected &amp; Current Processing Architecture
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              OreFinder.io separates local browser utility execution from server-side page delivery:
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#65716B]">
              <li>
                <strong className="text-[#202722]">
                  World Seeds &amp; Coordinates (Processed Locally):
                </strong>{" "}
                All Minecraft world seeds, X/Y/Z coordinates, chunk radius settings, and ore
                selections entered into the homepage Ore Finder workspace are processed locally
                inside your web browser (via JavaScript{" "}
                <code className="font-mono text-xs">BigInt</code> modules and a client-side Web
                Worker). They are not transmitted to a database or external API.
              </li>
              <li>
                <strong className="text-[#202722]">Standard HTTP Request Logs:</strong> Like all web
                servers, the hosting infrastructure processes standard HTTP request metadata (IP
                address, user-agent string, requested URL path, and timestamp) to deliver pages and
                enforce security rate limits.
              </li>
              <li>
                <strong className="text-[#202722]">Contact Form Submissions:</strong> When you
                submit the form on{" "}
                <Link href="/contact" className="font-semibold text-[#326B55] hover:underline">
                  /contact
                </Link>
                , your Name, Email, Subject, and Message are sent to{" "}
                <code className="font-mono text-xs">POST /api/contact</code> for validation. In the
                current pre-launch build, external mail relay (
                <code className="font-mono text-xs">CONTACT_WEBHOOK_URL</code>) is disabled by
                default; once configured by the site owner, submitted messages are forwarded solely
                to respond to your inquiry.
              </li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              2. Cookies &amp; Local Browser Storage
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              In its default configuration, OreFinder.io sets{" "}
              <strong className="text-[#202722]">zero tracking cookies</strong>. Local browser
              storage (<code className="font-mono text-xs">localStorage</code>) is used only when
              you explicitly save privacy preferences in the Consent Controls below, storing a
              single JSON key (<code className="font-mono text-xs">orefinder_consent_v1</code>)
              containing your boolean choices and timestamp. You can delete this record at any time
              using the <em>&ldquo;Withdraw &amp; Clear Stored Record&rdquo;</em> button.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              3. Planned Advertising &amp; Analytics Technologies
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              OreFinder.io includes structural layout containers prepared for Google AdSense display
              advertising. No live Google AdSense or Google Analytics scripts are active in the
              current build. If live advertising is approved and enabled by the operator in the
              future:
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#65716B]">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on a
                user&apos;s prior visits to this website or other websites.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to
                users based on their visit to this site and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#326B55] hover:underline"
                >
                  Google Ads Settings
                </a>{" "}
                or by revoking advertising consent in the controls below.
              </li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              4. Data Retention &amp; User Privacy Rights (EEA / UK / California)
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              Depending on your jurisdiction (including the GDPR in the EEA/UK and the CCPA/CPRA in
              California), you have the right to request access to, correction of, or deletion of
              personal data, and to withdraw consent for nonessential processing at any time.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              5. Data Controller &amp; Contact Procedures
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              <code className="font-mono text-xs text-[#202722]">
                [OWNER CONFIRMATION REQUIRED: Insert legal controller name, jurisdiction, and
                verified privacy contact email address prior to public launch.]
              </code>
            </p>
          </section>
        </Card>

        {/* Functional Consent Controls */}
        <div className="mt-8">
          <ConsentPreferencesPanel />
        </div>
      </Container>
    </div>
  );
}
