"use client";

import {
  ArrowRight,
  Clock,
  Database,
  ExternalLink,
  GitFork,
  Heart,
  Shield,
  Star,
  User,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/useFavorites";
import { cn, encodeImportPath, formatRelativeTime } from "@/lib/utils";
import type { GoPackage, PopularPackage } from "@/types";

type CardPkg = GoPackage | PopularPackage;

interface PackageCardProps {
  pkg: CardPkg;
  index?: number;
}

function toGoPackage(pkg: CardPkg): GoPackage {
  return {
    forks: 0,
    license: "",
    latestVersion: "",
    author: "",
    publishedAt: "",
    ...pkg,
  } as GoPackage;
}

export function PackageCard({ pkg, index }: PackageCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(pkg.importPath);

  const relativeTime = pkg.publishedAt
    ? formatRelativeTime(pkg.publishedAt)
    : null;

  const scoreValue =
    pkg.similarityScore !== undefined
      ? pkg.similarityScore > 1
        ? pkg.similarityScore
        : pkg.similarityScore * 100
      : undefined;

  const href =
    `/package/${encodeImportPath(pkg.importPath)}` as Route<`/package/${string}`>;

  return (
    <div
      data-testid={`package-card-${pkg.importPath}`}
      className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-500 hover:border-[#00ADD8]/40 hover:shadow-2xl hover:shadow-sky-500/10 sm:p-6 dark:border-[#30363d] dark:bg-[#0d1117] dark:hover:border-sky-500/30 dark:hover:shadow-black/60"
    >
      {scoreValue !== undefined && scoreValue > 0 && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-slate-100 dark:bg-[#21262d]">
          <div
            className="h-full bg-linear-to-r from-cyan-400 via-[#00ADD8] to-sky-600 transition-all duration-1000 group-hover:brightness-110"
            style={{ width: `${Math.min(100, scoreValue)}%` }}
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              {index !== undefined && (
                <div className="inline-flex items-center justify-center rounded-md bg-black px-2 py-0.5 shadow-sm dark:bg-white">
                  <span className="font-mono text-[10px] font-black text-white dark:text-black">
                    #{index.toString().padStart(2, "0")}
                  </span>
                </div>
              )}

              <h3 className="font-display truncate text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-[#00ADD8] sm:text-xl dark:text-[#f0f6fc] dark:group-hover:text-sky-400">
                <Link
                  href={href}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {pkg.name}
                </Link>
              </h3>

              {pkg.latestVersion && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-default rounded-md border border-emerald-100 bg-emerald-50/50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400">
                      {pkg.latestVersion}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Latest published version</TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <code className="w-fit max-w-full truncate rounded-md border border-slate-100/50 bg-slate-50/30 px-2 py-1 text-xs font-medium text-[#006680] dark:border-[#30363d]/20 dark:bg-[#161b22]/30 dark:text-sky-400/70">
                {pkg.importPath}
              </code>

              {pkg.githubUrl && (
                <a
                  href={pkg.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:text-black dark:text-slate-500 dark:hover:text-white"
                >
                  <FaGithub className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              )}
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={
                  saved ? "Remove from favorites" : "Save to favorites"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(toGoPackage(pkg));
                }}
                className={cn(
                  "relative z-10 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-300 active:scale-90",
                  saved
                    ? "bg-rose-50 text-rose-500 shadow-sm dark:bg-rose-950/20 dark:text-rose-400"
                    : "bg-slate-50/50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:bg-[#161b22]/50 dark:text-[#484f58] dark:hover:bg-rose-950/20 dark:hover:text-rose-400",
                )}
              >
                <Heart className={cn("h-4.5 w-4.5", saved && "fill-current")} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {saved ? "Remove from favorites" : "Save to favorites"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-wrap gap-2">
          {pkg.category && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#006680] uppercase dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-400">
                  {pkg.category}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Curated thematic category for this package
              </TooltipContent>
            </Tooltip>
          )}
          {pkg.license && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={
                    pkg.githubUrl ? `${pkg.githubUrl}/blob/HEAD/LICENSE` : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200/60 bg-slate-50/80 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase transition-colors hover:border-[#00ADD8]/40 hover:text-[#00ADD8] dark:border-[#30363d] dark:bg-[#21262d]/80 dark:text-slate-400 dark:hover:text-sky-400"
                >
                  <Shield className="h-3 w-3" />
                  {pkg.license}
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Open source license for this package
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed font-light text-slate-600 dark:text-[#8b949e]">
          {pkg.description || "No description provided for this package."}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5 dark:border-[#30363d]/50">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-1.5 text-xs font-bold text-[#006680] dark:text-sky-400">
                <Star className="h-4 w-4 fill-[#00ADD8] stroke-[#00ADD8]" />
                <span>{pkg.stars.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Total GitHub stars</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8b949e]">
                <GitFork className="h-4 w-4" />
                <span>{(pkg.forks ?? 0).toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Number of GitHub repository forks</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8b949e]">
                <Database className="h-4 w-4" />
                <span>{pkg.dependenciesCount ?? 0} deps</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {pkg.dependenciesCount === 0
                ? "No external dependencies"
                : "Direct and indirect Go package dependencies"}
            </TooltipContent>
          </Tooltip>

          {pkg.author && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://github.com/${pkg.author}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 hidden cursor-pointer items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#00ADD8] sm:flex dark:text-[#8b949e] dark:hover:text-sky-400"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-30 truncate">@{pkg.author}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>Package author on GitHub</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          {relativeTime && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-default items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{relativeTime}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Last updated on {pkg.publishedAt}</TooltipContent>
            </Tooltip>
          )}
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-300 shadow-sm transition-all duration-500 group-hover:bg-[#00ADD8] group-hover:text-white dark:border-white/5 dark:bg-[#161b22] dark:group-hover:bg-sky-500/20 dark:group-hover:text-sky-400">
            <ArrowRight className="h-4 w-4 -translate-x-px transition-transform group-hover:translate-x-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
