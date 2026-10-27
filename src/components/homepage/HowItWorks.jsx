import Link from "next/link";
import { ArrowUpRight, Compass, SlidersHorizontal, Layers } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";

const STEPS = [
  {
    step: "01",
    title: "Configure Minecraft world settings",
    description:
      "Enter your 64-bit numeric or text world seed, select Java Edition or Bedrock Edition, choose a supported 1.18–1.21 release version, and input your player X, Y, Z coordinates.",
    Icon: SlidersHorizontal,
  },
  {
    step: "02",
    title: "Select the ore and search preferences",
    description:
      "Choose from the eight supported Overworld ores, set a preset or custom chunk search radius (1 to 32 chunks), and refine air-exposure and elevation preferences.",
    Icon: Layers,
  },
  {
    step: "03",
    title: "Review supported analysis results when available",
    description:
      "Inspect exact chunk and region boundaries alongside verified Y-level distribution rules today, with seed-calculated ore coordinates unlocking once the Phase 03 calculation engine is connected.",
    Icon: Compass,
  },
];

/**
 * Minimal three-step explanation of the OreFinder.io workflow.
 */
export function HowItWorks() {
  return (
    <Section id="how-it-works" variant="surface" bordered>
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Workflow Overview
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#202722] sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#65716B]">
            A structured three-step workflow designed for clarity, accurate coordinate framing, and
            transparent world-generation analysis.
          </p>
        </div>

        <Link
          href="/methodology"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#326B55] hover:underline"
        >
          <span>Read Technical Methodology</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map(({ step, title, description, Icon }) => (
          <Card key={step} variant="subtle" padding="md" className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#326B55]">STEP {step}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E8E2] bg-white text-[#326B55]">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
              </div>

              <h3 className="mt-4 font-heading text-lg font-bold text-[#202722]">{title}</h3>

              <p className="mt-2 text-sm leading-relaxed text-[#65716B]">{description}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
