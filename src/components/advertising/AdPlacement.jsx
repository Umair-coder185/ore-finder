import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/layout/Container";
import { AdPlaceholder } from "./AdPlaceholder";

/**
 * AdSense-conscious placement wrapper.
 * Ensures generous vertical separation from interactive tool controls,
 * explicit "Advertisement" disclosure, and zero interference with navigation.
 *
 * No live AdSense scripts are loaded in Phase 01.
 *
 * @param {Object} props
 * @param {"horizontal" | "in-article" | "sidebar"} [props.format="horizontal"]
 * @param {string} [props.slotId="editorial-divider-01"]
 * @param {boolean} [props.withContainer=true]
 * @param {string} [props.className]
 */
export function AdPlacement({
  format = "horizontal",
  slotId = "editorial-divider-01",
  withContainer = true,
  className,
}) {
  const content = (
    <aside
      aria-label="Sponsored content region"
      className={cn("my-8 flex flex-col items-center", className)}
    >
      <div className="mb-1.5 flex w-full items-center justify-between text-[10px] font-medium uppercase tracking-wider text-[#65716B]">
        <span>Advertisement Disclosure</span>
        <span>Isolated from Interactive Controls</span>
      </div>
      <AdPlaceholder format={format} slotId={slotId} />
    </aside>
  );

  if (!withContainer) {
    return content;
  }

  return <Container size="default">{content}</Container>;
}
