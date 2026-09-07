"use client";

import { Scale } from "lucide-react";

import { PRESETS } from "@/components/compare/data/comparePresets";

interface CompareEmptyStateProps {
  onPreset: (names: string[]) => void;
}

export function CompareEmptyState({ onPreset }: CompareEmptyStateProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm select-none md:p-14 dark:border-[#30363d] dark:bg-[#0d1117]">
      <div className="mx-auto max-w-md space-y-4 font-sans">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 dark:border-sky-900/30 dark:bg-sky-950/30">
          <Scale className="h-8 w-8 text-[#006680] dark:text-sky-400" />
        </div>

        <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-800 dark:text-[#f0f6fc]">
          Comparator is empty
        </h2>

        <p className="text-xs leading-relaxed font-light text-slate-500 sm:text-sm dark:text-[#8b949e]">
          Add Go packages using the search bar above, or choose one of the
          recommended presets below:
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 pt-4 font-sans text-xs sm:grid-cols-3">
        {PRESETS.map(({ emoji, title, desc, names }) => (
          <button
            key={title}
            type="button"
            onClick={() => onPreset(names)}
            className="cursor-pointer rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-left transition-all hover:border-sky-200/60 hover:bg-sky-50/50 hover:shadow-sm dark:border-[#30363d] dark:bg-[#161b22] dark:hover:border-sky-800 dark:hover:bg-sky-950/20"
          >
            <p className="mb-1 flex items-center gap-1.5 font-bold text-slate-800 dark:text-[#f0f6fc]">
              <span className="text-[15px]">{emoji}</span> {title}
            </p>

            <p className="mb-3 text-[10px] text-slate-400 dark:text-[#8b949e]">
              {desc}
            </p>

            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#006680] dark:text-sky-400">
              Load Preset →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
