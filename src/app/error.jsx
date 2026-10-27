"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

/**
 * Route-level Error Boundary for unexpected runtime exceptions.
 * Supports Next.js 16 `retry` and `reset` recovery callbacks.
 */
export default function ErrorBoundaryPage({ error, retry, reset }) {
  useEffect(() => {
    console.error("[OreFinder.io Runtime Boundary]:", error);
  }, [error]);

  function handleRecover() {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    } else {
      window.location.reload();
    }
  }

  return (
    <div className="py-20 sm:py-28">
      <Container size="narrow">
        <div className="rounded-2xl border border-[#E4E8E2] bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#E6D5B3] bg-[#F7F1E3] text-[#9E7329]">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>

          <h1 className="mt-4 font-heading text-2xl font-bold text-[#202722] sm:text-3xl">
            Workspace Segment Encountered an Error
          </h1>

          <p className="mx-auto mt-2.5 max-w-md text-sm sm:text-base leading-relaxed text-[#65716B]">
            An unexpected rendering issue occurred while loading this view. You can retry rendering
            the current segment or return to the homepage.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" onClick={handleRecover}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Try Again</span>
            </Button>

            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#E4E8E2] bg-white px-4 text-sm font-medium text-[#202722] transition-colors hover:bg-[#F8F7F3]"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
