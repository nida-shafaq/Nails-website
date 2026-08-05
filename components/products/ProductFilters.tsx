"use client";

import React, { Suspense } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Filter, X, ChevronDown } from "lucide-react";
import { SwatchDot } from "@/components/shared/SwatchDot";

// In production, sync with shared schemas
const SHAPES = ["Almond", "Coffin", "Square", "Stiletto", "Oval"];
const LENGTHS = ["Short", "Medium", "Long", "XL"];
const FINISHES = ["Glossy", "Matte", "Chrome", "Glitter", "Jelly"];

const FINISH_COLORS: Record<string, string> = {
  Glossy: "#8B1A3A",
  Matte: "#2E2926",
  Chrome: "#D4D0CC",
  Glitter: "#C9963E",
  Jelly: "#F5E8ED",
};

function FilterContent() {
  const [selectedShape, setShape] = useQueryState("shape", parseAsString);
  const [selectedLength, setLength] = useQueryState("length", parseAsString);
  const [selectedFinish, setFinish] = useQueryState("finish", parseAsString);

  const toggleFilter = (
    current: string | null,
    setFn: (val: string | null) => void,
    value: string
  ) => {
    // If clicking the already active filter, clear it (deselect)
    setFn(current === value ? null : value);
  };

  const clearAll = () => {
    setShape(null);
    setLength(null);
    setFinish(null);
  };

  const activeCount = (selectedShape ? 1 : 0) + (selectedLength ? 1 : 0) + (selectedFinish ? 1 : 0);

  return (
    <div className="w-full lg:w-64 shrink-0 flex flex-col gap-8 sticky top-28 h-fit max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex items-center justify-between pb-4 border-b border-[--color-chrome]">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[--color-obsidian]" />
          <h2 className="text-sm font-mono uppercase tracking-widest text-[--color-obsidian]">Filters</h2>
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-[--color-ink] hover:text-[--color-lacquer] underline decoration-dotted transition-colors"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Finishes (Swatch-based) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-[--color-obsidian]">Finish</h3>
        <div className="flex flex-wrap gap-4">
          {FINISHES.map((finish) => (
            <div key={finish} className="flex flex-col items-center gap-1.5">
              <SwatchDot
                color={FINISH_COLORS[finish] || "#000"}
                size="md"
                selected={selectedFinish === finish}
                onClick={() => toggleFilter(selectedFinish, setFinish, finish)}
                label={finish}
              />
              <span className="text-[0.65rem] font-mono text-[--color-ink] uppercase tracking-wider">
                {finish}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shapes (Chips) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-[--color-obsidian]">Shape</h3>
        <div className="flex flex-wrap gap-2">
          {SHAPES.map((shape) => (
            <button
              key={shape}
              onClick={() => toggleFilter(selectedShape, setShape, shape)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                selectedShape === shape
                  ? "bg-[--color-obsidian] border-[--color-obsidian] text-white"
                  : "bg-transparent border-[--color-chrome] text-[--color-ink] hover:border-[--color-obsidian] hover:text-[--color-obsidian]"
              }`}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>

      {/* Lengths (Chips) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-[--color-obsidian]">Length</h3>
        <div className="flex flex-wrap gap-2">
          {LENGTHS.map((length) => (
            <button
              key={length}
              onClick={() => toggleFilter(selectedLength, setLength, length)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                selectedLength === length
                  ? "bg-[--color-obsidian] border-[--color-obsidian] text-white"
                  : "bg-transparent border-[--color-chrome] text-[--color-ink] hover:border-[--color-obsidian] hover:text-[--color-obsidian]"
              }`}
            >
              {length}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Wrap in suspense since useQueryState reads from URLSearchParams
export function ProductFilters() {
  return (
    <Suspense fallback={<div className="w-64 h-96 bg-[--color-mist] animate-pulse rounded-xl" />}>
      <FilterContent />
    </Suspense>
  );
}
