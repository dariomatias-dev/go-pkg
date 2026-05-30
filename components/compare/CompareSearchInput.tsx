"use client";

import type { GoPackage } from "@/types";
import { Loader2, Package, Plus, Search, Star, X } from "lucide-react";

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
    <div className="relative w-full md:w-96 shrink-0">
      <div className="relative group">
        <input
          type="text"
          disabled={maxReached}
          placeholder={
            maxReached ? "Limit reached (3/3)" : "Search to add package..."
          }
          value={searchQuery}
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-[#f0f6fc] placeholder-slate-400 dark:placeholder-slate-600 border border-slate-200 dark:border-[#30363d] focus:border-[#00ADD8] dark:focus:border-sky-500 focus:ring-4 focus:ring-[#00ADD8]/10 dark:focus:ring-sky-500/5 focus:outline-none py-3 pl-12 pr-10 rounded-2xl text-sm font-medium transition-all disabled:opacity-50 shadow-sm"
        />

        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 dark:text-slate-600 group-focus-within:text-[#00ADD8] transition-colors" />

        {searchQuery && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-200 dark:bg-[#21262d] text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-[#30363d] transition-colors cursor-pointer"
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

          <div className="absolute top-14 left-0 right-0 z-50 flex flex-col bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-100">
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-50 dark:divide-[#30363d]">
                {suggestionsLoading && (
                  <div className="p-8 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-[#00ADD8]" />

                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Searching repository...
                    </span>
                  </div>
                )}

                {!suggestionsLoading && suggestions.length > 0 && (
                  <div className="py-1">
                    <div className="px-4 py-2 bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-50 dark:border-[#30363d]">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
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
                        className="w-full text-left px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-[#21262d] flex items-center justify-between transition-all group cursor-pointer"
                      >
                        <div className="min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />

                            <p className="font-bold text-slate-900 dark:text-[#f0f6fc] truncate text-sm leading-none">
                              {pkg.name}
                            </p>
                          </div>

                          <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1.5">
                            {pkg.importPath}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-[#c9d1d9]">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            {(pkg.stars || 0).toLocaleString()}
                          </div>

                          <div className="h-7 w-7 rounded-full bg-[#00ADD8]/10 text-[#00ADD8] dark:bg-sky-500/10 dark:text-sky-400 flex items-center justify-center group-hover:bg-[#00ADD8] group-hover:text-white transition-all shadow-sm">
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
                    <div className="p-10 text-center space-y-3">
                      <div className="flex justify-center">
                        <div className="p-3 rounded-full bg-slate-50 dark:bg-[#0d1117]">
                          <Search className="h-6 w-6 text-slate-300 dark:text-slate-700" />
                        </div>
                      </div>

                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
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
