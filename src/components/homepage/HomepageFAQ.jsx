import { Section } from "@/components/layout/Section";
import { Accordion } from "@/components/ui/Accordion";

export const HOMEPAGE_FAQ_ITEMS = [
  {
    id: "faq-what-is-ore-finder",
    question: "What is Ore Finder?",
    answer:
      "OreFinder.io is a Minecraft world analysis workspace and geological reference platform. It helps players configure world seeds, editions, release versions, and player coordinates to inspect chunk boundaries, Y-level distribution strata, and air-exposure generation rules across the eight primary Overworld ores.",
  },
  {
    id: "faq-planned-editions",
    question: "Which Minecraft editions are planned?",
    answer:
      "The workspace is built to support both Minecraft Java Edition and Minecraft Bedrock Edition across modern Caves & Cliffs Part II+ releases (versions 1.18, 1.19, 1.20, and 1.21). Legacy pre-1.18 releases (such as 1.16–1.17) use a different vertical world height (Y = 0 to 255) and are explicitly flagged as unsupported in the version selector.",
  },
  {
    id: "faq-how-seeds-work",
    question: "How do world seeds work?",
    answer:
      "A Minecraft world seed is a 64-bit signed integer (or a text phrase hashed into an integer) that initializes the game's deterministic pseudo-random number generators. During chunk generation, the seed combines with chunk coordinates and feature salt values to determine terrain noise, biome boundaries, and mineral placement attempts.",
  },
  {
    id: "faq-exact-locations-guaranteed",
    question: "Are exact ore locations guaranteed?",
    answer:
      "No. In Phase 02, the interactive workspace provides configuration validation, exact 16×16 chunk and MCA region coordinate framing, and verified 1.18–1.21 geological stratum specifications, while live seed-to-coordinate calculations remain disabled pending the Phase 03 calculation engine. Even when seed-based calculations are active, in-game ore placement can vary if chunks were generated in older versions, modified by data packs, or intersected by post-generation caves and structures.",
  },
  {
    id: "faq-is-tool-free",
    question: "Is the tool free?",
    answer:
      "Yes. OreFinder.io is free to use in any modern desktop or mobile web browser without requiring account registration, downloads, or game modifications.",
  },
];

/**
 * Accessible FAQ Accordion section on the homepage.
 */
export function HomepageFAQ() {
  return (
    <Section id="faq" variant="default">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Questions &amp; Answers
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#202722] sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#65716B]">
            Factual answers regarding OreFinder.io&apos;s current capabilities, supported Minecraft
            editions, world seed mechanics, and accuracy standards.
          </p>
        </div>

        <div className="lg:col-span-7">
          <Accordion items={HOMEPAGE_FAQ_ITEMS} defaultOpenId="faq-what-is-ore-finder" />
        </div>
      </div>
    </Section>
  );
}
