import Link from "next/link";
import { CheckCircle2, Compass, Cpu, Layers, ShieldCheck } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";

export const metadata = constructMetadata({
  title: "Technical Methodology — 64-Bit Seed Math, Xoroshiro128++ & Strata",
  description:
    "Scientific and algorithmic documentation of the OreFinder.io engine: 64-bit BigInt seed conversion, Stafford13 SplitMix64, Xoroshiro128++ decoration seeding, and independent validation.",
  path: "/methodology",
  noIndex: false,
});

export default function MethodologyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Methodology", href: "/methodology" },
  ]);

  return (
    <div className="py-10 sm:py-16">
      <JsonLd data={breadcrumbSchema} />

      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Methodology" }]} />

        <header className="mt-6 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Engineering &amp; Verification Specification (Verified 2026-10-27)
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#202722] sm:text-4xl">
            Technical Methodology &amp; Accuracy Standards
          </h1>
          <p className="text-base leading-relaxed text-[#65716B] sm:text-lg">
            How OreFinder.io implements 64-bit Minecraft seed mathematics, chunk decoration
            pipelines, and vanilla <code className="font-mono text-sm">placed_feature</code>{" "}
            elevation models—and why we strictly distinguish between Deterministic Candidates and
            Distribution Guidance.
          </p>
        </header>

        <div className="mt-10 space-y-8">
          {/* 1. Supported Editions & Versions */}
          <Card variant="light" padding="lg" className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#326B55]">
              <Layers className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-heading text-xl font-bold text-[#202722]">
                1. Supported Editions, Versions &amp; Data Sources
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#65716B] sm:text-base">
              All vertical bounds, attempts per chunk, rarity filters, vein sizes, and{" "}
              <code className="font-mono text-xs">discard_chance_on_air_exposure</code> coefficients
              are sourced from official vanilla Minecraft 1.18–1.21{" "}
              <code className="font-mono text-xs">
                data/minecraft/worldgen/placed_feature/ore_*.json
              </code>{" "}
              and <code className="font-mono text-xs">configured_feature/ore_*.json</code>{" "}
              definitions:
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#65716B]">
              <li>
                <strong className="text-[#202722]">
                  Java Edition 1.20.2 – 1.21 (`java-1.20.2-1.21`):
                </strong>{" "}
                Supports Deterministic Candidate generation and Distribution Guidance (including the
                4th diamond pass <code className="font-mono text-xs">ore_diamond_medium</code>).
              </li>
              <li>
                <strong className="text-[#202722]">
                  Java Edition 1.18 – 1.19 (`java-1.18-1.19`):
                </strong>{" "}
                Supports Deterministic Candidate generation and Distribution Guidance using the
                3-pass Caves &amp; Cliffs Part II diamond ruleset.
              </li>
              <li>
                <strong className="text-[#202722]">
                  Bedrock Edition 1.18 – 1.21 (`bedrock-1.18-1.21`):
                </strong>{" "}
                Supports Verified Distribution Guidance across all 8 Overworld ores. Because Bedrock
                uses C++ <code className="font-mono text-xs">MT19937</code> with platform-specific
                feature ordering rather than Java&apos;s{" "}
                <code className="font-mono text-xs">Xoroshiro128++</code>, candidate X/Z coordinates
                are disabled for Bedrock.
              </li>
            </ul>
          </Card>

          {/* 2. Algorithmic Approach */}
          <Card variant="light" padding="lg" className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#326B55]">
              <Cpu className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-heading text-xl font-bold text-[#202722]">
                2. 64-Bit Seed &amp; Xoroshiro128++ Algorithmic Approach
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#65716B] sm:text-base">
              Standard JavaScript <code className="font-mono text-xs">Number</code> floats only have
              53 bits of integer mantissa and corrupt 64-bit Minecraft seed arithmetic. OreFinder.io
              executes all seed and PRNG math using 64-bit signed two&apos;s-complement{" "}
              <code className="font-mono text-xs">BigInt</code> operations:
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#65716B]">
              <li>
                <strong className="text-[#202722]">Seed Resolution:</strong> Signed 64-bit integer
                strings (<code className="font-mono text-xs">-2^63</code> to{" "}
                <code className="font-mono text-xs">2^63 - 1</code>) are parsed directly as{" "}
                <code className="font-mono text-xs">BigInt</code>. Non-numeric text seeds are hashed
                via OpenJDK <code className="font-mono text-xs">String.hashCode()</code> (
                <code className="font-mono text-xs">h = (Math.imul(31, h) + charCode) | 0</code>
                ).
              </li>
              <li>
                <strong className="text-[#202722]">
                  128-Bit State Upgrade &amp; Stafford13 Mixing:
                </strong>{" "}
                Seeds are upgraded via <code className="font-mono text-xs">SILVER_RATIO_64</code> (
                <code className="font-mono text-xs">0x6A09E667F3BCC909L</code>) and{" "}
                <code className="font-mono text-xs">GOLDEN_RATIO_64</code> (
                <code className="font-mono text-xs">0x9E3779B97F4A7C15L</code>) and mixed with{" "}
                <code className="font-mono text-xs">RandomSupport.mixStafford13</code>.
              </li>
              <li>
                <strong className="text-[#202722]">Chunk Decoration &amp; Feature Seeding:</strong>{" "}
                For chunk <code className="font-mono text-xs">[chunkX, chunkZ]</code> at block
                origin <code className="font-mono text-xs">(chunkX * 16, chunkZ * 16)</code>, the
                decoration seed is derived and offset by{" "}
                <code className="font-mono text-xs">featureIndex + 10000 * step</code> (where{" "}
                <code className="font-mono text-xs">step = 6</code> for{" "}
                <code className="font-mono text-xs">UNDERGROUND_ORES</code>).
              </li>
              <li>
                <strong className="text-[#202722]">InSquare &amp; HeightRange Sampling:</strong>{" "}
                Horizontal offsets (<code className="font-mono text-xs">dx, dz</code> in{" "}
                <code className="font-mono text-xs">0..15</code>) and vertical altitude (
                <code className="font-mono text-xs">TrapezoidHeight</code> or{" "}
                <code className="font-mono text-xs">UniformHeight</code>) are drawn
                deterministically from the feature&apos;s{" "}
                <code className="font-mono text-xs">Xoroshiro128++</code> stream.
              </li>
            </ol>
          </Card>

          {/* 3. Independent Validation & Known Limitations */}
          <Card variant="light" padding="lg" className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#326B55]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-heading text-xl font-bold text-[#202722]">
                3. Independent Validation &amp; Known Limitations
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#65716B] sm:text-base">
              Our automated test suite (
              <code className="font-mono text-xs">tests/ore-engine.test.mjs</code>) verifies our
              implementations against independent reference test vectors, including OpenJDK{" "}
              <code className="font-mono text-xs">String.hashCode()</code> vectors (
              <code className="font-mono text-xs">&quot;abc&quot; &rarr; 96354</code>,{" "}
              <code className="font-mono text-xs">&quot;minecraft&quot; &rarr; 695073197</code>,{" "}
              <code className="font-mono text-xs">&quot;pollinating sandboxes&quot; &rarr; 0</code>
              ), negative floor-division chunk boundaries, and{" "}
              <code className="font-mono text-xs">Stafford13</code> /{" "}
              <code className="font-mono text-xs">Xoroshiro128++</code> state transitions.
            </p>
            <div className="rounded-lg border border-[#E4E8E2] bg-[#FAF9F6] p-4 text-xs leading-relaxed text-[#65716B]">
              <strong className="text-[#202722]">Known Limitation:</strong> A world seed alone does
              not evaluate 3D multi-noise terrain density, cave carvers, aquifers, or local biome
              feature index shifts. Therefore, Java 1.18–1.21 seed coordinates are always classified
              as <strong className="text-[#202722]">Deterministic Candidates</strong> rather than
              Verified Exact block coordinates.
            </div>
          </Card>
        </div>

        <div className="mt-10 flex justify-start">
          <Link
            href="/#workspace"
            className="inline-flex items-center gap-2 rounded-md bg-[#326B55] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#275644]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>Return to Ore Finder Workspace</span>
          </Link>
        </div>
      </Container>
    </div>
  );
}
