"use client";

import { ShieldCheck, AlertTriangle, AlertCircle, BarChart3 } from "lucide-react";
import { WORKSPACE_STATUS } from "@/features/ore-finder/types";
import {
  RESULT_CLASSIFICATION,
  CLASSIFICATION_META,
} from "@/features/ore-finder/types/resultContracts";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils/cn";

/**
 * Displays the active Result Classification badge (DETERMINISTIC CANDIDATE,
 * PROBABILITY / DISTRIBUTION GUIDANCE, or UNSUPPORTED) inside the Results Workspace.
 *
 * @param {Object} props
 * @param {string} props.status
 * @param {Object} props.capability
 * @param {string} props.editionLabel
 * @param {string} props.versionLabel
 */
export function AccuracyIndicator({ status, capability, editionLabel, versionLabel }) {
  const isUnsupported = status === WORKSPACE_STATUS.UNSUPPORTED_VERSION;
  const isInvalid = status === WORKSPACE_STATUS.INVALID_INPUT;
  const classification =
    capability?.highestResultClassification || RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE;
  const meta =
    CLASSIFICATION_META[classification] ||
    CLASSIFICATION_META[RESULT_CLASSIFICATION.DISTRIBUTION_GUIDANCE];

  const badgeConfig = isUnsupported
    ? {
        label: "Classification: UNSUPPORTED",
        toneClass: "border-[#D5B77D]/50 bg-[#2C2416] text-[#D5B77D]",
        Icon: AlertTriangle,
      }
    : isInvalid
      ? {
          label: "Validation Required",
          toneClass: "border-[#D96B6B]/50 bg-[#2C1A1A] text-[#F28B82]",
          Icon: AlertCircle,
        }
      : classification === RESULT_CLASSIFICATION.DETERMINISTIC_CANDIDATE
        ? {
            label: `Classification: ${meta.badgeLabel}`,
            toneClass: "border-[#69C598]/45 bg-[#69C598]/15 text-[#69C598]",
            Icon: ShieldCheck,
          }
        : {
            label: `Classification: ${meta.badgeLabel}`,
            toneClass: "border-[#D5B77D]/45 bg-[#D5B77D]/15 text-[#D5B77D]",
            Icon: BarChart3,
          };

  const IconComponent = badgeConfig.Icon;

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
          badgeConfig.toneClass
        )}
      >
        <IconComponent className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{badgeConfig.label}</span>
      </span>

      <Tooltip
        tone="dark"
        label="About Result Classification & Accuracy"
        content={`${editionLabel} (${versionLabel}) — ${meta.description}`}
      />
    </div>
  );
}
