"use client";

import { ExternalLink, Scale, Trash2 } from "lucide-react";

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
  return (
    <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200/80 dark:border-[#30363d] shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed text-left min-w-175 font-sans">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-[#161b22] border-b border-slate-200 dark:border-[#30363d]">
              <th
                key="label"
                className="p-6 text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-[#8b949e] w-64 border-r border-slate-100 dark:border-[#30363d] bg-slate-50/30 dark:bg-[#0d1117]"
              >
                Technical Attribute
              </th>

              {compared.map((pkg, index) => (
                <th
                  key={`${pkg.importPath}-${index}`}
                  className="p-6 relative text-slate-800 dark:text-[#f0f6fc] border-r border-slate-100 dark:border-[#30363d] last:border-r-0"
                >
                  <div className="space-y-2">
                    <button
                      onClick={() => removePackage(pkg.importPath)}
                      className="absolute top-4 right-4 text-slate-400 dark:text-[#8b949e] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all p-1.5 rounded-full cursor-pointer"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <span className="inline-block bg-sky-50 dark:bg-sky-950/30 text-[#007D9C] dark:text-sky-400 font-mono text-[10px] uppercase font-bold py-0.5 px-2 rounded-full mb-1 border border-sky-100 dark:border-sky-900/30">
                      Module {index + 1}
                    </span>

                    <h3 className="font-display font-extrabold text-xl leading-none text-slate-900 dark:text-[#f0f6fc] tracking-tight">
                      {pkg.name}
                    </h3>

                    <p
                      className="font-mono text-[10px] text-slate-400 dark:text-[#8b949e] truncate"
                      title={pkg.importPath}
                    >
                      {pkg.importPath}
                    </p>
                  </div>
                </th>
              ))}

              {compared.length < 3 && (
                <th
                  key="empty-slot"
                  className="p-6 text-center text-slate-400 dark:text-[#484f58] border-l border-slate-100 dark:border-[#30363d] bg-slate-50/20 dark:bg-[#0d1117] font-light text-xs"
                >
                  <div className="py-8 flex flex-col items-center justify-center space-y-2">
                    <Scale className="w-8 h-8 text-slate-300 dark:text-[#30363d] stroke-[1.5] animate-pulse" />
                    <p>Free Slot ({3 - compared.length} remaining)</p>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[#30363d] text-xs text-slate-700">
            {COMPARE_ROWS.map(({ label, icon, cellCls, render }) => (
              <tr
                key={label}
                className="hover:bg-slate-50/30 dark:hover:bg-[#161b22]/50"
              >
                <td className="p-4 font-semibold text-slate-600 dark:text-[#8b949e] bg-slate-50/10 dark:bg-[#0d1117] border-r border-slate-100 dark:border-[#30363d]">
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
                  <td
                    key={`${label}-${pkg.importPath}`}
                    className={cn(
                      cellCls,
                      "border-r border-slate-100 dark:border-[#30363d] last:border-r-0",
                    )}
                  >
                    {render(pkg)}
                  </td>
                ))}

                {compared.length < 3 && (
                  <td className="bg-slate-50/5 dark:bg-transparent" />
                )}
              </tr>
            ))}

            <tr className="bg-slate-50/40 dark:bg-[#0d1117]">
              <td className="p-4 font-semibold text-slate-600 dark:text-[#8b949e] bg-slate-50/25 dark:bg-[#0d1117] border-r border-slate-100 dark:border-[#30363d]">
                Actions
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
                    <span>View Documentation</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              ))}

              {compared.length < 3 && (
                <td className="bg-slate-50/5 dark:bg-transparent" />
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
