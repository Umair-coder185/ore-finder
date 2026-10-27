import { cn } from "@/lib/utils/cn";

/**
 * Reusable accessible Button component supporting both light editorial
 * and dark workspace environments.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {"primary" | "secondary" | "outline" | "ghost" | "workspace-primary" | "workspace-secondary"} [props.variant="primary"]
 * @param {"sm" | "md" | "lg"} [props.size="md"]
 * @param {"button" | "submit" | "reset"} [props.type="button"]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className,
  ...rest
}) {
  const variantClasses = {
    primary: "bg-[#326B55] text-white hover:bg-[#275644] border border-transparent shadow-xs",
    secondary: "bg-[#E9F1EC] text-[#326B55] hover:bg-[#dce8e0] border border-transparent",
    outline:
      "bg-white text-[#202722] border border-[#E4E8E2] hover:bg-[#F8F7F3] hover:border-[#CDD4CA]",
    ghost: "bg-transparent text-[#65716B] hover:bg-[#F2F0EA] hover:text-[#202722]",
    "workspace-primary":
      "bg-[#69C598] text-[#111916] font-semibold hover:bg-[#57B386] border border-transparent shadow-xs",
    "workspace-secondary": "bg-[#25332C] text-[#F4F7F4] border border-[#34443B] hover:bg-[#2C3D35]",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-xs rounded-md gap-1.5",
    md: "h-10 px-4 text-sm rounded-md gap-2",
    lg: "h-11 px-5 text-sm rounded-lg gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
