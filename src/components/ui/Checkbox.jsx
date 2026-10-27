import { cn } from "@/lib/utils/cn";

/**
 * Accessible Checkbox control with integrated label and optional description.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} [props.description]
 * @param {boolean} [props.checked]
 * @param {function} [props.onChange]
 * @param {"light" | "dark"} [props.tone="light"]
 * @param {string} [props.swatchColor]
 * @param {string} [props.className]
 */
export function Checkbox({
  id,
  label,
  description,
  checked,
  onChange,
  tone = "light",
  swatchColor,
  className,
  ...rest
}) {
  const isDark = tone === "dark";

  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-2.5 rounded-md border p-2.5 transition-colors select-none",
        isDark
          ? checked
            ? "border-[#69C598] bg-[#25332C] text-[#F4F7F4]"
            : "border-[#34443B] bg-[#111916]/80 text-[#A8B8AF] hover:border-[#465B4F] hover:text-[#F4F7F4]"
          : checked
            ? "border-[#326B55] bg-[#E9F1EC]/60 text-[#202722]"
            : "border-[#E4E8E2] bg-white text-[#202722] hover:bg-[#F8F7F3]",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0 rounded cursor-pointer accent-[#326B55]",
          isDark && "accent-[#69C598]"
        )}
        {...rest}
      />
      <span className="flex flex-1 flex-col text-left leading-tight">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
          {swatchColor && (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-xs border border-black/20"
              style={{ backgroundColor: swatchColor }}
              aria-hidden="true"
            />
          )}
          <span>{label}</span>
        </span>
        {description && (
          <span className={cn("mt-1 text-[11px]", isDark ? "text-[#A8B8AF]" : "text-[#65716B]")}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
