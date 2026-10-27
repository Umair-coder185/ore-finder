import { Mail, MessageSquare } from "lucide-react";
import { constructMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = constructMetadata({
  title: "Contact & Technical Feedback",
  description:
    "Contact the OreFinder.io team regarding Minecraft world-generation data accuracy, version compatibility, or editorial feedback.",
  path: "/contact",
  noIndex: false,
});

export default function ContactPage() {
  const isDeliveryConfigured = Boolean(process.env.CONTACT_WEBHOOK_URL);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ]);

  return (
    <div className="py-10 sm:py-16">
      <JsonLd data={breadcrumbSchema} />

      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Contact" }]} />

        <header className="mt-6 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#326B55]">
            Support &amp; Technical Correspondence
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#202722] sm:text-4xl">
            Contact &amp; Technical Feedback
          </h1>
          <p className="text-base leading-relaxed text-[#65716B] sm:text-lg">
            Report version-specific ore stratum questions, suggest documentation improvements, or
            submit privacy and editorial inquiries.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card variant="light" padding="lg" className="space-y-3">
            <Mail className="h-5 w-5 text-[#326B55]" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              Direct Correspondence Status
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              For editorial corrections, privacy requests, or general inquiries:
            </p>
            <p className="rounded border border-[#E4E8E2] bg-[#FAF9F6] px-3 py-2 font-mono text-xs text-[#202722]">
              [OWNER CONFIRMATION REQUIRED: Confirm active mailbox for editorial@orefinder.io and
              configure CONTACT_WEBHOOK_URL before enabling live mail delivery.]
            </p>
          </Card>

          <Card variant="light" padding="lg" className="space-y-3">
            <MessageSquare className="h-5 w-5 text-[#326B55]" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-[#202722]">
              Seed &amp; Accuracy Reports
            </h2>
            <p className="text-sm leading-relaxed text-[#65716B]">
              When reporting a seed calculation or stratum question, please include your Minecraft
              Edition (Java or Bedrock), release version (e.g., 1.21), 64-bit seed, and target X/Y/Z
              coordinates.
            </p>
          </Card>
        </div>

        {/* Accessible Contact Form with Real Client + Server Validation */}
        <div className="mt-8">
          <ContactForm isDeliveryConfigured={isDeliveryConfigured} />
        </div>
      </Container>
    </div>
  );
}
