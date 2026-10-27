import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Accessible LoadingIndicator component with screen-reader status announcement.
 *
 * @param {Object} props
 * @param {string} [props.label="Loading workspace telemetry..."]
 * @param {"light" | "dark"} [props.tone="light"]
 * @param {string} [props.className]
 */
export function LoadingIndicator({
  label = "Loading workspace telemetry...",
  tone = "light",
  className,
}) {
  const isDark = tone === "dark";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium",
        isDark ? "text-[#A8B8AF]" : "text-[#65716B]",
        className
      )}
    >
      <Loader2
        className={cn("h-4 w-4 animate-spin", isDark ? "text-[#69C598]" : "text-[#326B55]")}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
