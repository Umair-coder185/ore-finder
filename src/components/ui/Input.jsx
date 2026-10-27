import { cn } from "@/lib/utils/cn";

/**
 * Accessible text/number Input supporting light editorial and dark tool workspace themes.
 *
 * @param {Object} props
 * @param {string} [props.id]
 * @param {"light" | "dark"} [props.tone="light"]
 * @param {boolean} [props.hasError=false]
 * @param {string} [props.className]
 */
export function Input({ id, tone = "light", hasError = false, className, ...rest }) {
  const toneClasses =
    tone === "dark"
      ? "bg-[#111916] text-[#F4F7F4] placeholder:text-[#76887E] border-[#34443B] focus:border-[#69C598]"
      : "bg-white text-[#202722] placeholder:text-[#828E88] border-[#E4E8E2] focus:border-[#326B55]";

  const errorClasses = hasError ? "border-[#D96B6B] focus:border-[#D96B6B]" : "";

  return (
    <input
      id={id}
      aria-invalid={hasError || undefined}
      className={cn(
        "h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors",
        toneClasses,
        errorClasses,
        className
      )}
      {...rest}
    />
  );
}
