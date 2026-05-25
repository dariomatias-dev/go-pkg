"use client";

import {
  BookOpen,
  ChevronRight,
  Clock,
  Database,
  ExternalLink,
  FileCode2,
  GitFork,
  Heart,
  HeartOff,
  Scale,
  Shield,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AiSummaryTab } from "@/components/package/AiSummaryTab";
import { CodeBlock } from "@/components/package/CodeBlock";
import { GoInstallBlock } from "@/components/package/GoInstallBlock";
import { GopherChat } from "@/components/package/GopherChat";
import { ReadmeTab } from "@/components/package/ReadmeTab";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useCompare } from "@/hooks/useCompare";
import { useFavorites } from "@/hooks/useFavorites";
import type { PackageDetailResponse } from "@/types";

interface PackageDetailProps {
  importPath: string;
}

type Tab = "summary" | "readme" | "goMod" | "versions";

export function PackageDetail({ importPath }: PackageDetailProps) {
  const router = useRouter();

  const [prevImportPath, setPrevImportPath] = useState(importPath);
  const [data, setData] = useState<PackageDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("readme");
  const [scrollProgress, setScrollProgress] = useState(0);

  const [aiSummary, setAiSummary] = useState("");
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState<string | null>(null);

  if (prevImportPath !== importPath) {
    setPrevImportPath(importPath);
    setLoading(true);
    setError(null);
    setData(null);
    setAiSummary("");
    setAiSummaryError(null);
    setActiveTab("readme");
  }

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isCompared, addToCompare, removeFromCompare, isFull } = useCompare();

  const fetchAiSummary = async (path: string) => {
    setAiSummaryLoading(true);
    setAiSummaryError(null);

    try {
      const res = await fetch(
        `/api/package-summary?importPath=${encodeURIComponent(path)}`,
      );

      if (res.ok) {
        const d = await res.json();

        setAiSummary(d.summary);
      } else {
        const d = await res.json().catch(() => ({}));

        setAiSummaryError(
          d.error || "Failed to generate the AI summary. Check the server.",
        );
      }
    } catch {
      setAiSummaryError("Connection error while requesting AI analysis.");
    } finally {
      setAiSummaryLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/package-info?importPath=${encodeURIComponent(importPath)}`)
      .then((r) => {
        if (!r.ok)
          throw new Error(
            "We couldn't load this package. Verify the Go module exists in proxy.golang.org.",
          );

        return r.json();
      })
      .then((d: PackageDetailResponse) => {
        setData(d);

        if (!d.pkg.readme) {
          setActiveTab("summary");
          fetchAiSummary(importPath);
        } else {
          setActiveTab("readme");
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [importPath]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSetActiveTab = (tab: Tab) => {
    setActiveTab(tab);

    if (tab === "summary" && !aiSummary && importPath) {
      fetchAiSummary(importPath);
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="w-full h-1 bg-cyan-100/50 relative overflow-hidden">
          <div className="h-full bg-[#00ADD8] w-2/5 rounded-full animate-progress-slide absolute top-0 left-0" />
        </div>

        <div className="container-scale py-10">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 mb-8 animate-shimmer relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-200/80 rounded-2xl shrink-0" />

              <div className="space-y-2.5">
                <div className="h-4 w-20 bg-slate-200/80 rounded-full" />
                <div className="h-6 w-56 bg-slate-200/80 rounded-lg" />
                <div className="h-3.5 w-72 bg-slate-100/60 rounded-sm" />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-10 w-28 bg-slate-200/80 rounded-lg" />
              <div className="h-10 w-12 bg-slate-200/80 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white border border-slate-200/60 rounded-xl p-8 space-y-5 animate-shimmer overflow-hidden">
              <div className="flex gap-2 border-b border-slate-100 pb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-lg ${i === 1 ? "w-24 bg-slate-200/85" : "w-24 bg-slate-100/70"}`}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <div className="h-5 w-1/3 bg-slate-200/80 rounded-md" />
                <div className="h-3.5 w-full bg-slate-100/80 rounded-md" />
                <div className="h-3.5 w-11/12 bg-slate-100/80 rounded-md" />
                <div className="h-3.5 w-4/5 bg-slate-100/60 rounded-md" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200/60 rounded-xl p-5 animate-shimmer overflow-hidden space-y-4">
                <div className="h-4 w-2/3 bg-slate-200/80 rounded-md" />

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="h-3 w-full bg-slate-100/70 rounded-sm" />
                  <div className="h-3 w-4/5 bg-slate-100/70 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container-scale py-12">
        <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 p-8 rounded-xl text-center">
          <HeartOff className="w-12 h-12 text-rose-500 mx-auto mb-4" />

          <h3 className="font-semibold text-slate-900 text-lg">
            Module Resolution Error
          </h3>

          <p className="text-slate-500 text-sm mt-2">
            {error ?? "Failed to load this package."}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Back to Home
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { pkg, goMod } = data;

  const favorite = isFavorite(importPath);
  const compared = isCompared(importPath);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "summary",
      label: "AI Summary",
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />,
    },
    {
      id: "readme",
      label: "Documentation / README",
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
    {
      id: "goMod",
      label: "Inspect go.mod",
      icon: <FileCode2 className="w-3.5 h-3.5" />,
    },
    {
      id: "versions",
      label: "Available Versions",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <>
      <div className="fixed top-16 left-0 right-0 h-1.5 bg-slate-200/50 z-30 shadow-sm pointer-events-none select-none">
        <div
          className="h-full bg-linear-to-r from-cyan-400 via-[#00ADD8] to-[#007D9C] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col animate-fade-in relative">
        <div className="bg-slate-50 border-b border-slate-200 py-3 block select-none">
          <div className="container-scale flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-1 overflow-x-auto whitespace-nowrap py-1">
              <Link href="/" className="hover:text-slate-800 cursor-pointer">
                Home
              </Link>

              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />

              <Link
                href="/search"
                className="hover:text-slate-800 cursor-pointer"
              >
                Packages
              </Link>

              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />

              <span className="font-mono font-semibold text-slate-700 bg-slate-100/50 px-2 py-0.5 rounded truncate">
                {pkg.importPath}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-b from-sky-50/10 via-slate-50/45 to-white border-b border-slate-200/80 py-10 sm:py-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#00ADD8_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.035] pointer-events-none" />

          <div className="container-scale relative z-10 font-sans">
            <div className="space-y-6 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-4 select-none">
                <div className="flex flex-wrap items-center gap-2">
                  {pkg.category && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="bg-[#00ADD8]/10 text-[#007D9C] border border-[#00ADD8]/20 font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm inline-block cursor-default">
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
                        <span className="bg-linear-to-r from-[#00ADD8] to-cyan-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block cursor-default">
                          High Demand
                        </span>
                      </TooltipTrigger>

                      <TooltipContent>
                        Extremely popular in the Go ecosystem (+1,000 stars)
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {pkg.publishedAt &&
                    !["desconhecido", "unknown", "n/a"].includes(
                      pkg.publishedAt.toLowerCase(),
                    ) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-slate-400 font-normal text-xs bg-slate-100/50 px-2.5 py-0.5 rounded-md border border-slate-200/30 inline-block cursor-default">
                            Published on {pkg.publishedAt}
                          </span>
                        </TooltipTrigger>

                        <TooltipContent>
                          Date of the last module publication in the index
                        </TooltipContent>
                      </Tooltip>
                    )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 pb-5">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-none bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 bg-clip-text text-transparent">
                      {pkg.name}
                    </h2>

                    {pkg.latestVersion && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono text-xs font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                        {pkg.latestVersion}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-slate-600 select-all tracking-tight text-xs sm:text-sm font-medium bg-slate-100/60 px-2 py-1 rounded">
                      import &quot;{pkg.importPath}&quot;
                    </span>

                    {pkg.githubUrl && (
                      <a
                        href={pkg.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#007D9C] hover:text-[#005F77] font-semibold border-l border-slate-200 pl-3 transition-colors shrink-0 group font-sans"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>

                        <span className="group-hover:underline">
                          {pkg.githubUrl.replace("https://", "")}
                        </span>

                        <ExternalLink className="w-2.5 h-2.5 text-[#00ADD8]" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 select-none">
                  <button
                    onClick={() => {
                      if (compared) removeFromCompare(importPath);
                      else {
                        addToCompare(pkg);

                        router.push("/compare");
                      }
                    }}
                    disabled={!compared && isFull}
                    className={`flex items-center justify-center gap-1.5 border px-3.5 h-9 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer active:scale-95 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                      compared
                        ? "bg-slate-900 border-slate-950 text-white hover:bg-slate-800"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300"
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 shrink-0 text-[#007D9C]" />

                    <span>{compared ? "In Comparator" : "Compare"}</span>
                  </button>

                  <button
                    onClick={() => toggleFavorite(pkg)}
                    className={`flex items-center justify-center border px-3.5 h-9 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer active:scale-95 shadow-sm shrink-0 ${
                      favorite
                        ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/50"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-rose-50/25 hover:text-rose-600 hover:border-rose-200"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 shrink-0 ${favorite ? "fill-rose-500 text-rose-500" : "text-slate-400"}`}
                    />

                    <span className="ml-1.5">
                      {favorite ? "Saved" : "Save"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block select-none">
                  Install Command:
                </span>

                <div className="max-w-xl">
                  <GoInstallBlock importPath={pkg.importPath} />
                </div>
              </div>

              <p className="text-slate-600 text-sm sm:text-base max-w-4xl leading-relaxed font-light">
                {pkg.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 select-none font-sans">
                {pkg.stars > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center gap-1.5 border border-slate-200/60 bg-slate-100/35 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                        <Star className="w-3.5 h-3.5 fill-sky-300 text-sky-500 shrink-0" />
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
                      <span className="inline-flex items-center gap-1.5 border border-slate-200/60 bg-slate-100/35 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                        <GitFork className="w-3.5 h-3.5 text-[#00ADD8] shrink-0" />
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
                      <span className="inline-flex items-center gap-1.5 border border-slate-200/60 bg-slate-100/35 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                        <Database className="w-3.5 h-3.5 text-[#007D9C] shrink-0" />
                        <span>
                          {pkg.dependenciesCount === 0
                            ? "No dependencies"
                            : `${pkg.dependenciesCount} dependencies`}
                        </span>
                      </span>
                    </TooltipTrigger>

                    <TooltipContent>
                      External dependencies directly and indirectly mapped in
                      go.mod
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1.5 border border-slate-200/60 bg-slate-100/35 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                      <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />

                      <span className="font-semibold text-slate-500 text-[11px] uppercase">
                        License:
                      </span>

                      <span className="font-mono font-bold text-slate-800">
                        {pkg.license || "N/A"}
                      </span>
                    </span>
                  </TooltipTrigger>

                  <TooltipContent>
                    Copyright and distribution rights valid for this source code
                  </TooltipContent>
                </Tooltip>

                {pkg.author &&
                  !["desconhecido", "unknown", "n/a", "padrão"].includes(
                    pkg.author.toLowerCase(),
                  ) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1.5 border border-slate-200/60 bg-slate-100/35 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold cursor-default">
                          <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />

                          <span className="font-semibold text-slate-500 text-[11px] uppercase font-sans">
                            Author:
                          </span>

                          <a
                            href={`https://github.com/${pkg.author}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#007D9C] hover:text-[#00ADD8] hover:underline transition-colors shrink-0"
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

        <div className="bg-[#F8FAFC]">
          <div className="container-scale grid grid-cols-1 lg:grid-cols-4 gap-8 py-8 items-start">
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200/70 overflow-hidden flex flex-col">
              <div className="border-b border-slate-200/60 bg-slate-50/50 px-4 flex items-center h-12 overflow-x-auto scrollbar-none select-none">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleSetActiveTab(tab.id)}
                    className={`px-4 h-full text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-[#00ADD8] text-[#00ADD8] bg-white font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}

                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {activeTab === "summary" && (
                  <AiSummaryTab
                    loading={aiSummaryLoading}
                    error={aiSummaryError}
                    summary={aiSummary}
                    onRetry={() => fetchAiSummary(importPath)}
                  />
                )}

                {activeTab === "readme" && (
                  <ReadmeTab
                    readme={pkg.readme ?? ""}
                    githubUrl={pkg.githubUrl}
                  />
                )}

                {activeTab === "goMod" && (
                  <div className="space-y-4 font-mono select-text animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 select-none">
                      <span className="text-xs text-slate-500 font-semibold block">
                        go.mod file for version {pkg.latestVersion}
                      </span>
                    </div>

                    {goMod ? (
                      <CodeBlock code={goMod} language="gomod" />
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm select-none">
                        No go.mod file provided for this module version.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "versions" && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="font-display font-semibold text-slate-800 text-base border-b border-slate-100 pb-2">
                      Version History from Go Proxy
                    </h3>

                    <p className="text-xs text-slate-400">
                      The following version tags were registered for this
                      library in the official upstream response.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {pkg.versions && pkg.versions.length > 0 ? (
                        pkg.versions.map((ver) => (
                          <div
                            key={ver}
                            className={`p-3.5 rounded-lg border text-xs text-slate-700 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                              ver === pkg.latestVersion
                                ? "border-[#00ADD8] bg-sky-50 font-bold text-[#007D9C]"
                                : "border-slate-200"
                            }`}
                          >
                            <span className="font-mono">{ver}</span>

                            {ver === pkg.latestVersion && (
                              <span className="text-[9px] bg-[#00ADD8] text-white py-0.5 px-1.5 rounded uppercase font-bold tracking-tight">
                                latest
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-8 text-center text-slate-400">
                          Only the active version &apos;{pkg.latestVersion}
                          &apos; was mapped.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 lg:self-start">
              <GopherChat importPath={importPath} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
