"use client";

import { Clock, X } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const history = useSyncExternalStore(
    subscribePackageHistory,
    getPackageHistorySnapshot,
    () => EMPTY,
  );

  if (history.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#161b22] rounded-xl p-5 border border-slate-200/60 dark:border-[#30363d] shadow-sm">
      <h3 className="font-display font-semibold text-slate-900 dark:text-[#f0f6fc] text-sm tracking-tight border-b border-slate-100 dark:border-[#30363d] pb-3 mb-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#007D9C] dark:text-sky-400" />
          Recently Visited
        </span>

        <button
          onClick={clearPackageHistory}
          className="text-[10px] font-bold text-slate-400 dark:text-[#484f58] hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          Clear
        </button>
      </h3>

      <div className="space-y-2.5">
        {history.map((importPath) => (
          <div
            key={importPath}
            onClick={() =>
              router.push(
                `/package/${encodeImportPath(importPath)}` as Route<`/package/${string}`>,
              )
            }
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#21262d] border border-slate-100 dark:border-[#30363d] hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-xs font-semibold text-slate-800 dark:text-[#c9d1d9] group-hover:text-[#00ADD8] dark:group-hover:text-sky-400 transition-colors truncate">
                {importPath.split("/").pop()}
              </p>

              <p className="text-[10px] font-mono text-slate-400 dark:text-[#8b949e] truncate">
                {importPath}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();

                removeFromPackageHistory(importPath);
              }}
              className="text-slate-300 dark:text-[#484f58] hover:text-rose-500 dark:hover:text-rose-400 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
