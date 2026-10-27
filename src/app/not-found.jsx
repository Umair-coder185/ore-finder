import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28">
      <Container size="narrow">
        <div className="rounded-2xl border border-[#E4E8E2] bg-white p-8 sm:p-12 text-center shadow-xs">
          <span className="inline-flex rounded-full border border-[#C8DDD0] bg-[#E9F1EC] px-3 py-1 font-mono text-xs font-semibold text-[#326B55]">
            HTTP 404 &bull; Uncharted Chunk
          </span>

          <h1 className="mt-4 font-heading text-2xl font-bold text-[#202722] sm:text-4xl">
            Requested Route Not Found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm sm:text-base leading-relaxed text-[#65716B]">
            The coordinate path or documentation guide you requested does not exist at this address.
            Return to the main Ore Finder workspace or browse our technical guides.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#workspace"
              className="inline-flex items-center gap-2 rounded-md bg-[#326B55] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#275644]"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>Open Ore Finder Workspace</span>
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md border border-[#E4E8E2] bg-[#F8F7F3] px-4 py-2.5 text-sm font-semibold text-[#202722] transition-colors hover:bg-[#F2F0EA]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Browse Field Guides</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
