import { cn } from "@/lib/utils/cn";

/**
 * Responsive horizontal container enforcing consistent max-widths and padding.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @param {"default" | "narrow" | "wide"} [props.size="default"]
 * @param {string} [props.className]
 * @param {import("react").ElementType} [props.as="div"]
 */
export function Container({ children, size = "default", className, as: Component = "div" }) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[86rem]",
  };

  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size] || sizeClasses.default,
        className
      )}
    >
      {children}
    </Component>
  );
}
