"use client";

import { Clock, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  clearPackageHistory,
  getPackageHistorySnapshot,
  removeFromPackageHistory,
  subscribePackageHistory,
} from "@/lib/package-history";
import { encodeImportPath } from "@/lib/utils";

const EMPTY: string[] = [];

export function RecentPackages() {
  const history = useSyncExternalStore(
    subscribePackageHistory,
    getPackageHistorySnapshot,
    () => EMPTY,
  );

  if (history.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
      <h3 className="font-display mb-4 flex items-center justify-between border-b border-slate-100 pb-3 text-sm font-semibold tracking-tight text-slate-900 dark:border-[#30363d] dark:text-[#f0f6fc]">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-[#006680] dark:text-sky-400" />
          Recently Visited
        </span>

        <button
          onClick={clearPackageHistory}
          className="cursor-pointer text-[10px] font-bold text-slate-400 transition-colors hover:text-rose-500 dark:text-[#484f58] dark:hover:text-rose-400"
        >
          Clear
        </button>
      </h3>

      <div className="space-y-2.5">
        {history.map((importPath) => (
          <div
            key={importPath}
            className="group relative flex items-center justify-between rounded-lg border border-slate-100 p-2 transition-all hover:border-slate-200 hover:bg-slate-50 dark:border-[#30363d] dark:hover:border-slate-700 dark:hover:bg-[#21262d]"
          >
            <Link
              href={
                `/package/${encodeImportPath(importPath)}` as Route<`/package/${string}`>
              }
              className="min-w-0 flex-1 pr-2 after:absolute after:inset-0 after:content-['']"
            >
              <p className="truncate text-xs font-semibold text-slate-800 transition-colors group-hover:text-[#00ADD8] dark:text-[#c9d1d9] dark:group-hover:text-sky-400">
                {importPath.split("/").pop()}
              </p>

              <p className="truncate font-mono text-[10px] text-slate-500 dark:text-[#8b949e]">
                {importPath}
              </p>
            </Link>

            <button
              type="button"
              aria-label={`Remove ${importPath.split("/").pop()} from recently visited`}
              onClick={() => removeFromPackageHistory(importPath)}
              className="relative z-10 shrink-0 cursor-pointer rounded p-1 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-[#484f58] dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
