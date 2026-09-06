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
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#30363d]">
        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-[#f0f6fc]">
          Active Filters
        </h3>

        {hasFilter && (
          <button
            onClick={onClearAll}
            className="cursor-pointer text-[11px] font-medium text-rose-500 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 select-none dark:border-[#30363d] dark:bg-[#0d1117]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-[#c9d1d9]">
            <Sparkles className="h-4 w-4 animate-pulse text-[#00ADD8] dark:text-sky-400" />
            Semantic Search (AI)
          </span>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={semanticSearch}
              onChange={() => onSemanticChange(!semanticSearch)}
              className="peer sr-only"
            />

            <div className="peer h-5 w-9 rounded-full bg-slate-300 peer-checked:bg-[#00ADD8] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-[#30363d] dark:peer-checked:bg-sky-600 dark:after:border-[#30363d]" />
          </label>
        </div>

        <p className="text-[10px] leading-relaxed font-light text-slate-500 dark:text-[#8b949e]">
          Search by functionality (e.g. &quot;caching&quot;, &quot;fast
          routing&quot;) instead of exact names.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-[#8b949e]">
          Categories
        </label>

        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange("")}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
              !category
                ? "bg-sky-50 font-semibold text-[#007D9C] dark:bg-[#21262d] dark:text-sky-400"
                : "text-slate-600 hover:bg-slate-50 dark:text-[#c9d1d9] dark:hover:bg-[#21262d]",
            )}
          >
            <span>All Categories</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200/70 px-1 text-[10px] font-bold text-slate-700 dark:bg-[#30363d] dark:text-[#c9d1d9]">
              {categories.length}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
                category === cat.id
                  ? "bg-[#E0F2FE] font-semibold text-[#007D9C] dark:bg-[#21262d] dark:text-sky-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-[#c9d1d9] dark:hover:bg-[#21262d]",
              )}
            >
              <span className="truncate pr-1">{cat.name}</span>

              <ChevronRight className="h-3 w-3 shrink-0 text-slate-400 dark:text-[#484f58]" />
            </button>
          ))}
        </div>
      </div>

      {tag && (
        <div className="space-y-1">
          <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-[#8b949e]">
            Selected Tag
          </label>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9]">
            <span className="font-mono text-xs">#{tag}</span>

            <button
              onClick={onTagClear}
              className="cursor-pointer px-1 font-bold text-slate-500 hover:text-slate-800 dark:hover:text-[#f0f6fc]"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-sky-100/40 bg-linear-to-br from-indigo-50 to-sky-50 p-4 text-center dark:border-[#30363d] dark:from-[#0d1117] dark:to-[#0d1117]">
        <p className="text-[11px] leading-relaxed font-light text-slate-500 dark:text-[#8b949e]">
          Search popular packages or enter a full Go package import path to load
          it on demand!
        </p>
      </div>
    </div>
  );
}
