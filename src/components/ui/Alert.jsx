import { Info, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Semantic Alert component for technical notices, draft disclaimers, and workspace warnings.
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {import("react").ReactNode} props.children
 * @param {"info" | "warning" | "success" | "dark-info" | "dark-warning"} [props.variant="info"]
 * @param {string} [props.className]
 */
export function Alert({ title, children, variant = "info", className }) {
  const config = {
    info: {
      wrapper: "bg-[#E9F1EC]/75 border-[#C8DDD0] text-[#202722]",
      iconColor: "text-[#326B55]",
      Icon: Info,
    },
    warning: {
      wrapper: "bg-[#F7F1E3] border-[#E6D5B3] text-[#202722]",
      iconColor: "text-[#9E7329]",
      Icon: AlertTriangle,
    },
    success: {
      wrapper: "bg-[#E9F1EC] border-[#326B55]/30 text-[#202722]",
      iconColor: "text-[#326B55]",
      Icon: CheckCircle2,
    },
    "dark-info": {
      wrapper: "bg-[#25332C]/90 border-[#34443B] text-[#F4F7F4]",
      iconColor: "text-[#69C598]",
      Icon: Info,
    },
    "dark-warning": {
      wrapper: "bg-[#25332C] border-[#D5B77D]/45 text-[#F4F7F4]",
      iconColor: "text-[#D5B77D]",
      Icon: ShieldAlert,
    },
  };

  const current = config[variant] || config.info;
  const IconComponent = current.Icon;

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm",
        current.wrapper,
        className
      )}
    >
      <IconComponent
        className={cn("mt-0.5 h-4.5 w-4.5 shrink-0", current.iconColor)}
        aria-hidden="true"
      />
      <div className="flex-1 space-y-1">
        {title && <p className="font-heading text-sm font-bold leading-snug">{title}</p>}
        <div className="text-xs sm:text-sm leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
