import Link from "next/link";
import { BookOpen, Compass, Cpu, Layers, ShieldCheck } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";

export const metadata = constructMetadata({
  title: "About OreFinder.io — Mission, Scope & Technical Transparency",
  description:
    "Learn what OreFinder.io provides: a dedicated Minecraft 1.18–1.21 world-generation analysis workspace and technical reference built on verifiable mathematics and transparent accuracy classifications.",
  path: "/about",
  noIndex: false,
});

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ]);

  return (
    <div className="py-10 sm:py-16">
      <JsonLd data={breadcrumbSchema} />

      <Container size="narrow">
        <Breadcrumbs items={[{ label: "About" }]} />

        <header className="mt-6 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Platform Mission &amp; Scope
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#202722] sm:text-4xl">
            About OreFinder.io
          </h1>
          <p className="text-base leading-relaxed text-[#65716B] sm:text-lg">
            OreFinder.io is a specialized web utility and technical reference built to help
            Minecraft players, server administrators, and world builders inspect Overworld ore
            distribution strata and 64-bit seed-based feature placement.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card variant="light" padding="lg" className="space-y-3">
            <Layers className="h-5 w-5 text-[#326B55]" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              1. What OreFinder.io Provides
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              An integrated dark world-analysis workspace directly on the homepage that computes
              16&times;16 chunk coordinates, MCA region files, Java Edition 1.18–1.21 deterministic
              feature-placement candidates, and verified Y-level distribution curves.
            </p>
          </Card>

          <Card variant="light" padding="lg" className="space-y-3">
            <ShieldCheck className="h-5 w-5 text-[#326B55]" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              2. Commitment to Accuracy
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              We never present speculative or unverified coordinates as guaranteed in-game blocks.
              Every result is explicitly labeled as a{" "}
              <strong className="text-[#202722]">Deterministic Candidate</strong> or{" "}
              <strong className="text-[#202722]">Probability / Distribution Guidance</strong>.
            </p>
          </Card>

          <Card variant="light" padding="lg" className="space-y-3">
            <Cpu className="h-5 w-5 text-[#326B55]" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              3. Supported Minecraft Functionality
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              Supports Minecraft Java Edition 1.18–1.21 (64-bit{" "}
              <code className="font-mono text-xs">BigInt</code>{" "}
              <code className="font-mono text-xs">Xoroshiro128++</code> candidate generation +
              distribution curves) and Bedrock Edition 1.18–1.21 (verified Overworld elevation
              curves across all 8 core ores).
            </p>
          </Card>

          <Card variant="light" padding="lg" className="space-y-3">
            <BookOpen className="h-5 w-5 text-[#326B55]" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              4. Editorial &amp; Technical Resources
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              Our editorial guides document vanilla{" "}
              <code className="font-mono text-xs">placed_feature</code> specifications, triangular
              height providers, air-exposure discard mechanics, and branch-mining depth selection
              without filler or fabricated claims.
            </p>
          </Card>
        </div>

        {/* Institutional Attribution & Operator Disclosure */}
        <Card variant="light" padding="lg" className="mt-8 space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#202722]">
            Institutional Attribution &amp; Operator Information
          </h2>
          <p className="text-sm leading-relaxed text-[#65716B]">
            Technical documentation and algorithm verification on OreFinder.io are maintained by the{" "}
            <strong className="text-[#202722]">
              OreFinder Editorial &amp; Technical Documentation Desk
            </strong>
            . In accordance with our editorial integrity policy, we do not publish fictional author
            personas or fabricated credentials.
          </p>
          <div className="rounded-lg border border-[#E4E8E2] bg-[#FAF9F6] p-4 text-xs leading-relaxed text-[#65716B]">
            <strong className="text-[#202722]">Operator &amp; Correspondence Status:</strong> For
            technical feedback or methodology questions, please visit our{" "}
            <Link href="/contact" className="font-semibold text-[#326B55] hover:underline">
              Contact page
            </Link>{" "}
            or review our{" "}
            <Link href="/methodology" className="font-semibold text-[#326B55] hover:underline">
              Technical Methodology
            </Link>
            .{" "}
            <span className="font-mono text-[11px] text-[#828E88]">
              [OWNER CONFIRMATION REQUIRED: Insert legal entity name and registered postal address
              prior to commercial publication if required by local jurisdiction.]
            </span>
          </div>
        </Card>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/#workspace"
            className="inline-flex items-center gap-2 rounded-md bg-[#326B55] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#275644]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>Open Ore Finder Workspace</span>
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 rounded-md border border-[#DCE2DA] bg-white px-4 py-2.5 text-sm font-semibold text-[#202722] transition-colors hover:border-[#326B55]"
          >
            <span>Read Technical Methodology</span>
          </Link>
        </div>
      </Container>
    </div>
  );
}
