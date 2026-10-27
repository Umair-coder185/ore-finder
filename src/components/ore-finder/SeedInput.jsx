"use client";

import { ClipboardPaste, X, Hash } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Tooltip } from "@/components/ui/Tooltip";

/**
 * World Seed input control with 64-bit BigInt parsing, Java String.hashCode()
 * text-seed preview, Paste support, Clear action, and validation error messaging.
 *
 * @param {Object} props
 * @param {string} props.seed
 * @param {Object} [props.resolvedSeed]
 * @param {function(string): void} props.onChange
 * @param {function(): void} props.onClear
 * @param {function(): void} props.onPaste
 * @param {string} [props.error]
 * @param {string} [props.pasteNotice]
 */
export function SeedInput({ seed, resolvedSeed, onChange, onClear, onPaste, error, pasteNotice }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="workspace-seed-input"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4F7F4]"
        >
          <Hash className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
          <span>World Seed</span>
          <Tooltip
            tone="dark"
            label="About World Seed Processing"
            content="Supports 64-bit signed integers (-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807) via BigInt, or text seeds converted deterministically via Java's String.hashCode() polynomial rolling hash."
          />
        </label>

        <span className="font-mono text-[11px] text-[#A8B8AF]">
          {resolvedSeed?.isValid
            ? resolvedSeed.inputType === "numeric-64"
              ? "64-Bit Signed Long"
              : `Text Hash: ${resolvedSeed.worldSeedString}`
            : "Numeric or Text"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            id="workspace-seed-input"
            tone="dark"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Enter world seed (e.g. -4172144997902289642 or minecraft)"
            value={seed}
            hasError={Boolean(error)}
            aria-describedby={
              error ? "seed-input-error" : pasteNotice ? "seed-input-notice" : "seed-input-hint"
            }
            onChange={(e) => onChange(e.target.value)}
            className="pr-9 font-mono text-xs sm:text-sm"
          />

          {seed && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear world seed"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#A8B8AF] transition-colors hover:bg-[#25332C] hover:text-[#F4F7F4] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onPaste}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-[#34443B] bg-[#25332C] px-3 text-xs font-semibold text-[#F4F7F4] transition-colors hover:border-[#69C598]/60 hover:bg-[#2C3D35] cursor-pointer"
        >
          <ClipboardPaste className="h-3.5 w-3.5 text-[#69C598]" aria-hidden="true" />
          <span>Paste</span>
        </button>
      </div>

      {error ? (
        <p id="seed-input-error" role="alert" className="text-xs font-medium text-[#F28B82]">
          {error}
        </p>
      ) : pasteNotice ? (
        <p id="seed-input-notice" className="text-[11px] text-[#69C598]">
          {pasteNotice}
        </p>
      ) : resolvedSeed?.isValid && resolvedSeed.inputType === "text-hashed" ? (
        <p id="seed-input-hint" className="font-mono text-[11px] text-[#69C598]">
          Resolved via String.hashCode() &rarr; {resolvedSeed.worldSeedString}
        </p>
      ) : (
        <p id="seed-input-hint" className="text-[11px] text-[#A8B8AF]">
          Exact 64-bit BigInt seed arithmetic &bull; Reproducible across browsers.
        </p>
      )}
    </div>
  );
}
