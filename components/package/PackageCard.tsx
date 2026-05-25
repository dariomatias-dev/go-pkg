"use client";
import {
  Calendar,
  Database,
  GitFork,
  Heart,
  Shield,
  Star,
  User,
} from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { useFavorites } from "@/hooks/useFavorites";
import type { GoPackage, PopularPackage } from "@/types";

type CardPkg = GoPackage | PopularPackage;

interface PackageCardProps {
  pkg: CardPkg;
  index?: number;
}

function getAuthorUrl(pkg: CardPkg): string | null {
  if (pkg.githubUrl?.includes("github.com")) {
    try {
      const parts = pkg.githubUrl.replace(/https?:\/\//, "").split("/");

      if (parts[0] === "github.com" && parts[1]) {
        return `https://github.com/${parts[1]}`;
      }
    } catch {}
  }

  return null;
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

export default function PackageCard({ pkg, index }: PackageCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(pkg.importPath);

  const scoreValue =
    pkg.similarityScore !== undefined
      ? pkg.similarityScore > 1
        ? pkg.similarityScore
        : pkg.similarityScore * 100
      : undefined;

  const navigateToPkg = () => {
    const encoded = pkg.importPath.split("/").map(encodeURIComponent).join("/");

    router.push(`/package/${encoded}` as Route<`/package/${string}`>);
  };

  return (
    <div
      onClick={navigateToPkg}
      style={{ contentVisibility: "auto" }}
      className="bg-white hover:border-[#00ADD8] hover:shadow-md rounded-xl p-6 border border-slate-200/70 transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start gap-4 relative group overflow-hidden shadow-sm pt-8 sm:pt-6"
    >
      {scoreValue !== undefined && scoreValue > 0 && (
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-cyan-400 via-[#00ADD8] to-sky-600 transition-all duration-500"
            style={{ width: `${Math.min(100, scoreValue)}%` }}
          />
        </div>
      )}

      {pkg.stars > 1000 && (
        <span className="absolute top-2.5 right-3 bg-linear-to-r from-[#00ADD8] to-cyan-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow select-none">
          High Demand
        </span>
      )}

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2 select-none">
          {index !== undefined && (
            <span
              className={`inline-flex items-center justify-center font-sans font-extrabold text-xs px-2.5 py-0.5 rounded-md select-none shrink-0 border ${
                index === 1
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  : index === 2
                    ? "bg-slate-400/10 text-slate-500 border-slate-400/30"
                    : index === 3
                      ? "bg-amber-700/10 text-amber-700 border-amber-700/20"
                      : "bg-slate-100 text-slate-600 border-slate-200/60"
              }`}
              title={`Rank #${index} by popularity`}
            >
              #{index}
            </span>
          )}

          {pkg.category && (
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#007D9C] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100/50 shrink-0">
              {pkg.category}
            </span>
          )}

          {pkg.license && (
            <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-mono font-bold uppercase flex items-center gap-1 shrink-0">
              <Shield className="w-2.5 h-2.5 text-emerald-600" />
              <span>{pkg.license}</span>
            </span>
          )}

          {pkg.latestVersion && (
            <span className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono font-semibold shrink-0">
              {pkg.latestVersion}
            </span>
          )}

          {scoreValue !== undefined && scoreValue > 0 && (
            <span
              className="text-[9px] font-sans font-bold text-[#007D9C] bg-[#00ADD8]/10 px-2.5 py-0.5 rounded border border-[#00ADD8]/20 flex items-center gap-1 select-none shrink-0"
              title={`Semantic similarity score: ${Math.round(scoreValue)}%`}
            >
              Match: {Math.round(scoreValue)}%
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-2.5 min-w-0 pt-0.5">
          <h3 className="font-sans font-bold text-base text-slate-900 group-hover:text-[#00ADD8] transition-colors truncate">
            {pkg.name}
          </h3>

          {pkg.githubUrl ? (
            <a
              href={pkg.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-[#007D9C] hover:text-[#005F77] hover:underline font-mono truncate select-all font-medium"
            >
              {pkg.importPath}
            </a>
          ) : (
            <span className="text-[11px] text-slate-400 font-mono truncate select-all">
              {pkg.importPath}
            </span>
          )}
        </div>

        <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed font-light">
          {pkg.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-50 relative z-10 pt-1 select-none font-sans">
          {pkg.stars > 0 && (
            <div className="relative group/tooltip flex items-center gap-1 font-semibold text-[#007D9C] bg-[#00ADD8]/8 px-2.5 py-0.5 rounded-full border border-[#00ADD8]/20 hover:bg-[#00ADD8]/15 transition-colors">
              <Star className="w-3.5 h-3.5 fill-[#00ADD8] stroke-[#00ADD8]" />

              <span>{pkg.stars.toLocaleString()} stars</span>

              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/tooltip:flex flex-col items-center z-50">
                <div className="bg-slate-900 text-white text-[10px] leading-relaxed font-sans px-3 py-1.5 rounded-lg w-44 text-center shadow-lg border border-slate-700 pointer-events-none select-none">
                  GitHub repository popularity based on official star count.
                </div>

                <div className="w-2 bg-slate-900 h-2 rotate-45 -mt-1 border-r border-b border-slate-700" />
              </div>
            </div>
          )}

          {(pkg.forks ?? 0) > 0 && (
            <div className="flex items-center gap-1 text-slate-500">
              <GitFork className="w-3.5 h-3.5 text-slate-400" />

              <span>{(pkg.forks ?? 0).toLocaleString()} forks</span>
            </div>
          )}

          {pkg.dependenciesCount !== undefined && (
            <div className="flex items-center gap-1 text-slate-500">
              <Database className="w-3.5 h-3.5 text-slate-400" />

              <span>
                {pkg.dependenciesCount === 0
                  ? "No dependencies"
                  : `${pkg.dependenciesCount} dependencies`}
              </span>
            </div>
          )}

          {pkg.author && (
            <div className="flex items-center gap-1 text-slate-500">
              <User className="w-3.5 h-3.5 text-slate-400" />

              {getAuthorUrl(pkg) ? (
                <a
                  href={getAuthorUrl(pkg)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="truncate max-w-31 hover:text-[#007D9C] hover:underline transition-colors font-medium"
                >
                  {pkg.author}
                </a>
              ) : (
                <span className="truncate max-w-30">{pkg.author}</span>
              )}
            </div>
          )}

          {pkg.publishedAt && (
            <div className="hidden lg:flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-300" />

              <span>{pkg.publishedAt}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:self-center shrink-0 select-none pt-2 md:pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(toGoPackage(pkg));
          }}
          className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer active:scale-90 flex items-center justify-center shadow-sm ${
            saved
              ? "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100 hover:border-rose-300"
              : "bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 hover:border-rose-200"
          }`}
          title="Save to favorites"
        >
          <Heart
            className={`w-4 h-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
