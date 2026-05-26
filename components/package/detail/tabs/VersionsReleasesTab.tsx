"use client";

import { ExternalLink, GitBranch, Loader2, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/package/shared/CodeBlock";
import type { GitHubRelease } from "@/lib/github/types";

interface VersionsReleasesTabProps {
  importPath: string;
  versions: string[] | undefined;
  latestVersion: string | undefined;
}

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

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ReleaseBody({ body }: { body: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-base font-bold text-slate-900 dark:text-[#f0f6fc] mt-4 mb-2 border-b border-slate-100 dark:border-[#30363d] pb-1">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-semibold text-slate-800 dark:text-[#f0f6fc] mt-3 mb-1.5">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xs font-semibold text-slate-700 dark:text-[#c9d1d9] mt-2.5 mb-1">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-xs text-slate-600 dark:text-[#c9d1d9] leading-relaxed mb-2">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-4 mb-2 text-xs text-slate-600 dark:text-[#c9d1d9] space-y-0.5">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-4 mb-2 text-xs text-slate-600 dark:text-[#c9d1d9] space-y-0.5">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed text-xs text-slate-600 dark:text-[#c9d1d9]">
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[#00ADD8] dark:border-sky-600 bg-sky-50/15 dark:bg-sky-950/10 pl-3 py-1 my-2 rounded-r text-slate-700 dark:text-[#c9d1d9] italic text-xs">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ADD8] dark:text-sky-400 hover:text-[#007D9C] dark:hover:text-sky-300 underline underline-offset-2 decoration-[#00ADD8]/40 text-xs transition-colors"
          >
            {children}
          </a>
        ),
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";
          const codeString = String(children).replace(/\n$/, "");
          const isInline = !className && !codeString.includes("\n");

          if (!isInline) {
            return (
              <CodeBlock code={codeString} language={language || "text"} />
            );
          }

          return (
            <code className="bg-slate-100 dark:bg-[#161b22] text-slate-800 dark:text-[#e6edf3] text-[11px] px-1.5 py-0.5 rounded font-mono font-semibold">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <div className="my-2 dark:text-[#e6edf3]">{children}</div>
        ),
      }}
    >
      {body}
    </ReactMarkdown>
  );
}

export function VersionsReleasesTab({
  importPath,
  versions,
  latestVersion,
}: VersionsReleasesTabProps) {
  const [selected, setSelected] = useState<string>(latestVersion ?? "");
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/package-releases?importPath=${encodeURIComponent(importPath)}`)
      .then((r) => r.json())
      .then((d: { releases?: GitHubRelease[] }) =>
        setReleases(d.releases ?? []),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [importPath]);

  const versionList =
    versions && versions.length > 0
      ? versions
      : latestVersion
        ? [latestVersion]
        : [];

  const activeRelease = selected ? matchRelease(releases, selected) : undefined;

  return (
    <div className="animate-fade-in space-y-4">
      <h3 className="font-display font-semibold text-slate-800 dark:text-[#f0f6fc] text-base border-b border-slate-100 dark:border-[#30363d] pb-2 flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-[#007D9C] dark:text-sky-400" />
        Versions &amp; Releases
      </h3>

      <div className="flex gap-4 min-h-64">
        <div className="w-44 shrink-0 flex flex-col gap-1 overflow-y-auto max-h-120 pr-1 custom-scrollbar">
          {versionList.map((ver) => {
            const hasRelease = !!matchRelease(releases, ver);
            const isSelected = ver === selected;
            const isLatest = ver === latestVersion;

            return (
              <button
                key={ver}
                onClick={() => setSelected(ver)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all border ${
                  isSelected
                    ? "border-[#00ADD8] dark:border-sky-500 bg-sky-50 dark:bg-sky-950/20 text-[#007D9C] dark:text-sky-400 font-bold"
                    : "border-slate-100 dark:border-[#30363d] text-slate-600 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#161b22] hover:border-slate-200 dark:hover:border-[#484f58]"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate">{ver}</span>

                  <div className="flex items-center gap-1 shrink-0">
                    {isLatest && (
                      <span className="text-[8px] bg-[#00ADD8] text-white px-1 py-0.5 rounded uppercase font-bold tracking-tight">
                        latest
                      </span>
                    )}
                    {!loading && hasRelease && (
                      <Tag className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-w-0 border border-slate-200 dark:border-[#30363d] rounded-lg bg-slate-50/50 dark:bg-[#161b22] p-4">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 dark:text-[#8b949e] text-sm h-full justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading releases…</span>
            </div>
          ) : !selected ? (
            <p className="text-sm text-slate-400 dark:text-[#8b949e] text-center py-8">
              Select a version
            </p>
          ) : activeRelease ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap pb-3 border-b border-slate-100 dark:border-[#30363d]">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-slate-800 dark:text-[#f0f6fc]">
                      {activeRelease.tag_name}
                    </span>

                    {activeRelease.name &&
                      activeRelease.name !== activeRelease.tag_name && (
                        <span className="text-sm text-slate-500 dark:text-[#8b949e]">
                          — {activeRelease.name}
                        </span>
                      )}

                    {activeRelease.prerelease && (
                      <span className="text-[9px] bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                        pre-release
                      </span>
                    )}
                  </div>

                  {activeRelease.published_at && (
                    <p className="text-[11px] text-slate-400 dark:text-[#8b949e]">
                      Published {formatDate(activeRelease.published_at)}
                    </p>
                  )}
                </div>

                <a
                  href={activeRelease.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-medium text-[#007D9C] dark:text-sky-400 hover:text-[#005F77] dark:hover:text-sky-300 transition-colors shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on GitHub
                </a>
              </div>

              {activeRelease.body ? (
                <div className="overflow-auto max-h-96 custom-scrollbar">
                  <ReleaseBody body={activeRelease.body} />
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
      </div>
    </div>
  );
}
