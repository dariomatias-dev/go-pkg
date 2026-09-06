"use client";

import { Loader2, Package, Plus, Search, Star, X } from "lucide-react";

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
    <div className="relative w-full shrink-0 md:w-96">
      <div className="group relative">
        <input
          type="text"
          disabled={maxReached}
          placeholder={
            maxReached ? "Limit reached (3/3)" : "Search to add package..."
          }
          value={searchQuery}
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-12 text-sm font-medium text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-[#00ADD8] focus:ring-4 focus:ring-[#00ADD8]/10 focus:outline-none disabled:opacity-50 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#f0f6fc] dark:placeholder-slate-600 dark:focus:border-sky-500 dark:focus:ring-sky-500/5"
        />

        <Search className="absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#00ADD8] dark:text-slate-600" />

        {searchQuery && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full bg-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-300 dark:bg-[#21262d] dark:text-slate-400 dark:hover:bg-[#30363d]"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={onDropdownClose}
          />

          <div className="animate-in fade-in zoom-in-95 absolute top-14 right-0 left-0 z-50 flex max-h-100 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl duration-200 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-50 dark:divide-[#30363d]">
                {suggestionsLoading && (
                  <div className="flex flex-col items-center justify-center gap-3 p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#00ADD8]" />

                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Searching repository...
                    </span>
                  </div>
                )}

                {!suggestionsLoading && suggestions.length > 0 && (
                  <div className="py-1">
                    <div className="sticky top-0 z-10 border-b border-slate-50 bg-white/80 px-4 py-2 backdrop-blur-md dark:border-[#30363d] dark:bg-[#161b22]/80">
                      <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                        Quick Suggestions
                      </span>
                    </div>

                    {suggestions.map((pkg) => (
                      <button
                        key={pkg.importPath}
                        type="button"
                        onClick={() => {
                          onAddPackage(pkg);
                          onDropdownClose();
                        }}
                        className="group flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left transition-all hover:bg-slate-50 dark:hover:bg-[#21262d]"
                      >
                        <div className="min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />

                            <p className="truncate text-sm leading-none font-bold text-slate-900 dark:text-[#f0f6fc]">
                              {pkg.name}
                            </p>
                          </div>

                          <p className="mt-1.5 truncate font-mono text-[10px] text-slate-400 dark:text-slate-500">
                            {pkg.importPath}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-[#c9d1d9]">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            {(pkg.stars || 0).toLocaleString()}
                          </div>

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00ADD8]/10 text-[#00ADD8] shadow-sm transition-all group-hover:bg-[#00ADD8] group-hover:text-white dark:bg-sky-500/10 dark:text-sky-400">
                            <Plus className="h-4 w-4" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!suggestionsLoading &&
                  searchQuery &&
                  suggestions.length === 0 && (
                    <div className="space-y-3 p-10 text-center">
                      <div className="flex justify-center">
                        <div className="rounded-full bg-slate-50 p-3 dark:bg-[#0d1117]">
                          <Search className="h-6 w-6 text-slate-300 dark:text-slate-700" />
                        </div>
                      </div>

                      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                        No packages found
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
