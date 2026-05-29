"use client";

import {
  Clock,
  Database,
  GitFork,
  Heart,
  Shield,
  Star,
  User,
} from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

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
      style={{ contentVisibility: "auto" }}
      className="bg-white dark:bg-[#0d1117] hover:border-[#00ADD8] dark:hover:border-sky-500/40 hover:shadow-md dark:hover:shadow-black/40 rounded-xl p-6 border border-slate-200/70 dark:border-[#30363d] transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start gap-4 relative group overflow-hidden shadow-sm pt-8 sm:pt-6"
    >
      {scoreValue !== undefined && scoreValue > 0 && (
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-slate-100 dark:bg-[#21262d] overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-cyan-400 via-[#00ADD8] to-sky-600 transition-all duration-500"
            style={{ width: `${Math.min(100, scoreValue)}%` }}
          />
        </div>
      )}

      {pkg.stars > 1000 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="absolute top-2.5 right-3 bg-linear-to-r from-[#00ADD8] to-cyan-600 dark:from-sky-700 dark:to-cyan-800 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow select-none cursor-default">
              High Demand
            </span>
          </TooltipTrigger>

          <TooltipContent>
            Extremely popular in the Go ecosystem (+1,000 stars)
          </TooltipContent>
        </Tooltip>
      )}

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2 select-none">
          {index !== undefined && (
            <span
              className={cn(
                "inline-flex items-center justify-center font-sans font-extrabold text-xs px-2.5 py-0.5 rounded-md select-none shrink-0 border",
                index === 1
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-500/90 dark:border-amber-500/20"
                  : index === 2
                    ? "bg-slate-400/10 text-slate-500 border-slate-400/30 dark:bg-[#21262d] dark:text-slate-400 dark:border-[#30363d]"
                    : index === 3
                      ? "bg-amber-700/10 text-amber-700 border-amber-700/20 dark:bg-amber-700/5 dark:text-amber-600/90 dark:border-amber-700/20"
                      : "bg-slate-100 text-slate-600 border-slate-200/60 dark:bg-[#161b22] dark:text-[#8b949e] dark:border-[#30363d]",
              )}
            >
              #{index}
            </span>
          )}

          {pkg.category && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#007D9C] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 px-2.5 py-0.5 rounded-full border border-sky-100/50 dark:border-sky-800/50 shrink-0 cursor-default">
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
                <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/30 font-mono font-bold uppercase flex items-center gap-1 shrink-0 cursor-default">
                  <Shield className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-500" />
                  <span>{pkg.license}</span>
                </span>
              </TooltipTrigger>

              <TooltipContent>
                Open source license for this package
              </TooltipContent>
            </Tooltip>
          )}

          {pkg.latestVersion && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[9px] bg-slate-50 dark:bg-[#161b22] text-slate-500 dark:text-[#8b949e] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#30363d] font-mono font-semibold shrink-0 cursor-default">
                  {pkg.latestVersion}
                </span>
              </TooltipTrigger>

              <TooltipContent>Latest published version</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2.5 min-w-0 pt-0.5">
          <h3 className="font-sans font-bold text-base text-slate-900 dark:text-[#f0f6fc] group-hover:text-[#00ADD8] dark:group-hover:text-sky-400 transition-colors truncate">
            {pkg.name}
          </h3>

          {pkg.githubUrl ? (
            <a
              href={pkg.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-[#007D9C] dark:text-sky-400/80 hover:text-[#005F77] dark:hover:text-sky-300 hover:underline font-mono truncate select-all font-medium"
            >
              {pkg.importPath}
            </a>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-[#484f58] font-mono truncate select-all">
              {pkg.importPath}
            </span>
          )}
        </div>

        <p className="text-slate-600 dark:text-[#8b949e] text-xs sm:text-sm line-clamp-2 leading-relaxed font-light">
          {pkg.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-[#8b949e] relative z-10 pt-1 select-none font-sans">
          {pkg.stars > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative group/tooltip flex items-center gap-1 font-semibold text-[#007D9C] dark:text-sky-400 bg-[#00ADD8]/8 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-full border border-[#00ADD8]/20 dark:border-sky-800/50 hover:bg-[#00ADD8]/15 dark:hover:bg-sky-900/40 transition-colors cursor-default">
                  <Star className="w-3.5 h-3.5 fill-[#00ADD8] dark:fill-sky-500 stroke-[#00ADD8] dark:stroke-sky-500" />
                  <span>{pkg.stars.toLocaleString()} stars</span>
                </div>
              </TooltipTrigger>

              <TooltipContent>Total GitHub stars</TooltipContent>
            </Tooltip>
          )}

          {(pkg.forks ?? 0) > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-slate-500 dark:text-[#8b949e] cursor-default">
                  <GitFork className="w-3.5 h-3.5 text-slate-400 dark:text-[#484f58]" />
                  <span>{(pkg.forks ?? 0).toLocaleString()} forks</span>
                </div>
              </TooltipTrigger>

              <TooltipContent>Number of GitHub repository forks</TooltipContent>
            </Tooltip>
          )}

          {pkg.dependenciesCount !== undefined && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-slate-500 dark:text-[#8b949e] cursor-default">
                  <Database className="w-3.5 h-3.5 text-slate-400 dark:text-[#484f58]" />
                  <span>{pkg.dependenciesCount} deps</span>
                </div>
              </TooltipTrigger>

              <TooltipContent>
                {pkg.dependenciesCount === 0
                  ? "No external dependencies"
                  : "Direct and indirect Go module dependencies"}
              </TooltipContent>
            </Tooltip>
          )}

          {pkg.author && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-slate-500 dark:text-[#8b949e] cursor-default">
                  <User className="w-3.5 h-3.5 text-slate-400 dark:text-[#484f58]" />
                  <span className="truncate max-w-30">{pkg.author}</span>
                </div>
              </TooltipTrigger>

              <TooltipContent>Package author on GitHub</TooltipContent>
            </Tooltip>
          )}

          {relativeTime && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-slate-500 dark:text-[#8b949e] cursor-default">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-[#484f58]" />
                  <span>{relativeTime}</span>
                </div>
              </TooltipTrigger>

              <TooltipContent>Last updated on {pkg.publishedAt}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:self-center shrink-0 select-none pt-2 md:pt-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(toGoPackage(pkg));
              }}
              className={cn(
                "p-2.5 rounded-lg border transition-all duration-150 cursor-pointer active:scale-90 flex items-center justify-center shadow-sm",
                saved
                  ? "bg-rose-50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40 text-rose-500 dark:text-rose-400"
                  : "bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d] text-slate-400 dark:text-[#484f58] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20",
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  saved && "fill-rose-500 text-rose-500",
                )}
              />
            </button>
          </TooltipTrigger>

          <TooltipContent>
            {saved ? "Remove from favorites" : "Save to favorites"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
