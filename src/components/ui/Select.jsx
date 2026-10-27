import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Accessible native Select wrapper with custom chevron indicator.
 *
 * @param {Object} props
 * @param {string} [props.id]
 * @param {Array<{ value: string | number, label: string }>} [props.options]
 * @param {"light" | "dark"} [props.tone="light"]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} [props.children]
 */
export function Select({ id, options = [], tone = "light", className, children, ...rest }) {
  const toneClasses =
    tone === "dark"
      ? "bg-[#111916] text-[#F4F7F4] border-[#34443B] focus:border-[#69C598]"
      : "bg-white text-[#202722] border-[#E4E8E2] focus:border-[#326B55]";

  return (
    <div className="relative w-full">
      <select
        id={id}
        className={cn(
          "h-10 w-full appearance-none rounded-md border pl-3 pr-9 py-2 text-sm transition-colors cursor-pointer",
          toneClasses,
          className
        )}
        {...rest}
      >
        {children
          ? children
          : options.map((opt) => (
              <option
                key={String(opt.value)}
                value={opt.value}
                className={
                  tone === "dark" ? "bg-[#1B2621] text-[#F4F7F4]" : "bg-white text-[#202722]"
                }
              >
                {opt.label}
              </option>
            ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2",
          tone === "dark" ? "text-[#A8B8AF]" : "text-[#65716B]"
        )}
      />
    </div>
  );
}
