"use client";

import { useState, useId } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Keyboard-accessible Tooltip trigger and popover.
 *
 * @param {Object} props
 * @param {string} props.content
 * @param {string} [props.label="More information"]
 * @param {"light" | "dark"} [props.tone="light"]
 * @param {string} [props.className]
 */
export function Tooltip({ content, label = "More information", tone = "light", className }) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const isDark = tone === "dark";

  return (
    <span
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors cursor-pointer",
          isDark ? "text-[#A8B8AF] hover:text-[#69C598]" : "text-[#65716B] hover:text-[#326B55]"
        )}
      >
        <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            " absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-md border p-2.5 text-left text-xs font-normal leading-relaxed shadow-md",
            isDark
              ? "border-[#34443B] bg-[#111916] text-[#F4F7F4]"
              : "border-[#E4E8E2] bg-[#202722] text-[#F8F7F3]"
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
