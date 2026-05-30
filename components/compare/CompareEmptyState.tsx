"use client";

import { Scale } from "lucide-react";

import { PRESETS } from "@/components/compare/data/comparePresets";

interface CompareEmptyStateProps {
  onPreset: (names: string[]) => void;
}

export function CompareEmptyState({ onPreset }: CompareEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200/80 dark:border-[#30363d] p-8 md:p-14 text-center space-y-6 shadow-sm select-none">
      <div className="max-w-md mx-auto space-y-4 font-sans">
        <div className="w-16 h-16 bg-sky-50 dark:bg-sky-950/30 rounded-2xl flex items-center justify-center mx-auto border border-sky-100 dark:border-sky-900/30">
          <Scale className="w-8 h-8 text-[#007D9C] dark:text-sky-400" />
        </div>

        <h2 className="font-display font-extrabold text-xl text-slate-800 dark:text-[#f0f6fc] tracking-tight">
          Comparator is empty
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8b949e] leading-relaxed font-light">
          Add Go packages using the search bar above, or choose one of the
          recommended presets below:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-xs font-sans">
        {PRESETS.map(({ emoji, title, desc, names }) => (
          <div
            key={title}
            onClick={() => onPreset(names)}
            className="bg-slate-50 dark:bg-[#161b22] hover:bg-sky-50/50 dark:hover:bg-sky-950/20 border border-slate-200/80 dark:border-[#30363d] hover:border-sky-200/60 dark:hover:border-sky-800 p-4 rounded-xl text-left cursor-pointer transition-all hover:shadow-sm"
          >
            <p className="font-bold text-slate-800 dark:text-[#f0f6fc] mb-1 flex items-center gap-1.5">
              <span className="text-[15px]">{emoji}</span> {title}
            </p>

            <p className="text-[10px] text-slate-400 dark:text-[#8b949e] mb-3">
              {desc}
            </p>

            <span className="text-[10px] text-[#007D9C] dark:text-sky-400 font-semibold flex items-center gap-1">
              Load Preset →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
