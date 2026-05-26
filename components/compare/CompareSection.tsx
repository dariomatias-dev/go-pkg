"use client";

import { Plus, Scale, Search, Star, X } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { CompareEmptyState } from "@/components/compare/CompareEmptyState";
import { PRESET_PATH_MAP } from "@/components/compare/data/comparePresets";
import { CompareTable } from "@/components/compare/CompareTable";
import {
  compareServerSnapshot,
  compareSnapshot,
  compareSubscribe,
  getCompareData,
  setCompareData,
} from "@/components/compare/data/compareStore";
import { encodeImportPath } from "@/lib/utils";
import type { GoPackage } from "@/types";

export function CompareSection() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<GoPackage[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const compared = useSyncExternalStore(
    compareSubscribe,
    compareSnapshot,
    compareServerSnapshot,
  );

  useEffect(() => {
    let active = true;

    const q = searchQuery.trim();
    const fetchUrl = q
      ? `/api/search?q=${encodeURIComponent(q)}`
      : `/api/search?q=`;

    const timer = setTimeout(
      () => {
        if (!active) return;

        setSuggestionsLoading(true);

        fetch(fetchUrl)
          .then((res) => res.json())
          .then((data) => {
            if (active && data?.results) {
              const filtered = data.results.filter(
                (pkg: GoPackage) =>
                  !compared.some((cp) => cp.importPath === pkg.importPath),
              );

              setSuggestions(filtered.slice(0, 8));
            }
          })
          .catch(() => {})
          .finally(() => {
            if (active) setSuggestionsLoading(false);
          });
      },
      q ? 300 : 0,
    );

    return () => {
      active = false;

      clearTimeout(timer);
    };
  }, [searchQuery, compared]);

  const addPackage = (pkg: GoPackage) => {
    const current = getCompareData();

    if (current.some((cp) => cp.importPath === pkg.importPath)) return;
    if (current.length >= 3) return;

    setCompareData([...current, pkg]);
    setSearchQuery("");
    setDropdownOpen(false);
  };

  const removePackage = (importPath: string) => {
    setCompareData(
      getCompareData().filter((pkg) => pkg.importPath !== importPath),
    );
  };

  const handlePreset = (names: string[]) => {
    compared.forEach((cp) => removePackage(cp.importPath));

    names.forEach((name) => {
      const importPath = PRESET_PATH_MAP[name] || name;

      fetch(`/api/package-info?module=${encodeURIComponent(importPath)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.pkg) addPackage(data.pkg);
        })
        .catch(() => {});
    });
  };

  const inspectPackage = (importPath: string) => {
    router.push(
      `/package/${encodeImportPath(importPath)}` as Route<`/package/${string}`>,
    );
  };

  return (
    <div className="bg-slate-50/40 dark:bg-[#0b0e14] py-8 flex-1 transition-colors duration-300">
      <div className="container-scale max-w-6xl space-y-8">
        <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200/80 dark:border-[#30363d] p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#007D9C] dark:text-sky-400">
              <Scale className="w-6 h-6" />

              <span className="font-display font-medium text-xs uppercase tracking-widest bg-sky-50 dark:bg-sky-950/30 text-[#007D9C] dark:text-sky-400 px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900/30">
                Decision Matrix
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 dark:text-[#f0f6fc] tracking-tight">
              Go Package Comparator
            </h1>

            <p className="text-sm text-slate-500 dark:text-[#8b949e] leading-relaxed max-w-2xl font-light">
              Choose up to{" "}
              <strong className="font-semibold text-slate-700 dark:text-[#c9d1d9]">
                three Go modules
              </strong>{" "}
              side by side to contrast stars, forks, dependencies, and official
              licenses.
            </p>
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                disabled={compared.length >= 3}
                placeholder={
                  compared.length >= 3
                    ? "Maximum of 3 packages reached"
                    : "Add a package to compare..."
                }
                value={searchQuery}
                onFocus={() => setDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                className="w-full bg-slate-50 dark:bg-[#0d1117] hover:bg-white dark:hover:bg-[#161b22] text-slate-800 dark:text-[#c9d1d9] placeholder-slate-400 dark:placeholder-[#484f58] border border-slate-200 dark:border-[#30363d] hover:border-slate-300 dark:hover:border-[#484f58] focus:bg-white dark:focus:bg-[#161b22] focus:border-[#00ADD8] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#00ADD8]/20 focus:outline-none py-3 pl-11 pr-10 rounded-xl text-xs sm:text-sm font-sans transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              />

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#484f58] pointer-events-none" />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#484f58] hover:text-slate-600 dark:hover:text-[#f0f6fc] bg-transparent border-none p-1 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-[#21262d]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute top-14 left-0 right-0 max-h-60 overflow-y-auto bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] shadow-xl rounded-xl z-50 divide-y divide-slate-50 dark:divide-[#30363d] animate-fade-in font-sans">
                {suggestionsLoading && suggestions.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400 dark:text-[#8b949e] font-mono animate-pulse">
                    Loading suggestions...
                  </p>
                ) : suggestions.length > 0 ? (
                  suggestions.map((pkg) => (
                    <button
                      key={pkg.importPath}
                      onClick={() => addPackage(pkg)}
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
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
            )}
          </div>
        </div>

        {compared.length > 0 ? (
          <CompareTable
            compared={compared}
            removePackage={removePackage}
            inspectPackage={inspectPackage}
          />
        ) : (
          <CompareEmptyState onPreset={handlePreset} />
        )}
      </div>
    </div>
  );
}
