"use client";

import {
  Clock,
  Database,
  ExternalLink,
  GitFork,
  Heart,
  Link2,
  Scale,
  Shield,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";

import { GoInstallBlock } from "@/components/package/shared/GoInstallBlock";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRelativeTime } from "@/lib/utils";
import type { GoPackage } from "@/types";

interface PackageHeaderProps {
  pkg: GoPackage;
  isFavorite: boolean;
  isCompared: boolean;
  isFull: boolean;
  onToggleFavorite: () => void;
  onToggleCompare: () => void;
}

export function PackageHeader({
  pkg,
  isFavorite,
  isCompared,
  isFull,
  onToggleFavorite,
  onToggleCompare,
}: PackageHeaderProps) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-linear-to-b from-sky-50/10 via-slate-50/45 to-white dark:from-sky-950/5 dark:via-[#0d1117] dark:to-[#0d1117] border-b border-slate-200/80 dark:border-[#30363d] py-10 sm:py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#00ADD8_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.035] dark:opacity-[0.015] pointer-events-none" />

      <div className="container-scale relative z-10 font-sans">
        <div className="space-y-6 min-w-0">
          <div className="flex flex-wrap items-center gap-2 select-none">
            {pkg.category && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="bg-[#00ADD8]/10 dark:bg-sky-950/30 text-[#007D9C] dark:text-sky-400 border border-[#00ADD8]/20 dark:border-sky-800/30 font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm inline-block cursor-default">
                    {pkg.category}
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  Curated thematic category for this package
                </TooltipContent>
              </Tooltip>
            )}

            {pkg.stars > 1000 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="bg-linear-to-r from-[#00ADD8] to-cyan-600 dark:from-sky-600 dark:to-cyan-700 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block cursor-default">
                    High Demand
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  Extremely popular in the Go ecosystem (+1,000 stars)
                </TooltipContent>
              </Tooltip>
            )}

            {formatRelativeTime(pkg.publishedAt) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-[#8b949e] font-normal text-xs bg-slate-100/50 dark:bg-[#161b22] px-2.5 py-0.5 rounded-md border border-slate-200/30 dark:border-[#30363d] cursor-default">
                    <Clock className="w-3 h-3" />
                    Updated {formatRelativeTime(pkg.publishedAt)}
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  Last updated on {pkg.publishedAt}
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-[#30363d] pb-5">
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-none text-slate-950 dark:text-[#f0f6fc]">
                  {pkg.name}
                </h2>

                {pkg.latestVersion && (
                  <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/30 font-mono text-xs font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                    {pkg.latestVersion}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-slate-600 dark:text-[#8b949e] select-all tracking-tight text-xs sm:text-sm font-medium bg-slate-100/60 dark:bg-[#161b22] px-2 py-1 rounded">
                  import &quot;{pkg.importPath}&quot;
                </span>

                {pkg.githubUrl && (
                  <a
                    href={pkg.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#007D9C] dark:text-sky-400 hover:text-[#005F77] dark:hover:text-sky-300 font-semibold border-l border-slate-200 dark:border-[#30363d] pl-3 transition-colors shrink-0 group font-sans"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-slate-400 dark:text-[#484f58] group-hover:text-slate-700 dark:group-hover:text-[#f0f6fc]"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>

                    <span className="group-hover:underline">
                      {pkg.githubUrl.replace("https://", "")}
                    </span>

                    <ExternalLink className="w-2.5 h-2.5 text-[#00ADD8] dark:text-sky-500" />
                  </a>
                )}

                <a
                  href={`https://pkg.go.dev/${pkg.importPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#007D9C] dark:text-sky-400 hover:text-[#005F77] dark:hover:text-sky-300 font-semibold border-l border-slate-200 dark:border-[#30363d] pl-3 transition-colors shrink-0 group font-sans"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 text-slate-400 dark:text-[#484f58] group-hover:text-[#00ADD8] dark:group-hover:text-[#00ADD8]"
                    fill="currentColor"
                  >
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 14v-2h12v2H6zm12-4H6v-2h12v2zm0-4h-5V4h5v6z" />
                  </svg>

                  <span className="group-hover:underline">pkg.go.dev</span>

                  <ExternalLink className="w-2.5 h-2.5 text-[#00ADD8] dark:text-sky-500" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 select-none shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-1.5 border px-2.5 sm:px-3.5 h-9 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer shadow-sm bg-white dark:bg-[#0d1117] border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-50 dark:hover:bg-[#161b22]"
                  >
                    <Link2 className="w-3.5 h-3.5 shrink-0 text-[#007D9C] dark:text-sky-400" />

                    <span className="hidden sm:inline">
                      {copied ? "Copied!" : "Share"}
                    </span>
                  </button>
                </TooltipTrigger>

                <TooltipContent>
                  {copied ? "Link copied" : "Share link"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleCompare}
                    disabled={!isCompared && isFull}
                    className={`flex items-center justify-center gap-1.5 border px-2.5 sm:px-3.5 h-9 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                      isCompared
                        ? "bg-slate-900 dark:bg-[#21262d] border-slate-950 dark:border-[#30363d] text-white"
                        : "bg-white dark:bg-[#0d1117] border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-50 dark:hover:bg-[#161b22]"
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 shrink-0 text-[#007D9C] dark:text-sky-400" />

                    <span className="hidden sm:inline">
                      {isCompared ? "In Comparator" : "Compare"}
                    </span>
                  </button>
                </TooltipTrigger>

                <TooltipContent>
                  {isCompared ? "Remove from comparison" : "Add to comparison"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleFavorite}
                    className={`group flex items-center justify-center gap-1.5 border px-2.5 sm:px-3.5 h-9 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer shadow-sm shrink-0 ${
                      isFavorite
                        ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400"
                        : "bg-white dark:bg-[#0d1117] border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#c9d1d9] hover:bg-rose-50 dark:hover:bg-rose-950/10 hover:border-rose-200 dark:hover:border-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 shrink-0 transition-colors duration-150 ${
                        isFavorite
                          ? "fill-rose-500 text-rose-500"
                          : "text-slate-400 dark:text-[#484f58] group-hover:text-rose-500"
                      }`}
                    />

                    <span className="hidden sm:inline">
                      {isFavorite ? "Saved" : "Save"}
                    </span>
                  </button>
                </TooltipTrigger>

                <TooltipContent>
                  {isFavorite ? "Remove from favorites" : "Save to favorites"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#484f58] tracking-wider block select-none">
              Install Command:
            </span>

            <div className="max-w-xl">
              <GoInstallBlock importPath={pkg.importPath} />
            </div>
          </div>

          <p className="text-slate-600 dark:text-[#8b949e] text-sm sm:text-base max-w-4xl leading-relaxed font-light">
            {pkg.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 select-none font-sans">
            {pkg.stars > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1.5 border border-slate-200/60 dark:border-[#30363d] bg-slate-100/35 dark:bg-[#161b22] text-slate-700 dark:text-[#c9d1d9] rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                    <Star className="w-3.5 h-3.5 fill-sky-300 dark:fill-sky-500 text-sky-500 shrink-0" />

                    <span>{pkg.stars.toLocaleString()} stars</span>
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  Total stars earned by this repository on GitHub
                </TooltipContent>
              </Tooltip>
            )}

            {pkg.forks !== undefined && pkg.forks > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1.5 border border-slate-200/60 dark:border-[#30363d] bg-slate-100/35 dark:bg-[#161b22] text-slate-700 dark:text-[#c9d1d9] rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                    <GitFork className="w-3.5 h-3.5 text-[#00ADD8] dark:text-sky-500 shrink-0" />
                    <span>{pkg.forks.toLocaleString()} forks</span>
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  Number of repository forks on GitHub
                </TooltipContent>
              </Tooltip>
            )}

            {pkg.dependenciesCount !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1.5 border border-slate-200/60 dark:border-[#30363d] bg-slate-100/35 dark:bg-[#161b22] text-slate-700 dark:text-[#c9d1d9] rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                    <Database className="w-3.5 h-3.5 text-[#007D9C] dark:text-sky-400 shrink-0" />
                    <span>
                      {pkg.dependenciesCount === 0
                        ? "No dependencies"
                        : `${pkg.dependenciesCount} dependencies`}
                    </span>
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  External dependencies directly and indirectly mapped in go.mod
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1.5 border border-slate-200/60 dark:border-[#30363d] bg-slate-100/35 dark:bg-[#161b22] text-slate-700 dark:text-[#c9d1d9] rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                  <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />

                  <span className="font-semibold text-slate-500 text-[11px] uppercase">
                    License:
                  </span>

                  {pkg.githubUrl ? (
                    <a
                      href={`${pkg.githubUrl}/blob/HEAD/LICENSE`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-[#007D9C] dark:text-sky-400 hover:text-[#00ADD8] hover:underline transition-colors shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {pkg.license || "N/A"}
                    </a>
                  ) : (
                    <span className="font-mono font-bold text-slate-800 dark:text-[#f0f6fc]">
                      {pkg.license || "N/A"}
                    </span>
                  )}
                </span>
              </TooltipTrigger>

              <TooltipContent>
                Copyright and distribution rights valid for this source code
                {pkg.githubUrl ? " (click to view license file)" : ""}
              </TooltipContent>
            </Tooltip>

            {pkg.author &&
              !["desconhecido", "unknown", "n/a", "padrão"].includes(
                pkg.author.toLowerCase(),
              ) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1.5 border border-slate-200/60 dark:border-[#30363d] bg-slate-100/35 dark:bg-[#161b22] text-slate-700 dark:text-[#c9d1d9] rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />

                      <span className="font-semibold text-slate-500 text-[11px] uppercase font-sans">
                        Author:
                      </span>

                      <a
                        href={`https://github.com/${pkg.author}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#007D9C] dark:text-sky-400 hover:text-[#00ADD8] hover:underline transition-colors shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        @{pkg.author}
                      </a>
                    </span>
                  </TooltipTrigger>

                  <TooltipContent>
                    Organization or user who created this package (click to
                    visit GitHub)
                  </TooltipContent>
                </Tooltip>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
