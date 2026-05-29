"use client";

import { ExternalLink, Loader2, Tag } from "lucide-react";
import Image from "next/image";

import { MarkdownRenderer } from "@/components/package/shared/MarkdownRenderer";
import type { GitHubRelease } from "@/lib/github/types";

function formatDate(iso: string | null): string {
  if (!iso) return "";

  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface ReleaseDetailProps {
  loading: boolean;
  error: boolean;
  selected: string;
  release: GitHubRelease | undefined;
}

export function ReleaseDetail({
  loading,
  error,
  selected,
  release,
}: ReleaseDetailProps) {
  return (
    <div className="flex-1 min-w-0 border border-slate-200 dark:border-[#30363d] rounded-lg bg-slate-50/50 dark:bg-[#161b22] p-4">
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 dark:text-[#8b949e] text-sm h-full justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />

          <span>Loading releases…</span>
        </div>
      ) : error ? (
        <p className="text-sm text-rose-500 dark:text-rose-400 text-center py-8">
          Failed to load releases.
        </p>
      ) : !selected ? (
        <p className="text-sm text-slate-400 dark:text-[#8b949e] text-center py-8">
          Select a version
        </p>
      ) : release ? (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap pb-3 border-b border-slate-100 dark:border-[#30363d]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-[#f0f6fc]">
                  {release.tag_name}
                </span>

                {release.name && release.name !== release.tag_name && (
                  <span className="text-sm text-slate-500 dark:text-[#8b949e]">
                    — {release.name}
                  </span>
                )}

                {release.prerelease && (
                  <span className="text-[9px] bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                    pre-release
                  </span>
                )}
              </div>

              {release.published_at && (
                <p className="text-[11px] text-slate-400 dark:text-[#8b949e]">
                  Published {formatDate(release.published_at)}
                </p>
              )}
            </div>

            <a
              href={release.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium text-[#007D9C] dark:text-sky-400 hover:text-[#005F77] dark:hover:text-sky-300 transition-colors shrink-0"
            >
              <ExternalLink className="w-3 h-3" />
              View on GitHub
            </a>
          </div>

          {release.body ? (
            <div className="overflow-auto max-h-96 custom-scrollbar">
              <MarkdownRenderer
                content={release.body}
                size="xs"
                useRehypeRaw
                extraComponents={{
                  img: ({ src, alt }) => {
                    if (!src || typeof src !== "string") return null;

                    return (
                      <Image
                        src={src}
                        alt={alt || "image"}
                        width={1200}
                        height={630}
                        className="my-3 block mx-auto max-w-full rounded-md shadow-sm"
                        style={{ height: "auto", width: "auto" }}
                      />
                    );
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-xs text-slate-400 dark:text-[#8b949e]">
              No release notes provided.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
          <Tag className="w-5 h-5 text-slate-300 dark:text-[#30363d]" />

          <p className="text-xs text-slate-400 dark:text-[#8b949e] text-center">
            No release notes for{" "}
            <span className="font-mono font-semibold">{selected}</span>
          </p>
        </div>
      )}
    </div>
  );
}
