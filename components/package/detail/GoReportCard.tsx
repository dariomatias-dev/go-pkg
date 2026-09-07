"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import type { GoReportCardResult } from "@/app/api/package-report/route";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const GRADE_DESCRIPTIONS: Record<string, string> = {
  "A+": "Exceptional code quality — passes all checks",
  A: "Excellent code quality — passes nearly all checks",
  B: "Good code quality — minor issues found",
  C: "Moderate issues — some improvements recommended",
  D: "Significant issues — multiple checks failing",
  F: "Poor code quality — many checks failing",
};

const GRADE_STYLES: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  "A+": {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  A: {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  B: {
    color: "text-[#006680] dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    border: "border-sky-200 dark:border-sky-500/20",
  },
  C: {
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
  },
  D: {
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-500/20",
  },
  F: {
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/20",
  },
};

export function GoReportCard({ importPath }: { importPath: string }) {
  const [state, setState] = useState<{
    result: GoReportCardResult | null;
    loading: boolean;
  }>({
    result: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/package-report?importPath=${encodeURIComponent(importPath)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (isMounted) setState({ result: d, loading: false });
      })
      .catch(() => {
        if (isMounted) setState({ result: null, loading: false });
      });

    return () => {
      isMounted = false;
    };
  }, [importPath]);

  if (state.loading) {
    return (
      <div className="animate-pulse rounded-xl border border-slate-200/70 bg-white p-4 dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="h-10 rounded-lg bg-slate-100 dark:bg-[#0d1117]" />
      </div>
    );
  }

  if (!state.result) return null;

  const style = GRADE_STYLES[state.result.grade] ?? GRADE_STYLES.F;

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#00ADD8] dark:text-sky-400" />
            <h3 className="font-display text-xs font-bold tracking-wide text-slate-900 uppercase dark:text-[#f0f6fc]">
              Report Card
            </h3>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "cursor-default font-mono text-xl font-black",
                  style.color,
                )}
              >
                {state.result.grade}
              </div>
            </TooltipTrigger>

            <TooltipContent>
              {GRADE_DESCRIPTIONS[state.result.grade] ??
                "Code quality grade from goreportcard.com"}
            </TooltipContent>
          </Tooltip>
        </div>

        <a
          href={state.result.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-[#006680] transition-all hover:bg-slate-100 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-sky-400 dark:hover:bg-[#1d222b]"
        >
          <span>VIEW FULL REPORT</span>
          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity duration-200 ease-out group-hover/link:opacity-100" />
        </a>
      </div>
    </div>
  );
}
