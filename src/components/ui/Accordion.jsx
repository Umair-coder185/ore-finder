"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Accessible Accordion component for FAQ and technical specification sections.
 *
 * @param {Object} props
 * @param {Array<{ id: string, question: string, answer: string }>} props.items
 * @param {string} [props.defaultOpenId]
 * @param {string} [props.className]
 */
export function Accordion({ items = [], defaultOpenId, className }) {
  const [openId, setOpenId] = useState(defaultOpenId || (items[0]?.id ?? null));

  return (
    <div
      className={cn(
        "divide-y divide-[#E4E8E2] rounded-xl border border-[#E4E8E2] bg-white",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="p-5 sm:p-6">
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 text-left font-heading text-base font-bold text-[#202722] transition-colors hover:text-[#326B55] cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "h-5 w-5 shrink-0 text-[#65716B] transition-transform duration-200",
                    isOpen && "rotate-180 text-[#326B55]"
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={cn("mt-3 text-sm leading-relaxed text-[#65716B]", !isOpen && "hidden")}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
