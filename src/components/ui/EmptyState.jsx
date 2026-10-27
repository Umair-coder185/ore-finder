import { Layers } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Reusable EmptyState component for unpopulated views and standby tool states.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {import("react").ComponentType<{ className?: string }>} [props.icon]
 * @param {"light" | "dark"} [props.tone="light"]
 * @param {import("react").ReactNode} [props.action]
 * @param {string} [props.className]
 */
export function EmptyState({
  title,
  description,
  icon: Icon = Layers,
  tone = "light",
  action,
  className,
}) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center",
        isDark
          ? "border-[#34443B] bg-[#111916]/60 text-[#F4F7F4]"
          : "border-[#CDD4CA] bg-[#F8F7F3] text-[#202722]",
        className
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-11 w-11 items-center justify-center rounded-lg border",
          isDark
            ? "border-[#34443B] bg-[#1B2621] text-[#69C598]"
            : "border-[#E4E8E2] bg-white text-[#326B55]"
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-base font-bold">{title}</h3>
      <p
        className={cn(
          "mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed",
          isDark ? "text-[#A8B8AF]" : "text-[#65716B]"
        )}
      >
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
