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
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const navigateToPkg = () => {
    router.push(
      `/package/${encodeImportPath(pkg.importPath)}` as Route<`/package/${string}`>,
    );
  };

  return (
    <div
      onClick={navigateToPkg}
      className="group relative flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-500 hover:border-[#00ADD8]/40 hover:shadow-2xl hover:shadow-sky-500/10 dark:border-[#30363d] dark:bg-[#0d1117] dark:hover:border-sky-500/30 dark:hover:shadow-black/60 sm:p-6 cursor-pointer overflow-hidden"
    >
      {scoreValue !== undefined && scoreValue > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-[#21262d]">
          <div
            className="h-full bg-linear-to-r from-cyan-400 via-[#00ADD8] to-sky-600 transition-all duration-1000 group-hover:brightness-110"
            style={{ width: `${Math.min(100, scoreValue)}%` }}
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              {index !== undefined && (
                <div className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-black dark:bg-white shadow-sm">
                  <span className="text-[10px] font-black font-mono text-white dark:text-black">
                    #{index.toString().padStart(2, "0")}
                  </span>
                </div>
              )}

              <h3 className="font-display text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#00ADD8] dark:text-[#f0f6fc] dark:group-hover:text-sky-400 sm:text-xl transition-colors truncate">
                {pkg.name}
              </h3>

              {pkg.latestVersion && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="rounded-md bg-emerald-50/50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 border border-emerald-100 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/20 cursor-default">
                      {pkg.latestVersion}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Latest published version</TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <code className="text-xs font-medium text-[#007D9C] dark:text-sky-400/70 truncate bg-slate-50/30 dark:bg-[#161b22]/30 px-2 py-1 rounded-md w-fit max-w-full border border-slate-100/50 dark:border-[#30363d]/20">
                {pkg.importPath}
              </code>

              {pkg.githubUrl && (
                <a
                  href={pkg.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-black dark:text-slate-500 dark:hover:text-white transition-colors"
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
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(toGoPackage(pkg));
                }}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 active:scale-90 shrink-0",
                  saved
                    ? "bg-rose-50 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400 shadow-sm"
                    : "bg-slate-50/50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:bg-[#161b22]/50 dark:text-[#484f58] dark:hover:bg-rose-950/20 dark:hover:text-rose-400",
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
                <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#007D9C] border border-sky-100 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800/50 cursor-default">
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
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-50/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200/60 transition-colors hover:border-[#00ADD8]/40 hover:text-[#00ADD8] dark:bg-[#21262d]/80 dark:text-slate-400 dark:border-[#30363d] dark:hover:text-sky-400"
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

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-[#8b949e] font-light">
          {pkg.description || "No description provided for this package."}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-100 dark:border-[#30363d]/50">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#00ADD8] dark:text-sky-400 cursor-default">
                <Star className="h-4 w-4 fill-[#00ADD8] stroke-[#00ADD8]" />
                <span>{pkg.stars.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Total GitHub stars</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8b949e] cursor-default">
                <GitFork className="h-4 w-4" />
                <span>{(pkg.forks ?? 0).toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Number of GitHub repository forks</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8b949e] cursor-default">
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
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#00ADD8] dark:text-[#8b949e] dark:hover:text-sky-400 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-30">@{pkg.author}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>Package author on GitHub</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {relativeTime && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 cursor-default">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{relativeTime}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Last updated on {pkg.publishedAt}</TooltipContent>
            </Tooltip>
          )}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-300 group-hover:bg-[#00ADD8] group-hover:text-white transition-all duration-500 dark:bg-[#161b22] dark:group-hover:bg-sky-500/20 dark:group-hover:text-sky-400 border border-slate-100 dark:border-white/5 shadow-sm">
            <ArrowRight className="h-4 w-4 -translate-x-px group-hover:translate-x-0 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
