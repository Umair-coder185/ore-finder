"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Refined, understated desktop navigation bar.
 */
export function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="hidden md:flex md:items-center md:gap-1.5">
      {primaryNavigation.map((item) => {
        const isActive =
          (item.href === "/#workspace" && pathname === "/") ||
          item.href === pathname ||
          (item.href !== "/" && !item.href.startsWith("/#") && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#E9F1EC] text-[#326B55] font-semibold"
                : "text-[#65716B] hover:bg-[#F2F0EA]/80 hover:text-[#202722]"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
