import { cn } from "@/lib/utils/cn";

/**
 * Semantic Badge component for version tags, edition labels, and editorial statuses.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {"neutral" | "emerald" | "gold" | "dark-accent" | "dark-neutral" | "draft"} [props.variant="neutral"]
 * @param {string} [props.className]
 */
export function Badge({ children, variant = "neutral", className }) {
  const variantClasses = {
    neutral: "bg-[#F2F0EA] text-[#65716B] border-[#E4E8E2]",
    emerald: "bg-[#E9F1EC] text-[#326B55] border-[#C8DDD0]",
    gold: "bg-[#F7F1E3] text-[#785C26] border-[#E6D5B3]",
    draft: "bg-[#F7F1E3] text-[#785C26] border-[#D5B77D]",
    "dark-accent": "bg-[#69C598]/15 text-[#69C598] border-[#69C598]/35",
    "dark-neutral": "bg-[#25332C] text-[#A8B8AF] border-[#34443B]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-snug",
        variantClasses[variant] || variantClasses.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
