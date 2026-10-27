import { AdPlaceholder } from "@/components/advertising/AdPlaceholder";
import { cn } from "@/lib/utils/cn";

/**
 * AdSense-Ready Editorial Placement Component (Section 12 & Section 15).
 *
 * Enforces:
 * - Clear visual separation from editorial paragraphs and interactive controls
 * - Explicit "Advertisement" disclosure label
 * - Reserved minimum height (`CLS <= 0.1`)
 * - Zero deceptive buttons or navigation-like elements
 * - No live ad scripts activated without approval
 *
 * @param {Object} props
 * @param {"horizontal" | "in-article" | "sidebar"} [props.format="in-article"]
 * @param {string} [props.slotId="blog-editorial-slot"]
 * @param {string} [props.className]
 */
export function ArticleAdPlacement({
  format = "in-article",
  slotId = "blog-editorial-slot",
  className,
}) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn("my-8 rounded-xl border border-[#DCE2DA] bg-[#F8F7F3] p-4", className)}
    >
      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-[#65716B]">
        <span>Advertisement</span>
        <span>Editorial Display Region</span>
      </div>
      <AdPlaceholder format={format} slotId={slotId} />
    </aside>
  );
}
