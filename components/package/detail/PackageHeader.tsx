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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";

import { GoInstallBlock } from "@/components/package/shared/GoInstallBlock";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/useFavorites";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { GoPackage } from "@/types";

interface PackageHeaderProps {
  pkg: GoPackage;
}

export function PackageHeader({ pkg }: PackageHeaderProps) {
  const router = useRouter();

  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();

  const isFavorite = checkFavorite(pkg.importPath);

  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative border-b border-slate-200/80 bg-white dark:border-[#30363d] dark:bg-[#0d1117] overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#00ADD8_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.03] dark:opacity-[0.015] pointer-events-none" />

      <div className="container-scale relative z-10 py-10 sm:py-14">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {pkg.category && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/30 text-[#007D9C] dark:text-sky-400 text-[10px] font-black uppercase tracking-wider border border-sky-100 dark:border-sky-800/50 cursor-default">
                  {pkg.category}
                </span>
              </TooltipTrigger>

              <TooltipContent>Category</TooltipContent>
            </Tooltip>
          )}

          {pkg.stars > 1000 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="px-2.5 py-1 rounded bg-[#00ADD8] text-white text-[10px] font-black uppercase tracking-wider shadow-sm cursor-default">
                  High Demand
                </span>
              </TooltipTrigger>

              <TooltipContent>Popular in the ecosystem</TooltipContent>
            </Tooltip>
          )}

          {pkg.publishedAt && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] font-medium cursor-default">
                  <Clock className="h-4 w-4" />
                  Updated {formatRelativeTime(pkg.publishedAt)}
                </div>
              </TooltipTrigger>

              <TooltipContent>Last push: {pkg.publishedAt}</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap items-center gap-4 min-w-0">
            <h1 className="font-display text-4xl sm:text-5xl font-black text-slate-900 dark:text-[#f0f6fc] tracking-tight">
              {pkg.name}
            </h1>

            {pkg.latestVersion && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="px-2.5 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400 font-mono text-[11px] font-bold">
                    {pkg.latestVersion}
                  </span>
                </TooltipTrigger>

                <TooltipContent>Latest Version</TooltipContent>
              </Tooltip>
            )}

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#161b22] px-3 py-1.5 rounded border border-slate-200 dark:border-[#30363d]">
                <code className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  import &quot;{pkg.importPath}&quot;
                </code>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-[#30363d] pl-3">
                {pkg.githubUrl && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={pkg.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-[#007D9C] dark:text-sky-400 hover:underline"
                      >
                        <FaGithub className="h-4 w-4" />
                        {pkg.githubUrl.replace("https://", "")}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </a>
                    </TooltipTrigger>

                    <TooltipContent>Source Repository</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={`https://pkg.go.dev/${pkg.importPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-[#007D9C] dark:text-sky-400 hover:underline"
                    >
                      pkg.go.dev
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </TooltipTrigger>

                  <TooltipContent>Documentation</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleShare}
                  className="flex h-10 px-4 items-center gap-2 rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-xs font-bold transition-all active:scale-95 shadow-sm hover:bg-slate-50 dark:hover:bg-[#161b22] cursor-pointer"
                >
                  <Link2 className="h-3.5 w-3.5 text-[#00ADD8]" />
                  {copied ? "Copied" : "Share"}
                </button>
              </TooltipTrigger>

              <TooltipContent>Copy Link</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    router.push(
                      `/compare?pkg=${encodeURIComponent(pkg.importPath)}`,
                    )
                  }
                  className="flex h-10 px-4 items-center gap-2 rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-xs font-bold transition-all active:scale-95 shadow-sm hover:bg-slate-50 dark:hover:bg-[#161b22] cursor-pointer"
                >
                  <Scale className="h-3.5 w-3.5 text-[#00ADD8]" />
                  Compare
                </button>
              </TooltipTrigger>

              <TooltipContent>Compare with others</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleFavorite(pkg)}
                  className={cn(
                    "flex h-10 px-4 items-center gap-2 rounded-lg font-bold text-xs transition-all active:scale-95 shadow-sm border cursor-pointer",
                    isFavorite
                      ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400"
                      : "bg-white border-slate-200 text-slate-700 dark:bg-[#0d1117] dark:border-[#30363d] dark:text-[#c9d1d9] hover:bg-slate-50 dark:hover:bg-[#161b22]",
                  )}
                >
                  <Heart
                    className={cn("h-4 w-4", isFavorite && "fill-current")}
                  />
                  {isFavorite ? "Saved" : "Save"}
                </button>
              </TooltipTrigger>

              <TooltipContent>
                {isFavorite ? "Remove" : "Save"} favorite
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
            Install Command:
          </p>

          <div className="max-w-xl">
            <GoInstallBlock importPath={pkg.importPath} />
          </div>
        </div>

        <p className="text-lg text-slate-600 dark:text-[#8b949e] font-light leading-relaxed max-w-4xl mb-10">
          {pkg.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-xs font-bold text-slate-700 dark:text-[#c9d1d9] cursor-default">
                <Star className="h-4 w-4 text-sky-400 fill-sky-400" />
                {pkg.stars.toLocaleString()} stars
              </div>
            </TooltipTrigger>

            <TooltipContent>GitHub Stars</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-xs font-bold text-slate-700 dark:text-[#c9d1d9] cursor-default">
                <GitFork className="h-4 w-4 text-[#00ADD8]" />
                {pkg.forks?.toLocaleString() || 0} forks
              </div>
            </TooltipTrigger>

            <TooltipContent>GitHub Forks</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-xs font-bold text-slate-700 dark:text-[#c9d1d9] cursor-default">
                <Database className="h-4 w-4 text-[#00ADD8]" />
                {pkg.dependenciesCount || 0} dependencies
              </div>
            </TooltipTrigger>

            <TooltipContent>Package Dependencies</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              {pkg.githubUrl ? (
                <a
                  href={`${pkg.githubUrl}/blob/HEAD/LICENSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-xs font-bold text-slate-700 dark:text-[#c9d1d9] hover:border-[#00ADD8]/50 transition-colors"
                >
                  <Shield className="h-4 w-4 text-slate-400" />
                  LICENSE:{" "}
                  <span className="text-[#007D9C]">{pkg.license || "N/A"}</span>
                </a>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-xs font-bold text-slate-700 dark:text-[#c9d1d9]">
                  <Shield className="h-4 w-4 text-slate-400" />
                  LICENSE:{" "}
                  <span className="text-[#007D9C]">{pkg.license || "N/A"}</span>
                </span>
              )}
            </TooltipTrigger>

            <TooltipContent>View License</TooltipContent>
          </Tooltip>

          {pkg.author && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={`https://github.com/${pkg.author}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-xs font-bold text-slate-700 dark:text-[#c9d1d9] hover:border-[#00ADD8]/50 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  AUTHOR: <span className="text-[#007D9C]">@{pkg.author}</span>
                </a>
              </TooltipTrigger>

              <TooltipContent>Maintainer Profile</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
