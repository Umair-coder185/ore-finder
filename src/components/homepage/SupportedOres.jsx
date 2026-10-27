import {
  Diamond,
  Layers,
  Sparkles,
  Hexagon,
  Flame,
  Box,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getSupportedOres } from "@/features/ore-finder/config/ores";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function getEditorialOreIcon(iconType) {
  switch (iconType) {
    case "gem":
      return Diamond;
    case "crystal":
      return Hexagon;
    case "dust":
      return Flame;
    case "cluster":
      return Sparkles;
    case "ingot":
      return Layers;
    default:
      return Box;
  }
}

/**
 * Clean editorial grid presenting the eight supported ore types
 * and version compatibility guidance.
 */
export function SupportedOres() {
  const ores = getSupportedOres();

  return (
    <Section id="supported-ores" variant="default">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Geological Reference &amp; Version Guidance
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#202722] sm:text-3xl">
            Supported Ores &amp; Elevation Strata
          </h2>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#65716B]">
            Since Minecraft 1.18 (Caves &amp; Cliffs Part II) through 1.21, the eight primary
            Overworld ores follow distinct triangular and uniform vertical distributions between Y =
            -64 and Y = 319.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="emerald">Supported: Java &amp; Bedrock 1.18–1.21</Badge>
          <Badge variant="gold">Legacy 1.16–1.17 Flagged as Unsupported</Badge>
        </div>
      </div>

      {/* Eight Supported Ores Grid */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ores.map((ore) => {
          const IconComponent = getEditorialOreIcon(ore.iconType);
          return (
            <Card
              key={ore.id}
              variant="light"
              padding="md"
              className="flex flex-col justify-between transition-colors hover:border-[#326B55]/50"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E8E2] bg-[#F8F7F3]">
                    <IconComponent
                      className="h-5 w-5"
                      style={{ color: ore.swatchColor }}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="rounded-md bg-[#E9F1EC] px-2.5 py-0.5 font-mono text-xs font-semibold text-[#326B55]">
                    {ore.symbol}
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-base font-bold text-[#202722]">{ore.name}</h3>

                <dl className="mt-3 space-y-1.5 border-t border-[#E4E8E2] pt-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-[#65716B]">Altitude Range:</dt>
                    <dd className="font-mono font-semibold text-[#202722]">{ore.stratumRange}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-[#65716B]">Optimal Peak:</dt>
                    <dd className="font-mono font-semibold text-[#326B55]">
                      {ore.optimalElevation}
                    </dd>
                  </div>
                  <div className="pt-1">
                    <dt className="text-[11px] font-semibold text-[#202722]">
                      Distribution &amp; Exposure:
                    </dt>
                    <dd className="mt-0.5 leading-relaxed text-[#65716B]">{ore.airExposureRule}</dd>
                  </div>
                </dl>
              </div>

              <p className="mt-4 border-t border-[#E4E8E2] pt-3 text-xs leading-relaxed text-[#65716B]">
                {ore.notes}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Version Compatibility Guidance Strip */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl border border-[#C8DDD0] bg-[#E9F1EC]/65 p-4 text-xs sm:text-sm text-[#202722]">
          <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#326B55]" aria-hidden="true" />
          <div>
            <p className="font-heading font-bold">
              Supported Versions: Minecraft 1.18, 1.19, 1.20 &amp; 1.21
            </p>
            <p className="mt-1 text-[#65716B]">
              Uses the expanded -64 to 319 vertical column, Deepslate transition at Y = 0,
              triangular peak distributions, and multi-chunk noise ore veins.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-[#E6D5B3] bg-[#F7F1E3]/80 p-4 text-xs sm:text-sm text-[#202722]">
          <AlertTriangle
            className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#9E7329]"
            aria-hidden="true"
          />
          <div>
            <p className="font-heading font-bold">Legacy Pre-1.18 Worlds (1.16 – 1.17)</p>
            <p className="mt-1 text-[#65716B]">
              Pre-Caves &amp; Cliffs Part II releases use legacy Y = 0 to 255 uniform ore placement
              and are explicitly flagged as unsupported in the version selector.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
