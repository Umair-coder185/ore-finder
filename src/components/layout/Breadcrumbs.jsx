import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Accessible breadcrumb navigation trail.
 *
 * @param {Object} props
 * @param {Array<{ label: string, href?: string }>} props.items
 * @param {string} [props.className]
 */
export function Breadcrumbs({ items = [], className }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs sm:text-sm text-[#65716B]", className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-[#65716B] transition-colors hover:text-[#202722]"
          >
            <Home className="h-3.5 w-3.5 shrink-0 text-[#326B55]" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.label} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#828E88]" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  aria-current="page"
                  className="font-medium text-[#202722] line-clamp-1 max-w-[260px] sm:max-w-md"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded px-1 py-0.5 text-[#65716B] transition-colors hover:text-[#202722]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
