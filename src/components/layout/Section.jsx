import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";

/**
 * Semantic page section with consistent vertical rhythm and surface variants.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {string} [props.id]
 * @param {"default" | "surface" | "subtle" | "dark"} [props.variant="default"]
 * @param {"sm" | "md" | "lg"} [props.spacing="md"]
 * @param {"default" | "narrow" | "wide"} [props.containerSize="default"]
 * @param {boolean} [props.bordered=false]
 * @param {string} [props.className]
 */
export function Section({
  children,
  id,
  variant = "default",
  spacing = "md",
  containerSize = "default",
  bordered = false,
  className,
}) {
  const variantClasses = {
    default: "bg-[#F8F7F3] text-[#202722]",
    surface: "bg-white text-[#202722]",
    subtle: "bg-[#F2F0EA] text-[#202722]",
    dark: "bg-[#111916] text-[#F4F7F4] dark-workspace",
  };

  const spacingClasses = {
    sm: "py-10 sm:py-12",
    md: "py-14 sm:py-20",
    lg: "py-20 sm:py-24",
  };

  return (
    <section
      id={id}
      className={cn(
        variantClasses[variant] || variantClasses.default,
        spacingClasses[spacing] || spacingClasses.md,
        bordered && "border-y border-[#E4E8E2]",
        className
      )}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
