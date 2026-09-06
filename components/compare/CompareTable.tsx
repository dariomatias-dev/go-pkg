"use client";

import { ExternalLink, Info, Loader2, Plus, Trash2 } from "lucide-react";

import { COMPARE_ROWS } from "@/components/compare/data/compareRows";
import { cn } from "@/lib/utils";
import type { GoPackage } from "@/types";

interface CompareTableProps {
  pkgPaths: string[];
  compared: GoPackage[];
  removePackage: (importPath: string) => void;
  inspectPackage: (importPath: string) => void;
}

export function CompareTable({
  pkgPaths,
  compared,
  removePackage,
  inspectPackage,
}: CompareTableProps) {
  const maxPackages = 3;
  const emptySlots = maxPackages - pkgPaths.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white font-sans shadow-sm select-none dark:border-[#30363d] dark:bg-[#0d1117]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-175 table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60 dark:border-[#30363d] dark:bg-[#161b22]">
              <th className="w-44 border-r border-slate-100 bg-slate-50/30 p-6 text-xs font-black tracking-[0.15em] text-slate-400 uppercase dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#8b949e]">
                <span>Technical Attributes</span>
              </th>

              {pkgPaths.map((path, index) => {
                const pkg = compared.find((p) => p.importPath === path);
                const loading = !pkg;
                const displayName = pkg?.name ?? path.split("/").pop() ?? path;

                return (
                  <th
                    key={`${path}-${index}`}
                    className="group relative border-r border-slate-100 p-6 text-slate-800 last:border-r-0 dark:border-[#30363d] dark:text-[#f0f6fc]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="mb-1 inline-block rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#007D9C] uppercase dark:border-sky-900/30 dark:bg-sky-950/30 dark:text-sky-400">
                          Package {index + 1}
                        </span>

                        <button
                          onClick={() => removePackage(path)}
                          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display truncate text-xl leading-none font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-[#00ADD8] dark:text-[#f0f6fc]">
                            {displayName}
                          </h3>
                          {loading && (
                            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#00ADD8]" />
                          )}
                        </div>
                        <p className="mt-1 truncate font-mono text-[10px] text-slate-400 dark:text-slate-500">
                          {path}
                        </p>
                      </div>
                    </div>
                  </th>
                );
              })}

              {Array.from({ length: emptySlots }).map((_, i) => (
                <th
                  key={`empty-head-${i}`}
                  className="border-r border-slate-100 bg-slate-50/10 p-6 text-left last:border-r-0 dark:border-[#30363d] dark:bg-[#0d1117]/50"
                >
                  <div className="flex flex-col gap-2 text-slate-300 dark:text-[#30363d]">
                    <Plus className="h-6 w-6 rounded-md border-2 border-dashed border-slate-200 stroke-[2.5] p-1 dark:border-slate-800" />
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-50">
                      Empty Slot
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700 dark:divide-[#30363d] dark:text-[#c9d1d9]">
            {COMPARE_ROWS.map(({ label, icon, cellCls, render }) => (
              <tr
                key={label}
                className="group transition-colors hover:bg-slate-50/30 dark:hover:bg-white/1"
              >
                <td className="border-r border-slate-100 bg-slate-50/10 p-4 font-bold text-slate-600 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#8b949e]">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 transition-colors group-hover:text-[#00ADD8] dark:text-slate-500">
                      {icon}
                    </span>
                    <span>{label}</span>
                  </div>
                </td>

                {pkgPaths.map((path) => {
                  const pkg = compared.find((p) => p.importPath === path);

                  return pkg ? (
                    <td
                      key={`${label}-${path}`}
                      className={cn(
                        cellCls,
                        "border-r border-slate-100 p-4 text-left font-medium last:border-r-0 dark:border-[#30363d]",
                      )}
                    >
                      {render(pkg)}
                    </td>
                  ) : (
                    <td
                      key={`${label}-${path}-loading`}
                      className="border-r border-slate-100 p-4 last:border-r-0 dark:border-[#30363d]"
                    >
                      <div className="h-3.5 w-24 animate-pulse rounded bg-slate-100 dark:bg-[#21262d]" />
                    </td>
                  );
                })}

                {Array.from({ length: emptySlots }).map((_, i) => (
                  <td
                    key={`empty-cell-${i}`}
                    className="border-r border-slate-100 bg-slate-50/5 last:border-r-0 dark:border-[#30363d] dark:bg-transparent"
                  />
                ))}
              </tr>
            ))}

            <tr className="bg-slate-50/40 dark:bg-[#161b22]/20">
              <td className="border-r border-slate-100 bg-slate-50/25 p-4 font-bold text-slate-500 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#8b949e]">
                <div className="flex items-center gap-3">
                  <Info className="h-4 w-4 text-slate-400" />
                  <span>Package Actions</span>
                </div>
              </td>

              {pkgPaths.map((path) => {
                const pkg = compared.find((p) => p.importPath === path);

                return pkg ? (
                  <td
                    key={`actions-${path}`}
                    className="border-r border-slate-100 p-4 last:border-r-0 dark:border-[#30363d]"
                  >
                    <button
                      onClick={() => inspectPackage(pkg.importPath)}
                      className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#007D9C] px-3 py-2 text-center text-[11px] font-bold text-white shadow-sm transition-all hover:bg-[#005a71] dark:bg-sky-600 dark:hover:bg-sky-700"
                    >
                      <span>Details</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </button>
                  </td>
                ) : (
                  <td
                    key={`actions-${path}-loading`}
                    className="border-r border-slate-100 p-4 last:border-r-0 dark:border-[#30363d]"
                  >
                    <div className="h-7 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-[#21262d]" />
                  </td>
                );
              })}

              {Array.from({ length: emptySlots }).map((_, i) => (
                <td
                  key={`empty-action-${i}`}
                  className="border-r border-slate-100 last:border-r-0 dark:border-[#30363d]"
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
