"use client";

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

  return (
    <div className="flex-1 bg-slate-50/40 py-8 transition-colors duration-300 dark:bg-[#0b0e14]">
      <div className="container-scale max-w-6xl space-y-8">
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8 dark:border-[#30363d] dark:bg-[#0d1117]">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#007D9C] dark:text-sky-400">
              <span className="font-display rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium tracking-widest text-[#007D9C] uppercase dark:border-sky-900/30 dark:bg-sky-950/30 dark:text-sky-400">
                Decision Matrix
              </span>
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-[#f0f6fc]">
              Go Package Comparator
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed font-light text-slate-500 dark:text-[#8b949e]">
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

        {pkgPaths.length > 0 ? (
          <CompareTable
            pkgPaths={pkgPaths}
            compared={orderedCompared}
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
