"use client";

import { HelpCircle, Sparkles } from "lucide-react";

import { MarkdownRenderer } from "@/components/package/shared/MarkdownRenderer";

interface AiSummaryTabProps {
  loading: boolean;
  error: string | null;
  summary: string;
  onRetry: () => void;
}

export function AiSummaryTab({
  loading,
  error,
  summary,
  onRetry,
}: AiSummaryTabProps) {
  return (
    <div className="animate-fade-in space-y-6 transition-colors duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-[#30363d]">
        <h4 className="font-display flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-[#f0f6fc]">
          <Sparkles className="h-5 w-5 text-[#00ADD8] dark:text-sky-400" />
          AI Technical Summary
        </h4>

        <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
          Generative Model Processing
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-[#00ADD8] dark:border-[#30363d] dark:border-t-sky-500" />

          <p className="animate-pulse font-mono text-xs text-slate-400 dark:text-slate-500">
            Requesting analysis from Gopher AI...
          </p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400">
          <HelpCircle className="h-5 w-5 shrink-0" />

          <span className="flex-1">{error}</span>

          <button
            onClick={onRetry}
            className="shrink-0 cursor-pointer rounded-lg border border-rose-300 px-2.5 py-1 text-xs font-bold transition-colors hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/40"
          >
            Retry
          </button>
        </div>
      ) : summary ? (
        <div className="space-y-4 rounded-xl border border-sky-100/30 bg-sky-50/10 p-6 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#c9d1d9]">
          <MarkdownRenderer content={summary} />
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500">
          No summary available. Reload or select this tab again to retry.
        </div>
      )}
    </div>
  );
}
