import Link from "next/link";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";

export const metadata = constructMetadata({
  title: "Technical & Trademark Disclaimer",
  description:
    "Unofficial Minecraft utility notice, non-affiliation statement, and explanation of differences between exact results, deterministic candidates, and distribution guidance.",
  path: "/disclaimer",
  noIndex: false,
});

export default function DisclaimerPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Disclaimer", href: "/disclaimer" },
  ]);

  return (
    <div className="py-10 sm:py-16">
      <JsonLd data={breadcrumbSchema} />

      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Disclaimer" }]} />

        <header className="mt-6 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Legal &amp; Technical Disclosures
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#202722] sm:text-4xl">
            Technical &amp; Trademark Disclaimer
          </h1>
          <p className="text-base leading-relaxed text-[#65716B]">
            Important disclosures regarding Minecraft trademark independence, result accuracy
            classifications, and world-generation uncertainties.
          </p>
        </header>

        <Card variant="light" padding="lg" className="mt-8 space-y-6">
          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              1. Unofficial Utility Status &amp; Non-Affiliation
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              {siteConfig.disclaimerNote} &ldquo;Minecraft&rdquo; and all associated game names and
              trademarks are property of Mojang Synergies AB and Microsoft Corporation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              2. Differences Between Exact Results, Candidates &amp; Guidance
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              OreFinder.io enforces four distinct epistemological result classifications so users
              never confuse a seed-derived PRNG roll with a guaranteed in-game block:
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#65716B]">
              <li>
                <strong className="text-[#202722]">Verified Exact Result:</strong> Requires direct
                inspection of generated Anvil (<code className="font-mono text-xs">.mca</code>) or
                LevelDB world region files. Seed-only browser searches are never labeled as Verified
                Exact.
              </li>
              <li>
                <strong className="text-[#202722]">
                  Deterministic Candidate (Java Edition 1.18–1.21):
                </strong>{" "}
                A 100% reproducible <code className="font-mono text-xs">Xoroshiro128++</code>{" "}
                feature-placement origin derived from the 64-bit world seed and chunk coordinates.
                Whether an ore block actually spawns in-game at that coordinate also depends on host
                rock replacement (Stone/Deepslate), cave carvers, aquifers, biome feature list
                indices, and{" "}
                <code className="font-mono text-xs">discard_chance_on_air_exposure</code>.
              </li>
              <li>
                <strong className="text-[#202722]">
                  Probability / Distribution Guidance (Java &amp; Bedrock 1.18–1.21):
                </strong>{" "}
                Verified vertical mining elevation curves and batch specifications derived from
                vanilla world-generation data packs, without X/Y/Z block coordinate claims.
              </li>
              <li>
                <strong className="text-[#202722]">
                  Unsupported Configuration (Legacy 1.16–1.17):
                </strong>{" "}
                Explicitly blocked from generating modern 1.18+ Deepslate predictions.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              3. World-Generation Uncertainties &amp; Modified Worlds
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              In-game ore locations will differ from vanilla calculations if a world was created in
              an earlier Minecraft version and upgraded (chunk blending), if custom data packs,
              mods, or server plugins (such as anti-X-ray obfuscation on Paper/Spigot servers) are
              installed, or if players have already mined or modified the terrain.
            </p>
          </section>
        </Card>

        <div className="mt-8">
          <Link
            href="/methodology"
            className="text-sm font-semibold text-[#326B55] hover:underline"
          >
            Read Full Technical Methodology &rarr;
          </Link>
        </div>
      </Container>
    </div>
  );
}
