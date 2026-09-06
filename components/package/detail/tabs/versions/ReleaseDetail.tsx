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
    <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-[#30363d] dark:bg-[#161b22]">
      {loading ? (
        <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-400 dark:text-[#8b949e]">
          <Loader2 className="h-4 w-4 animate-spin" />

          <span>Loading releases…</span>
        </div>
      ) : error ? (
        <p className="py-8 text-center text-sm text-rose-500 dark:text-rose-400">
          Failed to load releases.
        </p>
      ) : !selected ? (
        <p className="py-8 text-center text-sm text-slate-400 dark:text-[#8b949e]">
          Select a version
        </p>
      ) : release ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-[#30363d]">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-[#f0f6fc]">
                  {release.tag_name}
                </span>

                {release.name && release.name !== release.tag_name && (
                  <span className="text-sm text-slate-500 dark:text-[#8b949e]">
                    — {release.name}
                  </span>
                )}

                {release.prerelease && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold tracking-tight text-amber-700 uppercase dark:bg-amber-500/20 dark:text-amber-400">
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
              className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#007D9C] transition-colors hover:text-[#005F77] dark:text-sky-400 dark:hover:text-sky-300"
            >
              <ExternalLink className="h-3 w-3" />
              View on GitHub
            </a>
          </div>

          {release.body ? (
            <div className="custom-scrollbar max-h-96 overflow-auto">
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
                        className="mx-auto my-3 block max-w-full rounded-md shadow-sm"
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
        <div className="flex h-full flex-col items-center justify-center gap-2 py-8">
          <Tag className="h-5 w-5 text-slate-300 dark:text-[#30363d]" />

          <p className="text-center text-xs text-slate-400 dark:text-[#8b949e]">
            No release notes for{" "}
            <span className="font-mono font-semibold">{selected}</span>
          </p>
        </div>
      )}
    </div>
  );
}
