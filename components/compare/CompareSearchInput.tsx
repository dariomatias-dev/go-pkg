"use client";

import { Loader2, Plus, Search, Star, X } from "lucide-react";

import type { GoPackage } from "@/types";

interface CompareSearchInputProps {
  pkgCount: number;
  searchQuery: string;
  dropdownOpen: boolean;
  suggestions: GoPackage[];
  suggestionsLoading: boolean;
  onChange: (q: string) => void;
  onFocus: () => void;
  onDropdownClose: () => void;
  onAddPackage: (pkg: GoPackage) => void;
}

export function CompareSearchInput({
  pkgCount,
  searchQuery,
  dropdownOpen,
  suggestions,
  suggestionsLoading,
  onChange,
  onFocus,
  onDropdownClose,
  onAddPackage,
}: CompareSearchInputProps) {
  const maxReached = pkgCount >= 3;

  return (
    <div className="relative w-full md:w-80 shrink-0">
      <div className="relative flex items-center">
        <input
          type="text"
          disabled={maxReached}
          placeholder={
            maxReached
              ? "Maximum of 3 packages reached"
              : "Add a package to compare..."
          }
          value={searchQuery}
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-[#0d1117] hover:bg-white dark:hover:bg-[#161b22] text-slate-800 dark:text-[#c9d1d9] placeholder-slate-400 dark:placeholder-[#484f58] border border-slate-200 dark:border-[#30363d] hover:border-slate-300 dark:hover:border-[#484f58] focus:bg-white dark:focus:bg-[#161b22] focus:border-[#00ADD8] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#00ADD8]/20 focus:outline-none py-3 pl-11 pr-10 rounded-xl text-xs sm:text-sm font-sans transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        />

        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#484f58] pointer-events-none" />

        {searchQuery && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#484f58] hover:text-slate-600 dark:hover:text-[#f0f6fc] bg-transparent border-none p-1 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-[#21262d]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {dropdownOpen && (
        <div className="absolute top-14 left-0 right-0 max-h-60 overflow-y-auto bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] shadow-xl rounded-xl z-50 divide-y divide-slate-50 dark:divide-[#30363d] animate-fade-in font-sans">
          {suggestionsLoading && suggestions.length === 0 ? (
            <div className="p-4 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-[#8b949e]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading suggestions...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((pkg) => (
              <button
                key={pkg.importPath}
                onClick={() => onAddPackage(pkg)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#21262d] flex items-center justify-between text-xs transition-colors cursor-pointer text-slate-700 dark:text-[#c9d1d9]"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-800 dark:text-[#f0f6fc] truncate">
                    {pkg.name}
                  </p>

                  <p className="font-mono text-[10px] text-slate-400 dark:text-[#8b949e] truncate">
                    {pkg.importPath}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-[#007D9C] dark:text-sky-400 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[#00ADD8] dark:fill-sky-500 stroke-[#00ADD8] dark:stroke-sky-500" />

                  <span className="font-semibold text-slate-700 dark:text-[#c9d1d9]">
                    {(pkg.stars || 0).toLocaleString()}
                  </span>

                  <Plus className="w-3.5 h-3.5 ml-1 bg-sky-50 dark:bg-sky-950/30 text-[#007D9C] dark:text-sky-400 rounded-full p-0.5" />
                </div>
              </button>
            ))
          ) : (
            <p className="p-4 text-center text-xs text-slate-400 dark:text-[#8b949e]">
              No packages found for suggestion.
            </p>
          )}
        </div>
      )}

      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={onDropdownClose} />
      )}
    </div>
  );
}
