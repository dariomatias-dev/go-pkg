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
    icon: (
      <BookOpen className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
    ),
    cellCls:
      "p-4 leading-relaxed font-light text-slate-500 dark:text-[#8b949e]",
    render: (pkg) => <p className="line-clamp-4">{pkg.description}</p>,
  },
  {
    label: "GitHub Stars",
    icon: (
      <Star className="h-4 w-4 shrink-0 fill-[#00ADD8] stroke-[#006680] text-[#006680] dark:fill-sky-500 dark:stroke-sky-500 dark:text-sky-400" />
    ),
    cellCls:
      "p-4 font-mono font-bold text-base text-slate-900 dark:text-[#f0f6fc]",
    render: (pkg) => (
      <>
        {(pkg.stars || 0).toLocaleString()}{" "}
        <span className="font-sans text-[10px] font-medium text-slate-500 dark:text-[#8b949e]">
          stars
        </span>
      </>
    ),
  },
  {
    label: "Forks",
    icon: (
      <GitFork className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
    ),
    cellCls:
      "p-4 font-mono text-slate-700 dark:text-[#c9d1d9] text-sm font-semibold",
    render: (pkg) => (pkg.forks || 0).toLocaleString(),
  },
  {
    label: "Category",
    icon: (
      <Layers className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
    ),
    cellCls: "p-4 capitalize",
    render: (pkg) => (
      <span className="rounded-lg border border-sky-100 bg-sky-50 px-2.5 py-1 font-semibold text-[#00637c] dark:border-sky-900/30 dark:bg-sky-950/30 dark:text-sky-400">
        {pkg.category}
      </span>
    ),
  },
  {
    label: "License",
    icon: (
      <Shield className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
    ),
    cellCls: "p-4 font-mono font-bold text-slate-700 dark:text-[#c9d1d9]",
    render: (pkg) => (
      <span className="rounded border border-emerald-200/50 bg-emerald-50 px-2.5 py-1 text-[10px] text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400">
        {pkg.license}
      </span>
    ),
  },
  {
    label: "Version",
    icon: (
      <Milestone className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
    ),
    cellCls: "p-4",
    render: (pkg) => (
      <p className="font-mono text-xs font-bold text-slate-900 dark:text-[#f0f6fc]">
        {pkg.latestVersion}
      </p>
    ),
  },
  {
    label: "Direct Dependencies",
    cellCls: "p-4 select-all",
    render: (pkg) => (
      <div className="flex items-center space-x-2">
        <span className="font-mono font-semibold text-slate-900 dark:text-[#f0f6fc]">
          {pkg.dependenciesCount ?? 0}
        </span>
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-[#30363d]">
          <div
            className="h-full rounded-full bg-[#00ADD8] dark:bg-sky-500"
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
    cellCls:
      "p-4 font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10",
    render: (pkg) => (
      <>
        {pkg.importsCount ? pkg.importsCount.toLocaleString() : "N/A"}{" "}
        <span className="font-sans text-[9px] font-light text-slate-500 dark:text-[#8b949e]">
          repos
        </span>
      </>
    ),
  },
  {
    label: "Maintainer",
    icon: (
      <User className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
    ),
    cellCls: "p-4",
    render: (pkg) => (
      <p className="font-semibold text-slate-800 dark:text-[#c9d1d9]">
        {pkg.author}
      </p>
    ),
  },
  {
    label: "Last Update",
    icon: (
      <Calendar className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
    ),
    cellCls: "p-4 font-mono text-slate-500 dark:text-[#8b949e]",
    render: (pkg) => pkg.publishedAt,
  },
];
