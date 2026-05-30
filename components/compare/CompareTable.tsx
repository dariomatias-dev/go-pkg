"use client";

import { ExternalLink, Info, Plus, Trash2 } from "lucide-react";

import { COMPARE_ROWS } from "@/components/compare/data/compareRows";
import { cn } from "@/lib/utils";
import type { GoPackage } from "@/types";

interface CompareTableProps {
  compared: GoPackage[];
  removePackage: (importPath: string) => void;
  inspectPackage: (importPath: string) => void;
}

export function CompareTable({
  compared,
  removePackage,
  inspectPackage,
}: CompareTableProps) {
  const maxPackages = 3;

  return (
    <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200/80 dark:border-[#30363d] shadow-sm overflow-hidden select-none font-sans">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed text-left min-w-175">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-[#161b22] border-b border-slate-200 dark:border-[#30363d]">
              <th className="p-6 text-xs uppercase font-black tracking-[0.15em] text-slate-400 dark:text-[#8b949e] w-64 border-r border-slate-100 dark:border-[#30363d] bg-slate-50/30 dark:bg-[#0d1117]">
                <span>Technical Attributes</span>
              </th>

              {compared.map((pkg, index) => (
                <th
                  key={`${pkg.importPath}-${index}`}
                  className="p-6 relative text-slate-800 dark:text-[#f0f6fc] border-r border-slate-100 dark:border-[#30363d] last:border-r-0 group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="inline-block bg-sky-50 dark:bg-sky-950/30 text-[#007D9C] dark:text-sky-400 font-mono text-[10px] uppercase font-bold py-0.5 px-2 rounded-full mb-1 border border-sky-100 dark:border-sky-900/30">
                        Module {index + 1}
                      </span>

                      <button
                        onClick={() => removePackage(pkg.importPath)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-display font-extrabold text-xl leading-none text-slate-900 dark:text-[#f0f6fc] tracking-tight group-hover:text-[#00ADD8] transition-colors truncate">
                        {pkg.name}
                      </h3>
                      <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1">
                        {pkg.importPath}
                      </p>
                    </div>
                  </div>
                </th>
              ))}

              {Array.from({ length: maxPackages - compared.length }).map(
                (_, i) => (
                  <th
                    key={`empty-head-${i}`}
                    className="p-6 text-left border-r border-slate-100 dark:border-[#30363d] last:border-r-0 bg-slate-50/10 dark:bg-[#0d1117]/50"
                  >
                    <div className="flex flex-col gap-2 text-slate-300 dark:text-[#30363d]">
                      <Plus className="w-6 h-6 stroke-[2.5] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-md p-1" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
                        Empty Slot
                      </span>
                    </div>
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[#30363d] text-xs text-slate-700 dark:text-[#c9d1d9]">
            {COMPARE_ROWS.map(({ label, icon, cellCls, render }) => (
              <tr
                key={label}
                className="group hover:bg-slate-50/30 dark:hover:bg-white/1 transition-colors"
              >
                <td className="p-4 font-bold text-slate-600 dark:text-[#8b949e] bg-slate-50/10 dark:bg-[#0d1117] border-r border-slate-100 dark:border-[#30363d]">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 dark:text-slate-500 group-hover:text-[#00ADD8] transition-colors">
                      {icon}
                    </span>
                    <span>{label}</span>
                  </div>
                </td>

                {compared.map((pkg) => (
                  <td
                    key={`${label}-${pkg.importPath}`}
                    className={cn(
                      cellCls,
                      "p-4 text-left border-r border-slate-100 dark:border-[#30363d] last:border-r-0 font-medium",
                    )}
                  >
                    {render(pkg)}
                  </td>
                ))}

                {Array.from({ length: maxPackages - compared.length }).map(
                  (_, i) => (
                    <td
                      key={`empty-cell-${i}`}
                      className="border-r border-slate-100 dark:border-[#30363d] last:border-r-0 bg-slate-50/5 dark:bg-transparent"
                    />
                  ),
                )}
              </tr>
            ))}

            <tr className="bg-slate-50/40 dark:bg-[#161b22]/20">
              <td className="p-4 font-bold text-slate-500 dark:text-[#8b949e] bg-slate-50/25 dark:bg-[#0d1117] border-r border-slate-100 dark:border-[#30363d]">
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>Package Actions</span>
                </div>
              </td>

              {compared.map((pkg) => (
                <td
                  key={`actions-${pkg.importPath}`}
                  className="p-4 border-r border-slate-100 dark:border-[#30363d] last:border-r-0"
                >
                  <button
                    onClick={() => inspectPackage(pkg.importPath)}
                    className="w-full text-center bg-[#007D9C] dark:bg-sky-600 hover:bg-[#005a71] dark:hover:bg-sky-700 text-white text-[11px] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Details</span>

                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </button>
                </td>
              ))}

              {Array.from({ length: maxPackages - compared.length }).map(
                (_, i) => (
                  <td
                    key={`empty-action-${i}`}
                    className="border-r border-slate-100 dark:border-[#30363d] last:border-r-0"
                  />
                ),
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
