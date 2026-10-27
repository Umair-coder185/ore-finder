"use client";

import { cn } from "@/lib/utils/cn";

/**
 * Accessible horizontal Tabs component supporting keyboard selection.
 *
 * @param {Object} props
 * @param {Array<{ id: string, label: string, badge?: string | number }>} props.tabs
 * @param {string} props.activeTab
 * @param {function(string): void} props.onChange
 * @param {"light" | "dark"} [props.tone="light"]
 * @param {string} [props.ariaLabel="Section tabs"]
 * @param {string} [props.className]
 */
export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  tone = "light",
  ariaLabel = "Section tabs",
  className,
}) {
  const isDark = tone === "dark";

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-lg border p-1",
        isDark ? "border-[#34443B] bg-[#111916]" : "border-[#E4E8E2] bg-[#F2F0EA]",
        className
      )}
    >
      {tabs.map((tab) => {
        const isSelected = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-selected={isSelected}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
              isDark
                ? isSelected
                  ? "bg-[#25332C] text-[#69C598] shadow-xs"
                  : "text-[#A8B8AF] hover:text-[#F4F7F4]"
                : isSelected
                  ? "bg-white text-[#202722] shadow-xs"
                  : "text-[#65716B] hover:text-[#202722]"
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px]",
                  isDark ? "bg-[#111916] text-[#A8B8AF]" : "bg-[#E9F1EC] text-[#326B55]"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
