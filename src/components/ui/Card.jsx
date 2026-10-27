import { cn } from "@/lib/utils/cn";

/**
 * Reusable surface Card component with light editorial and dark tool workspace variants.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {"light" | "subtle" | "dark" | "dark-panel"} [props.variant="light"]
 * @param {"none" | "sm" | "md" | "lg"} [props.padding="md"]
 * @param {string} [props.className]
 * @param {import("react").ElementType} [props.as="div"]
 */
export function Card({
  children,
  variant = "light",
  padding = "md",
  className,
  as: Component = "div",
  ...rest
}) {
  const variantClasses = {
    light: "bg-white border border-[#E4E8E2] text-[#202722] shadow-xs",
    subtle: "bg-[#F8F7F3] border border-[#E4E8E2] text-[#202722]",
    dark: "bg-[#1B2621] border border-[#34443B] text-[#F4F7F4]",
    "dark-panel": "bg-[#25332C] border border-[#34443B] text-[#F4F7F4]",
  };

  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <Component
      className={cn(
        "rounded-xl",
        variantClasses[variant] || variantClasses.light,
        paddingClasses[padding] || paddingClasses.md,
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
