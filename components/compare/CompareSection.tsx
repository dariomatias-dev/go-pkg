"use client";

import type { GoPackage } from "@/types";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  GitFork,
  Layers,
  Milestone,
  Plus,
  Scale,
  Search,
  Shield,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { encodeImportPath } from "@/lib/utils";

const PRESETS = [
  {
    emoji: "🌐",
    title: "Popular Web Stack",
    desc: "Compare the Gin HTTP framework with the Gorm ORM from the Go ecosystem.",
    names: ["gin", "gorm"],
  },
  {
    emoji: "💻",
    title: "Robust CLI",
    desc: "Highlight the libraries behind popular tools like Cobra and Gorm.",
    names: ["cobra", "gorm"],
  },
  {
    emoji: "⚡",
    title: "Telemetry & Logging",
    desc: "Compare Uber's ultra-fast Zap logger with the Gin framework.",
    names: ["zap", "gin"],
  },
];

const COMPARE_ROWS: {
  label: string;
  icon?: React.ReactNode;
  cellCls: string;
  render: (pkg: GoPackage) => React.ReactNode;
}[] = [
  {
    label: "Description",
    icon: <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />,
    cellCls: "p-4 leading-relaxed font-light text-slate-500",
    render: (pkg) => <p className="line-clamp-4">{pkg.description}</p>,
  },
  {
    label: "GitHub Stars",
    icon: (
      <Star className="w-4 h-4 text-[#007D9C] shrink-0 fill-[#00ADD8] stroke-[#007D9C]" />
    ),
    cellCls: "p-4 font-mono font-bold text-base text-slate-900",
    render: (pkg) => (
      <>
        {(pkg.stars || 0).toLocaleString()}{" "}
        <span className="text-[10px] text-slate-400 font-sans font-medium">
          stars
        </span>
      </>
    ),
  },
  {
    label: "Forks",
    icon: <GitFork className="w-4 h-4 text-slate-400 shrink-0" />,
    cellCls: "p-4 font-mono text-slate-700 text-sm font-semibold",
    render: (pkg) => (pkg.forks || 0).toLocaleString(),
  },
  {
    label: "Category",
    icon: <Layers className="w-4 h-4 text-slate-400 shrink-0" />,
    cellCls: "p-4 capitalize",
    render: (pkg) => (
      <span className="bg-sky-50 text-[#00637c] font-semibold py-1 px-2.5 rounded-lg border border-sky-100">
        {pkg.category}
      </span>
    ),
  },
  {
    label: "License",
    icon: <Shield className="w-4 h-4 text-slate-400 shrink-0" />,
    cellCls: "p-4 font-mono font-bold text-slate-700",
    render: (pkg) => (
      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 py-1 px-2.5 rounded text-[10px]">
        {pkg.license}
      </span>
    ),
  },
  {
    label: "Version",
    icon: <Milestone className="w-4 h-4 text-slate-400 shrink-0" />,
    cellCls: "p-4",
    render: (pkg) => (
      <p className="font-bold text-slate-900 font-mono text-xs">
        {pkg.latestVersion}
      </p>
    ),
  },
  {
    label: "Direct Dependencies",
    cellCls: "p-4 select-all",
    render: (pkg) => (
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-slate-900 font-mono">
          {pkg.dependenciesCount ?? 0}
        </span>
        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#00ADD8] h-full rounded-full"
            style={{
              width: `${Math.min((pkg.dependenciesCount ?? 0) * 8, 100)}%`,
            }}
          />
        </div>
      </div>
    ),
  },
  {
    label: "Imported By",
    cellCls: "p-4 font-mono font-bold text-emerald-600 bg-emerald-50/20",
    render: (pkg) => (
      <>
        {pkg.importsCount ? pkg.importsCount.toLocaleString() : "N/A"}{" "}
        <span className="text-[9px] font-sans font-light text-slate-400">
          repos
        </span>
      </>
    ),
  },
  {
    label: "Maintainer",
    icon: <User className="w-4 h-4 text-slate-400 shrink-0" />,
    cellCls: "p-4",
    render: (pkg) => (
      <p className="font-semibold text-slate-800">{pkg.author}</p>
    ),
  },
  {
    label: "Last Update",
    icon: <Calendar className="w-4 h-4 text-slate-400 shrink-0" />,
    cellCls: "p-4 font-mono text-slate-400",
    render: (pkg) => pkg.publishedAt,
  },
];

