import Link from "next/link";
import { Container } from "./Container";
import { Navigation } from "./Navigation";
import { MobileNavigation } from "./MobileNavigation";

/**
 * Refined, minimalist header with custom OreFinder geometric wordmark
 * and understated navigation (Ore Finder, Blog, About).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-[#E4E8E2] bg-[#F8F7F3]/95 backdrop-blur-sm">
      <Container className="flex h-full items-center justify-between gap-4">
        {/* Custom OreFinder Wordmark */}
        <Link
          href="/"
          aria-label="OreFinder.io Home"
          className="group inline-flex items-center gap-2.5 text-[#202722] focus-visible:rounded-md"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#34443B] bg-[#111916] shadow-xs transition-colors group-hover:border-[#69C598]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 text-[#69C598]"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </span>
          <span className="font-heading text-lg font-extrabold tracking-tight text-[#202722]">
            OreFinder<span className="text-[#326B55]">.io</span>
          </span>
        </Link>

        {/* Understated Desktop Navigation + Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          <Navigation />
          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}
