"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass } from "lucide-react";
import { primaryNavigation, legalNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Accessible, keyboard-navigable mobile menu without layout shifts.
 */
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-panel"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E4E8E2] bg-white text-[#202722] transition-colors hover:bg-[#F2F0EA] cursor-pointer"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          id="mobile-navigation-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="fixed inset-x-0 top-16 z-50 border-b border-[#E4E8E2] bg-white px-4 pt-4 pb-6 shadow-lg"
        >
          <nav aria-label="Mobile primary navigation" className="space-y-1.5">
            {primaryNavigation.map((item) => {
              const isActive =
                (item.href === "/#workspace" && pathname === "/") ||
                item.href === pathname ||
                (item.href !== "/" &&
                  !item.href.startsWith("/#") &&
                  pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex flex-col rounded-lg px-3.5 py-2.5 transition-colors",
                    isActive ? "bg-[#E9F1EC] text-[#326B55]" : "text-[#202722] hover:bg-[#F8F7F3]"
                  )}
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  {item.description && (
                    <span className="mt-0.5 text-xs text-[#65716B]">{item.description}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 border-t border-[#E4E8E2] pt-4">
            <Link
              href="/#workspace"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#326B55] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#275644]"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>Go to Ore Finder</span>
            </Link>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#65716B]">
              {legalNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#202722]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
