import {
  BookOpen,
  Calendar,
  GitFork,
  Layers,
  Milestone,
  Shield,
  Star,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

import type { GoPackage } from "@/types";

export interface CompareRow {
  label: string;
  icon?: ReactNode;
  cellCls: string;
  render: (pkg: GoPackage) => ReactNode;
}

export const COMPARE_ROWS: CompareRow[] = [
  {
    label: "Description",
    icon: <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />,
    cellCls: "p-4 leading-relaxed font-light text-slate-500 dark:text-[#8b949e]",
    render: (pkg) => <p className="line-clamp-4">{pkg.description}</p>,
  },
  {
    label: "GitHub Stars",
    icon: (
      <Star className="w-4 h-4 text-[#007D9C] dark:text-sky-400 shrink-0 fill-[#00ADD8] dark:fill-sky-500 stroke-[#007D9C] dark:stroke-sky-500" />
    ),
    cellCls: "p-4 font-mono font-bold text-base text-slate-900 dark:text-[#f0f6fc]",
    render: (pkg) => (
      <>
        {(pkg.stars || 0).toLocaleString()}{" "}
        <span className="text-[10px] text-slate-400 dark:text-[#8b949e] font-sans font-medium">
          stars
        </span>
      </>
    ),
  },
  {
    label: "Forks",
    icon: <GitFork className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />,
    cellCls: "p-4 font-mono text-slate-700 dark:text-[#c9d1d9] text-sm font-semibold",
    render: (pkg) => (pkg.forks || 0).toLocaleString(),
  },
  {
    label: "Category",
    icon: <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />,
    cellCls: "p-4 capitalize",
    render: (pkg) => (
      <span className="bg-sky-50 dark:bg-sky-950/30 text-[#00637c] dark:text-sky-400 font-semibold py-1 px-2.5 rounded-lg border border-sky-100 dark:border-sky-900/30">
        {pkg.category}
      </span>
    ),
  },
  {
    label: "License",
    icon: <Shield className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />,
    cellCls: "p-4 font-mono font-bold text-slate-700 dark:text-[#c9d1d9]",
    render: (pkg) => (
      <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 py-1 px-2.5 rounded text-[10px]">
        {pkg.license}
      </span>
    ),
  },
  {
    label: "Version",
    icon: <Milestone className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />,
    cellCls: "p-4",
    render: (pkg) => (
      <p className="font-bold text-slate-900 dark:text-[#f0f6fc] font-mono text-xs">
        {pkg.latestVersion}
      </p>
    ),
  },
  {
    label: "Direct Dependencies",
    cellCls: "p-4 select-all",
    render: (pkg) => (
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-slate-900 dark:text-[#f0f6fc] font-mono">
          {pkg.dependenciesCount ?? 0}
        </span>
        <div className="w-20 bg-slate-100 dark:bg-[#30363d] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#00ADD8] dark:bg-sky-500 h-full rounded-full"
            style={{ width: `${Math.min((pkg.dependenciesCount ?? 0) * 8, 100)}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    label: "Imported By",
    cellCls:
      "p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10",
    render: (pkg) => (
      <>
        {pkg.importsCount ? pkg.importsCount.toLocaleString() : "N/A"}{" "}
        <span className="text-[9px] font-sans font-light text-slate-400 dark:text-[#8b949e]">
          repos
        </span>
      </>
    ),
  },
  {
    label: "Maintainer",
    icon: <User className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />,
    cellCls: "p-4",
    render: (pkg) => (
      <p className="font-semibold text-slate-800 dark:text-[#c9d1d9]">{pkg.author}</p>
    ),
  },
  {
    label: "Last Update",
    icon: <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />,
    cellCls: "p-4 font-mono text-slate-400 dark:text-[#8b949e]",
    render: (pkg) => pkg.publishedAt,
  },
];
