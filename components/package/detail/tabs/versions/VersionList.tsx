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
    <div className="flex w-full flex-col gap-1 pr-1 sm:w-44 sm:shrink-0">
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-slate-400 dark:text-[#8b949e]">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : error ? (
        <p className="py-4 text-center text-[11px] text-rose-500 dark:text-rose-400">
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
                "w-full cursor-pointer rounded-lg border px-3 py-2 text-left font-mono text-xs transition-all",
                isSelected
                  ? "border-[#00ADD8] bg-sky-50 font-bold text-[#006680] dark:border-sky-500 dark:bg-sky-950/20 dark:text-sky-400"
                  : "border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:border-[#30363d] dark:text-[#8b949e] dark:hover:border-[#484f58] dark:hover:bg-[#161b22]",
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="truncate">{ver}</span>

                <div className="flex shrink-0 items-center gap-1">
                  {isLatest && (
                    <span className="rounded bg-[#006680] px-1 py-0.5 text-[8px] font-bold tracking-tight text-white uppercase">
                      latest
                    </span>
                  )}
                  {hasRelease && (
                    <Tag className="h-2.5 w-2.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                  )}
                </div>
              </div>
            </button>
          );
        })
      )}

      {totalPages > 1 && (
        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-[#30363d]">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || loading}
            className="cursor-pointer rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-[#8b949e] dark:hover:bg-[#21262d] dark:hover:text-[#c9d1d9]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <span className="text-[10px] font-semibold text-slate-400 tabular-nums dark:text-[#8b949e]">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || loading}
            className="cursor-pointer rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-[#8b949e] dark:hover:bg-[#21262d] dark:hover:text-[#c9d1d9]"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
