"use client";

import { ChevronRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CuratedCategory } from "@/types";

interface SearchSidebarProps {
  category: string;
  tag: string;
  semanticSearch: boolean;
  categories: CuratedCategory[];
  hasFilter: boolean;
  onSemanticChange: (val: boolean) => void;
  onCategoryChange: (catId: string) => void;
  onTagClear: () => void;
  onClearAll: () => void;
}

export function SearchSidebar({
  category,
  tag,
  semanticSearch,
  categories,
  hasFilter,
  onSemanticChange,
  onCategoryChange,
  onTagClear,
  onClearAll,
}: SearchSidebarProps) {
  return (
    <div className="bg-white dark:bg-[#161b22] rounded-xl p-5 border border-slate-200 dark:border-[#30363d] shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#30363d]">
        <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-[#f0f6fc]">
          Active Filters
        </h3>

        {hasFilter && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-medium text-rose-500 hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="bg-slate-50/50 dark:bg-[#0d1117] rounded-xl p-3.5 border border-slate-200 dark:border-[#30363d] space-y-2 select-none">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-[#c9d1d9] flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#00ADD8] dark:text-sky-400 animate-pulse" />
            Semantic Search (AI)
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={semanticSearch}
              onChange={() => onSemanticChange(!semanticSearch)}
              className="sr-only peer"
            />

            <div className="w-9 h-5 bg-slate-300 dark:bg-[#30363d] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 dark:after:border-[#30363d] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00ADD8] dark:peer-checked:bg-sky-600" />
          </label>
        </div>

        <p className="text-[10px] text-slate-500 dark:text-[#8b949e] leading-relaxed font-light">
          Search by functionality (e.g. &quot;caching&quot;, &quot;fast
          routing&quot;) instead of exact names.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 dark:text-[#8b949e] uppercase tracking-wider block">
          Categories
        </label>

        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange("")}
            className={cn(
              "w-full text-left text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer",
              !category
                ? "bg-sky-50 dark:bg-[#21262d] text-[#007D9C] dark:text-sky-400 font-semibold"
                : "hover:bg-slate-50 dark:hover:bg-[#21262d] text-slate-600 dark:text-[#c9d1d9]",
            )}
          >
            <span>All Categories</span>

            <span className="bg-slate-200/70 dark:bg-[#30363d] text-slate-700 dark:text-[#c9d1d9] min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold">
              {categories.length || 12}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "w-full text-left text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                category === cat.id
                  ? "bg-[#E0F2FE] dark:bg-[#21262d] text-[#007D9C] dark:text-sky-400 font-semibold"
                  : "hover:bg-slate-50 dark:hover:bg-[#21262d] text-slate-600 dark:text-[#c9d1d9]",
              )}
            >
              <span className="truncate pr-1">{cat.name}</span>

              <ChevronRight className="w-3 h-3 text-slate-400 dark:text-[#484f58] shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {tag && (
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 dark:text-[#8b949e] uppercase tracking-wider block">
            Selected Tag
          </label>

          <div className="flex items-center justify-between bg-slate-100 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#c9d1d9] px-3 py-2 rounded-lg">
            <span className="text-xs font-mono">#{tag}</span>

            <button
              onClick={onTagClear}
              className="font-bold text-slate-500 hover:text-slate-800 dark:hover:text-[#f0f6fc] px-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-linear-to-br from-indigo-50 to-sky-50 dark:from-[#0d1117] dark:to-[#0d1117] rounded-xl p-4 border border-sky-100/40 dark:border-[#30363d] text-center">
        <p className="text-[11px] text-slate-500 dark:text-[#8b949e] leading-relaxed font-light">
          Search popular packages or enter a full Go module import path to load
          it on demand!
        </p>
      </div>
    </div>
  );
}
