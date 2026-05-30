"use client";

import { Loader2 } from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { CompareEmptyState } from "@/components/compare/CompareEmptyState";
import { CompareSearchInput } from "@/components/compare/CompareSearchInput";
import { CompareTable } from "@/components/compare/CompareTable";
import { PRESET_PATH_MAP } from "@/components/compare/data/comparePresets";
import { encodeImportPath } from "@/lib/utils";
import type { GoPackage } from "@/types";

export function CompareSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchParamsStr = searchParams.toString();
  const pkgPaths = useMemo(
    () => new URLSearchParams(searchParamsStr).getAll("pkg"),
    [searchParamsStr],
  );

  const [compared, setCompared] = useState<GoPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<GoPackage[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const loadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const toFetch = pkgPaths.filter((path) => !loadedRef.current.has(path));

    toFetch.forEach((path) => {
      loadedRef.current.add(path);

      fetch(`/api/package-info?importPath=${encodeURIComponent(path)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.pkg) {
            setCompared((prev) => {
              if (prev.some((p) => p.importPath === path)) return prev;

              return [...prev, data.pkg as GoPackage];
            });
          }
        })
        .catch(() => {
          loadedRef.current.delete(path);
        });
    });
  }, [pkgPaths]);

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
              const filtered = (data.results as GoPackage[]).filter(
                (pkg) => !pkgPaths.includes(pkg.importPath),
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
  }, [searchQuery, pkgPaths]);

  const addPackage = (pkg: GoPackage) => {
    if (pkgPaths.length >= 3) return;
    if (pkgPaths.includes(pkg.importPath)) return;

    loadedRef.current.add(pkg.importPath);

    setCompared((prev) => [...prev, pkg]);

    const params = new URLSearchParams(searchParams.toString());

    params.append("pkg", pkg.importPath);

    router.push(`${pathname}?${params.toString()}`);

    setSearchQuery("");
    setDropdownOpen(false);
  };

  const removePackage = (importPath: string) => {
    loadedRef.current.delete(importPath);

    setCompared((prev) => prev.filter((p) => p.importPath !== importPath));

    const newPaths = pkgPaths.filter((p) => p !== importPath);
    const params = new URLSearchParams();

    newPaths.forEach((p) => params.append("pkg", p));

    const query = params.toString();

    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handlePreset = (names: string[]) => {
    const paths = names.map((name) => PRESET_PATH_MAP[name] ?? name);

    paths.forEach((p) => loadedRef.current.delete(p));

    const params = new URLSearchParams();

    paths.forEach((p) => params.append("pkg", p));

    router.push(`${pathname}?${params.toString()}`);
  };

  const inspectPackage = (importPath: string) => {
    router.push(
      `/package/${encodeImportPath(importPath)}` as Route<`/package/${string}`>,
    );
  };

  const orderedCompared = pkgPaths
    .map((path) => compared.find((p) => p.importPath === path))
    .filter(Boolean) as GoPackage[];

  const loadingPaths = pkgPaths.filter(
    (path) => !compared.some((p) => p.importPath === path),
  );

  return (
    <div className="bg-slate-50/40 dark:bg-[#0b0e14] py-8 flex-1 transition-colors duration-300">
      <div className="container-scale max-w-6xl space-y-8">
        <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200/80 dark:border-[#30363d] p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#007D9C] dark:text-sky-400">
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
                three Go packages
              </strong>{" "}
              side by side to contrast stars, forks, dependencies, and official
              licenses.
            </p>
          </div>

          <CompareSearchInput
            pkgCount={pkgPaths.length}
            searchQuery={searchQuery}
            dropdownOpen={dropdownOpen}
            suggestions={suggestions}
            suggestionsLoading={suggestionsLoading}
            onChange={(q) => {
              setSearchQuery(q);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            onDropdownClose={() => setDropdownOpen(false)}
            onAddPackage={addPackage}
          />
        </div>

        {orderedCompared.length > 0 && (
          <CompareTable
            compared={orderedCompared}
            removePackage={removePackage}
            inspectPackage={inspectPackage}
          />
        )}

        {loadingPaths.length > 0 && (
          <div className="flex items-center justify-center gap-3 py-12 text-slate-400 dark:text-[#8b949e]">
            <Loader2 className="w-5 h-5 animate-spin text-[#00ADD8] dark:text-sky-400" />

            <span className="text-sm font-mono">
              {loadingPaths.length === 1
                ? `Fetching ${loadingPaths[0]}...`
                : `Fetching ${loadingPaths.length} packages...`}
            </span>
          </div>
        )}

        {orderedCompared.length === 0 && loadingPaths.length === 0 && (
          <CompareEmptyState onPreset={handlePreset} />
        )}
      </div>
    </div>
  );
}
