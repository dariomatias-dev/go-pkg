"use client";

import { ChevronLeft, ChevronRight, Loader2, Tag } from "lucide-react";

import type { GitHubRelease } from "@/lib/github/types";
import { cn } from "@/lib/utils";

function matchRelease(
  releases: GitHubRelease[],
  version: string,
): GitHubRelease | undefined {
  return releases.find(
    (r) =>
      r.tag_name === version ||
      r.tag_name === `v${version}` ||
      `v${r.tag_name}` === version,
  );
}

interface VersionListProps {
  versions: string[];
  loading: boolean;
  error: boolean;
  selected: string;
  latestVersion: string | undefined;
  releases: GitHubRelease[];
  releasesLoading: boolean;
  page: number;
  totalPages: number;
  onSelect: (ver: string) => void;
  onPageChange: (page: number) => void;
}

export function VersionList({
  versions,
  loading,
  error,
  selected,
  latestVersion,
  releases,
  releasesLoading,
  page,
  totalPages,
  onSelect,
  onPageChange,
}: VersionListProps) {
  return (
    <div className="w-full sm:w-44 sm:shrink-0 flex flex-col gap-1 pr-1">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-slate-400 dark:text-[#8b949e]">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-[11px] text-rose-500 dark:text-rose-400 text-center py-4">
          Failed to load versions.
        </p>
      ) : (
        versions.map((ver) => {
          const hasRelease = !releasesLoading && !!matchRelease(releases, ver);
          const isSelected = ver === selected;
          const isLatest = ver === latestVersion;

          return (
            <button
              key={ver}
              onClick={() => onSelect(ver)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all border cursor-pointer",
                isSelected
                  ? "border-[#00ADD8] dark:border-sky-500 bg-sky-50 dark:bg-sky-950/20 text-[#007D9C] dark:text-sky-400 font-bold"
                  : "border-slate-100 dark:border-[#30363d] text-slate-600 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#161b22] hover:border-slate-200 dark:hover:border-[#484f58]",
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="truncate">{ver}</span>

                <div className="flex items-center gap-1 shrink-0">
                  {isLatest && (
                    <span className="text-[8px] bg-[#00ADD8] text-white px-1 py-0.5 rounded uppercase font-bold tracking-tight">
                      latest
                    </span>
                  )}
                  {hasRelease && (
                    <Tag className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  )}
                </div>
              </div>
            </button>
          );
        })
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-[#30363d]">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || loading}
            className="p-1 rounded text-slate-400 dark:text-[#8b949e] hover:text-slate-700 dark:hover:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#21262d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-semibold text-slate-400 dark:text-[#8b949e] tabular-nums">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || loading}
            className="p-1 rounded text-slate-400 dark:text-[#8b949e] hover:text-slate-700 dark:hover:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#21262d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