function CompareTable({
  compared,
  removePackage,
  inspectPackage,
}: {
  compared: GoPackage[];
  removePackage: (importPath: string) => void;
  inspectPackage: (importPath: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed text-left min-w-175 font-sans">
          <thead>
            <tr className="bg-slate-50/60 border-b border-slate-200">
              <th className="p-6 text-xs uppercase font-bold tracking-widest text-slate-400 w-64 border-r border-slate-100 bg-slate-50/30">
                Technical Attribute
              </th>
              {compared.map((pkg, index) => (
                <th
                  key={pkg.importPath}
                  className="p-6 relative text-slate-800"
                >
                  <div className="space-y-2">
                    <button
                      onClick={() => removePackage(pkg.importPath)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all p-1.5 rounded-full cursor-pointer"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="inline-block bg-sky-50 text-[#007D9C] font-mono text-[10px] uppercase font-bold py-0.5 px-2 rounded-full mb-1 border border-sky-100">
                      Module {index + 1}
                    </span>
                    <h3 className="font-display font-extrabold text-xl leading-none text-slate-900 tracking-tight">
                      {pkg.name}
                    </h3>
                    <p
                      className="font-mono text-[10px] text-slate-400 truncate"
                      title={pkg.importPath}
                    >
                      {pkg.importPath}
                    </p>
                  </div>
                </th>
              ))}
              {compared.length < 3 && (
                <th className="p-6 text-center text-slate-400 border-l border-slate-100 bg-slate-50/20 font-light text-xs">
                  <div className="py-8 flex flex-col items-center justify-center space-y-2">
                    <Scale className="w-8 h-8 text-slate-300 stroke-[1.5] animate-pulse" />
                    <p>Free Slot ({3 - compared.length} remaining)</p>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {COMPARE_ROWS.map(({ label, icon, cellCls, render }) => (
              <tr key={label} className="hover:bg-slate-50/30">
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/10 border-r border-slate-100">
                  {icon ? (
                    <div className="flex items-center gap-2">
                      {icon}
                      <span>{label}</span>
                    </div>
                  ) : (
                    label
                  )}
                </td>
                {compared.map((pkg) => (
                  <td key={pkg.importPath} className={cellCls}>
                    {render(pkg)}
                  </td>
                ))}
                {compared.length < 3 && <td className="bg-slate-50/5" />}
              </tr>
            ))}
            <tr className="bg-slate-50/40">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/25 border-r border-slate-100">
                Actions
              </td>
              {compared.map((pkg) => (
                <td key={pkg.importPath} className="p-4">
                  <button
                    onClick={() => inspectPackage(pkg.importPath)}
                    className="w-full text-center bg-[#007D9C] hover:bg-[#005a71] text-white text-[11px] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <span>View Documentation</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              ))}
              {compared.length < 3 && <td className="bg-slate-50/5" />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareEmptyState({
  onPreset,
}: {
  onPreset: (names: string[]) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 md:p-14 text-center space-y-6 shadow-sm select-none">
      <div className="max-w-md mx-auto space-y-4 font-sans">
        <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto border border-sky-100">
          <Scale className="w-8 h-8 text-[#007D9C]" />
        </div>
        <h2 className="font-display font-extrabold text-xl text-slate-800 tracking-tight">
          Comparator is empty
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
          Add Go modules using the search bar above, or choose one of the
          recommended presets below:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-xs font-sans">
        {PRESETS.map(({ emoji, title, desc, names }) => (
          <div
            key={title}
            onClick={() => onPreset(names)}
            className="bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-200/60 p-4 rounded-xl text-left cursor-pointer transition-all hover:shadow-sm"
          >
            <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <span className="text-[15px]">{emoji}</span> {title}
            </p>
            <p className="text-[10px] text-slate-400 mb-3">{desc}</p>
            <span className="text-[10px] text-[#007D9C] font-semibold flex items-center gap-1">
              Load Preset →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompareSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<GoPackage[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [compared, setCompared] = useState<GoPackage[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem("gopkg_compared");

      return stored ? (JSON.parse(stored) as GoPackage[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("gopkg_compared", JSON.stringify(compared));
  }, [compared]);

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
    if (compared.some((cp) => cp.importPath === pkg.importPath)) return;
    if (compared.length >= 3) return;

    setCompared((prev) => [...prev, pkg]);
    setSearchQuery("");
    setDropdownOpen(false);
  };

  const removePackage = (importPath: string) => {
    setCompared((prev) => prev.filter((pkg) => pkg.importPath !== importPath));
  };

  const handlePreset = (names: string[]) => {
    compared.forEach((cp) => removePackage(cp.importPath));

    const pathMap: Record<string, string> = {
      gin: "github.com/gin-gonic/gin",
      gorm: "github.com/gorm/gorm",
      cobra: "github.com/spf13/cobra",
      zap: "go.uber.org/zap",
    };

    names.forEach((name) => {
      const importPath = pathMap[name] || name;

      fetch(`/api/package-info?module=${encodeURIComponent(importPath)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.pkg) addPackage(data.pkg);
        })
        .catch(() => {});
    });
  };

  const inspectPackage = (importPath: string) => {
    router.push(`/package/${encodeImportPath(importPath)}` as Route<`/package/${string}`>);
  };

  return (
    <div className="bg-slate-50/40 py-8 flex-1">
      <div className="container-scale max-w-6xl space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#007D9C]">
              <Scale className="w-6 h-6" />

              <span className="font-display font-medium text-xs uppercase tracking-widest bg-sky-50 text-[#007D9C] px-3 py-1 rounded-full border border-sky-100">
                Decision Matrix
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">
              Go Package Comparator
            </h1>

            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-light">
              Choose up to{" "}
              <strong className="font-semibold text-slate-700">
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
                className="w-full bg-slate-50 hover:bg-white text-slate-800 placeholder-slate-400 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-[#00ADD8] focus:ring-2 focus:ring-[#00ADD8]/20 focus:outline-none py-3 pl-11 pr-10 rounded-xl text-xs sm:text-sm font-sans transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              />

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none p-1 transition-colors cursor-pointer rounded-full hover:bg-slate-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute top-14 left-0 right-0 max-h-60 overflow-y-auto bg-white border border-slate-200 shadow-xl rounded-xl z-50 divide-y divide-slate-50 animate-fade-in font-sans">
                {suggestionsLoading && suggestions.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400 font-mono animate-pulse">
                    Loading suggestions...
                  </p>
                ) : suggestions.length > 0 ? (
                  suggestions.map((pkg) => (
                    <button
                      key={pkg.importPath}
                      onClick={() => addPackage(pkg)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors cursor-pointer text-slate-700"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-800 truncate">
                          {pkg.name}
                        </p>

                        <p className="font-mono text-[10px] text-slate-400 truncate">
                          {pkg.importPath}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 text-[#007D9C] shrink-0">
                        <Star className="w-3.5 h-3.5 fill-[#00ADD8] stroke-[#00ADD8]" />

                        <span className="font-semibold text-slate-700">
                          {(pkg.stars || 0).toLocaleString()}
                        </span>

                        <Plus className="w-3.5 h-3.5 ml-1 bg-sky-50 text-[#007D9C] rounded-full p-0.5" />
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-center text-xs text-slate-400">
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
