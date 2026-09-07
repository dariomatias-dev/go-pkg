"use client";

import { BookOpen, FileCode2, GitBranch, Sparkles } from "lucide-react";
import { type ReactNode, Suspense } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/common/Tooltip";
import { AiSummaryTab } from "@/components/package/detail/tabs/AiSummaryTab";
import { PackageGoModTab } from "@/components/package/detail/tabs/PackageGoModTab";
import { ReadmeTab } from "@/components/package/detail/tabs/ReadmeTab";
import { VersionsReleasesTab } from "@/components/package/detail/tabs/versions/VersionsReleasesTab";
import { cn } from "@/lib/utils";
import type { GoPackage } from "@/types";

export type Tab = "summary" | "readme" | "goMod" | "versions";

interface TabDef {
  id: Tab;
  label: string;
  icon: ReactNode;
  tooltip: string;
}

const TABS: TabDef[] = [
  {
    id: "summary",
    label: "AI Summary",
    icon: (
      <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-600 dark:text-sky-400" />
    ),
    tooltip: "AI-generated overview of what this package does",
  },
  {
    id: "readme",
    label: "Documentation / README",
    icon: <BookOpen className="h-3.5 w-3.5" />,
    tooltip: "Package README and documentation from GitHub",
  },
  {
    id: "goMod",
    label: "Inspect go.mod",
    icon: <FileCode2 className="h-3.5 w-3.5" />,
    tooltip: "View the package's go.mod dependency file",
  },
  {
    id: "versions",
    label: "Versions & Releases",
    icon: <GitBranch className="h-3.5 w-3.5" />,
    tooltip: "Release history and all published versions",
  },
];

interface PackageTabsProps {
  pkg: GoPackage;
  goMod: string | undefined;
  activeTab: Tab;
  aiSummary: string;
  aiSummaryLoading: boolean;
  aiSummaryError: string | null;
  onTabChange: (tab: Tab) => void;
  onRetryAiSummary: () => void;
}

export function PackageTabs({
  pkg,
  goMod,
  activeTab,
  aiSummary,
  aiSummaryLoading,
  aiSummaryError,
  onTabChange,
  onRetryAiSummary,
}: PackageTabsProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm dark:border-[#30363d] dark:bg-[#0d1117]">
      <div className="flex h-12 scrollbar-none items-center overflow-x-auto border-b border-slate-200/60 bg-slate-50/50 px-4 select-none dark:border-[#30363d] dark:bg-[#161b22]">
        {TABS.map((tab) => (
          <Tooltip key={tab.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex h-full cursor-pointer items-center space-x-1.5 border-b-2 px-4 text-xs font-semibold whitespace-nowrap transition-all",
                  activeTab === tab.id
                    ? "border-[#00ADD8] bg-white font-bold text-[#006680] dark:border-sky-500 dark:bg-[#0d1117] dark:text-sky-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-[#8b949e] dark:hover:text-[#f0f6fc]",
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            </TooltipTrigger>

            <TooltipContent>{tab.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {activeTab === "summary" && (
          <AiSummaryTab
            loading={aiSummaryLoading}
            error={aiSummaryError}
            summary={aiSummary}
            onRetry={onRetryAiSummary}
          />
        )}

        {activeTab === "readme" && (
          <ReadmeTab readme={pkg.readme ?? ""} githubUrl={pkg.githubUrl} />
        )}

        {activeTab === "goMod" && (
          <PackageGoModTab goMod={goMod} version={pkg.latestVersion} />
        )}

        {activeTab === "versions" && (
          <Suspense>
            <VersionsReleasesTab
              importPath={pkg.importPath}
              latestVersion={pkg.latestVersion}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
