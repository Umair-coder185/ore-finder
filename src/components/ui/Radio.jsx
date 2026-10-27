import { cn } from "@/lib/utils/cn";

/**
 * Accessible Radio option card/button supporting light and dark workspace themes.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.name
 * @param {string} props.value
 * @param {string} props.label
 * @param {string} [props.description]
 * @param {boolean} [props.checked]
 * @param {function} [props.onChange]
 * @param {"light" | "dark"} [props.tone="light"]
 * @param {string} [props.className]
 */
export function Radio({
  id,
  name,
  value,
  label,
  description,
  checked,
  onChange,
  tone = "light",
  className,
  ...rest
}) {
  const isDark = tone === "dark";

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2.5 transition-colors select-none",
        isDark
          ? checked
            ? "border-[#69C598] bg-[#25332C] text-[#F4F7F4]"
            : "border-[#34443B] bg-[#111916] text-[#A8B8AF] hover:border-[#465B4F] hover:text-[#F4F7F4]"
          : checked
            ? "border-[#326B55] bg-[#E9F1EC]/60 text-[#202722]"
            : "border-[#E4E8E2] bg-white text-[#202722] hover:bg-[#F8F7F3]",
        className
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#326B55]",
          isDark && "accent-[#69C598]"
        )}
        {...rest}
      />
      <span className="flex flex-col leading-tight">
        <span className="text-xs font-semibold">{label}</span>
        {description && (
          <span className={cn("mt-0.5 text-[11px]", isDark ? "text-[#A8B8AF]" : "text-[#65716B]")}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
