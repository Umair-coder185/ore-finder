"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { EDITION_OPTIONS } from "@/features/ore-finder/config/editions";
import { cn } from "@/lib/utils/cn";

/**
 * Accessible Minecraft Edition selector (Java Edition vs. Bedrock Edition).
 * Uses explicit selection iconography in addition to border/color tokens.
 *
 * @param {Object} props
 * @param {string} props.edition
 * @param {function(string): void} props.onChange
 */
export function EditionSelector({ edition, onChange }) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-xs font-semibold text-[#F4F7F4]">Minecraft Edition</legend>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {EDITION_OPTIONS.map((opt) => {
          const isSelected = edition === opt.id;
          const inputId = `workspace-edition-${opt.id}`;

          return (
            <label
              key={opt.id}
              htmlFor={inputId}
              className={cn(
                "relative flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-colors select-none",
                isSelected
                  ? "border-[#69C598] bg-[#25332C] text-[#F4F7F4]"
                  : "border-[#34443B] bg-[#111916] text-[#A8B8AF] hover:border-[#465B4F] hover:text-[#F4F7F4]"
              )}
            >
              <input
                id={inputId}
                type="radio"
                name="minecraft-edition"
                value={opt.id}
                checked={isSelected}
                onChange={() => onChange(opt.id)}
                className="sr-only"
              />
              {isSelected ? (
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#69C598]"
                  aria-hidden="true"
                />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[#76887E]" aria-hidden="true" />
              )}

              <div className="flex flex-1 flex-col leading-tight">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#F4F7F4]">{opt.label}</span>
                  {isSelected && (
                    <span className="rounded bg-[#69C598]/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#69C598]">
                      Active
                    </span>
                  )}
                </div>
                <span className="mt-1 text-[11px] text-[#A8B8AF]">{opt.platformNote}</span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
