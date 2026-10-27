import { cn } from "@/lib/utils/cn";

/**
 * Structural Skeleton placeholder for asynchronous or reserved layout slots.
 *
 * @param {Object} props
 * @param {"light" | "dark"} [props.tone="light"]
 * @param {string} [props.className]
 */
export function Skeleton({ tone = "light", className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md",
        tone === "dark" ? "bg-[#25332C]" : "bg-[#E4E8E2]",
        className
      )}
    />
  );
}
