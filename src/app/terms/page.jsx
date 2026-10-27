import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";

export const metadata = constructMetadata({
  title: "Terms and Conditions of Use",
  description:
    "Website terms and conditions for OreFinder.io, covering permitted use, tool accuracy classifications, intellectual property, and service disclaimers.",
  path: "/terms",
  noIndex: false,
});

export default function TermsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Terms & Conditions", href: "/terms" },
  ]);

  return (
    <div className="py-10 sm:py-16">
      <JsonLd data={breadcrumbSchema} />

      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Terms & Conditions" }]} />

        <header className="mt-6 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Terms of Service
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#202722] sm:text-4xl">
            Terms and Conditions
          </h1>
          <p className="text-base leading-relaxed text-[#65716B]">
            Effective Date: October 27, 2026 &bull; Last Updated: October 27, 2026
          </p>
        </header>

        <div className="mt-6">
          <Alert variant="info" title="Legal Review Notice ([OWNER CONFIRMATION REQUIRED])">
            These terms govern the use of the OreFinder.io web application and technical guides.
            Jurisdiction-specific governing law and operator entity details marked{" "}
            <code className="font-mono">[OWNER CONFIRMATION REQUIRED]</code> must be confirmed by
            the site owner prior to commercial launch.
          </Alert>
        </div>

        <Card variant="light" padding="lg" className="mt-8 space-y-6">
          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              1. Permitted Website Use
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              You may access and use the OreFinder.io workspace and editorial guides for personal,
              educational, and non-commercial Minecraft gameplay analysis. You agree not to attempt
              to disrupt server endpoints, bypass rate limits, or redistribute our original
              technical articles and SVG diagrams as your own commercial product.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              2. Tool Scope &amp; Accuracy Limitations
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              OreFinder.io is a mathematical analysis and reference tool. As documented in our{" "}
              <Link href="/methodology" className="font-semibold text-[#326B55] hover:underline">
                Technical Methodology
              </Link>{" "}
              and{" "}
              <Link href="/disclaimer" className="font-semibold text-[#326B55] hover:underline">
                Disclaimer
              </Link>
              , seed-only calculations for Java Edition 1.18–1.21 produce{" "}
              <strong className="text-[#202722]">Deterministic Candidates</strong> whose in-game
              realization depends on terrain replacement, cave carving, aquifers, biome feature
              ordering, and air-exposure discard checks. Bedrock Edition 1.18–1.21 provides{" "}
              <strong className="text-[#202722]">Probability / Distribution Guidance</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              3. Third-Party Intellectual Property
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              OreFinder.io is an independent utility and is not an official Minecraft product, nor
              is it approved by or associated with Mojang Studios or Microsoft Corporation.
              &ldquo;Minecraft&rdquo; is a trademark of Mojang Synergies AB.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              4. Availability of Services &amp; No Warranty
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              The website and calculation workspace are provided on an &ldquo;as-is&rdquo; and
              &ldquo;as-available&rdquo; basis without warranties of any kind, whether express or
              implied. We do not guarantee uninterrupted availability or error-free alignment with
              future Minecraft game updates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              5. Governing Law &amp; Operator Contact
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              <code className="font-mono text-xs text-[#202722]">
                [OWNER CONFIRMATION REQUIRED: Specify governing law, venue, and legal operator
                entity prior to commercial publication.]
              </code>{" "}
              For questions regarding these Terms, please visit our{" "}
              <Link href="/contact" className="font-semibold text-[#326B55] hover:underline">
                Contact page
              </Link>
              .
            </p>
          </section>
        </Card>
      </Container>
    </div>
  );
}
