import { constructMetadata } from "@/lib/seo/metadata";
import { generateWebsiteSchema, generateFaqSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/homepage/Hero";
import { OreFinderWorkspace } from "@/components/ore-finder/OreFinderWorkspace";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { SupportedOres } from "@/components/homepage/SupportedOres";
import { FeaturedGuides } from "@/components/homepage/FeaturedGuides";
import { HomepageFAQ, HOMEPAGE_FAQ_ITEMS } from "@/components/homepage/HomepageFAQ";
import { AdPlacement } from "@/components/advertising/AdPlacement";

export const metadata = constructMetadata({
  title: "Find Minecraft Ores. Explore Smarter.",
  description:
    "Explore ore locations and generation insights with a powerful Minecraft world analysis workspace for Java and Bedrock 1.18–1.21.",
  path: "/",
});

/**
 * OreFinder.io Homepage (Phase 02)
 *
 * Section Sequence:
 * 1. Header (via RootLayout)
 * 2. Hero ("Find Minecraft Ores. Explore Smarter.")
 * 3. Main dark Ore Finder workspace + Results and visualization workspace
 * 4. How It Works
 * 5. Supported ores and version guidance
 * 6. Featured guides
 * 7. FAQ
 * 8. Footer (via RootLayout)
 */
export default function HomePage() {
  const websiteSchema = generateWebsiteSchema();
  const faqSchema = generateFaqSchema(HOMEPAGE_FAQ_ITEMS);

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero + Integrated Dark Ore Finder & Results Workspace */}
      <div className="pb-16 sm:pb-20">
        <Container>
          <Hero />
          <OreFinderWorkspace />
        </Container>
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Isolated, CLS-safe AdSense-conscious placement separated from tool controls */}
      <AdPlacement format="horizontal" slotId="homepage-editorial-divider-01" />

      {/* Supported Ores & Version Guidance */}
      <SupportedOres />

      {/* Featured Guides */}
      <FeaturedGuides />

      {/* Frequently Asked Questions */}
      <HomepageFAQ />
    </>
  );
}
