"use client";

import { BookOpen, FileCode2, GitBranch, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { AiSummaryTab } from "@/components/package/detail/tabs/AiSummaryTab";
import { PackageGoModTab } from "@/components/package/detail/tabs/PackageGoModTab";
import { ReadmeTab } from "@/components/package/detail/tabs/ReadmeTab";
import { VersionsReleasesTab } from "@/components/package/detail/tabs/versions/VersionsReleasesTab";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/common/Tooltip";
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
      <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-sky-400 animate-pulse" />
    ),
    tooltip: "AI-generated overview of what this package does",
  },
  {
    id: "readme",
    label: "Documentation / README",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    tooltip: "Package README and documentation from GitHub",
  },
  {
    id: "goMod",
    label: "Inspect go.mod",
    icon: <FileCode2 className="w-3.5 h-3.5" />,
    tooltip: "View the module's go.mod dependency file",
  },
  {
    id: "versions",
    label: "Versions & Releases",
    icon: <GitBranch className="w-3.5 h-3.5" />,
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
    <div className="bg-white dark:bg-[#0d1117] rounded-xl shadow-sm border border-slate-200/70 dark:border-[#30363d] overflow-hidden flex flex-col">
      <div className="border-b border-slate-200/60 dark:border-[#30363d] bg-slate-50/50 dark:bg-[#161b22] px-4 flex items-center h-12 overflow-x-auto scrollbar-none select-none">
        {TABS.map((tab) => (
          <Tooltip key={tab.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "px-4 h-full text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-[#00ADD8] dark:border-sky-500 text-[#00ADD8] dark:text-sky-400 bg-white dark:bg-[#0d1117] font-bold"
                    : "border-transparent text-slate-500 dark:text-[#8b949e] hover:text-slate-800 dark:hover:text-[#f0f6fc]",
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
          <VersionsReleasesTab
            importPath={pkg.importPath}
            latestVersion={pkg.latestVersion}
          />
        )}
      </div>
    </div>
  );
}
