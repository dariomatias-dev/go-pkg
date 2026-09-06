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
    <div className="relative overflow-hidden border-b border-slate-200/80 bg-white font-sans dark:border-[#30363d] dark:bg-[#0d1117]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#00ADD8_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.03] dark:opacity-[0.015]" />

      <div className="container-scale relative z-10 py-10 sm:py-14">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {pkg.category && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default rounded border border-sky-100 bg-sky-50 px-2.5 py-1 text-[10px] font-black tracking-wider text-[#007D9C] uppercase dark:border-sky-800/50 dark:bg-sky-950/30 dark:text-sky-400">
                  {pkg.category}
                </span>
              </TooltipTrigger>

              <TooltipContent>Category</TooltipContent>
            </Tooltip>
          )}

          {pkg.stars > 1000 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default rounded bg-[#00ADD8] px-2.5 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-sm">
                  High Demand
                </span>
              </TooltipTrigger>

              <TooltipContent>Popular in the ecosystem</TooltipContent>
            </Tooltip>
          )}

          {pkg.publishedAt && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-default items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  <Clock className="h-4 w-4" />
                  Updated {formatRelativeTime(pkg.publishedAt)}
                </div>
              </TooltipTrigger>

              <TooltipContent>Last push: {pkg.publishedAt}</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-4">
            <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-[#f0f6fc]">
              {pkg.name}
            </h1>

            {pkg.latestVersion && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400">
                    {pkg.latestVersion}
                  </span>
                </TooltipTrigger>

                <TooltipContent>Latest Version</TooltipContent>
              </Tooltip>
            )}

            <div className="mt-2 flex w-full flex-wrap items-center gap-3 lg:mt-0 lg:w-auto">
              <div className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-[#30363d] dark:bg-[#161b22]">
                <code className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                  import &quot;{pkg.importPath}&quot;
                </code>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-[#30363d]">
                {pkg.githubUrl && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={pkg.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-[#007D9C] hover:underline dark:text-sky-400"
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
                      className="flex items-center gap-2 text-xs font-bold text-[#007D9C] hover:underline dark:text-sky-400"
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

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleShare}
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-[#30363d] dark:bg-[#0d1117] dark:hover:bg-[#161b22]"
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
                  className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-[#30363d] dark:bg-[#0d1117] dark:hover:bg-[#161b22]"
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
                    "flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-4 text-xs font-bold shadow-sm transition-all active:scale-95",
                    isFavorite
                      ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9] dark:hover:bg-[#161b22]",
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
          <p className="mb-3 block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Install Command:
          </p>

          <div className="max-w-xl">
            <GoInstallBlock importPath={pkg.importPath} />
          </div>
        </div>

        <p className="mb-10 max-w-4xl text-lg leading-relaxed font-light text-slate-600 dark:text-[#8b949e]">
          {pkg.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9]">
                <Star className="h-4 w-4 fill-sky-400 text-sky-400" />
                {pkg.stars.toLocaleString()} stars
              </div>
            </TooltipTrigger>

            <TooltipContent>GitHub Stars</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9]">
                <GitFork className="h-4 w-4 text-[#00ADD8]" />
                {pkg.forks?.toLocaleString() || 0} forks
              </div>
            </TooltipTrigger>

            <TooltipContent>GitHub Forks</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9]">
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
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-[#00ADD8]/50 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9]"
                >
                  <Shield className="h-4 w-4 text-slate-400" />
                  LICENSE:{" "}
                  <span className="text-[#007D9C]">{pkg.license || "N/A"}</span>
                </a>
              ) : (
                <span className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9]">
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
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-[#00ADD8]/50 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9]"
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
