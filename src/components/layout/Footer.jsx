import Link from "next/link";
import { Layers, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { resourceNavigation, companyNavigation, legalNavigation } from "@/config/navigation";
import { Container } from "./Container";

/**
 * Editorial & technical footer with transparent disclaimers and structured links.
 */
export function Footer() {
  return (
    <footer className="border-t border-[#E4E8E2] bg-white text-[#202722]">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#34443B] bg-[#111916] text-[#69C598]">
                <Layers className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-heading text-lg font-bold tracking-tight text-[#202722]">
                OreFinder<span className="text-[#326B55]">.io</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-[#65716B]">
              {siteConfig.description}
            </p>

            <div className="inline-flex items-center gap-2 rounded-md border border-[#E4E8E2] bg-[#F8F7F3] px-3 py-1.5 text-xs text-[#65716B]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#326B55]" aria-hidden="true" />
              <span>Deterministic Verification Policy — No Synthetic Coordinates</span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            <div>
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#202722]">
                Platform &amp; Reference
              </h2>
              <ul className="mt-3.5 space-y-2.5 text-sm">
                {resourceNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#65716B] transition-colors hover:text-[#326B55]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#202722]">
                Documentation
              </h2>
              <ul className="mt-3.5 space-y-2.5 text-sm">
                {companyNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#65716B] transition-colors hover:text-[#326B55]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#202722]">
                Legal &amp; Policy
              </h2>
              <ul className="mt-3.5 space-y-2.5 text-sm">
                {legalNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#65716B] transition-colors hover:text-[#326B55]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Trademark Bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#E4E8E2] pt-6 text-xs text-[#65716B] sm:flex-row sm:items-center">
          <p>
            &copy; {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-[#65716B]">{siteConfig.disclaimerNote}</p>
        </div>
      </Container>
    </footer>
  );
}
