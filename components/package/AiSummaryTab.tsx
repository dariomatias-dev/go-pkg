"use client";

import { HelpCircle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/package/CodeBlock";

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
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <h4 className="font-display font-semibold text-lg text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#00ADD8]" />
          AI Technical Summary
        </h4>

        <span className="text-xs text-slate-400 font-mono">
          Generative Model Processing
        </span>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-[#00ADD8] animate-spin" />

          <p className="text-xs text-slate-400 font-mono animate-pulse">
            Requesting analysis from Gopher AI...
          </p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center gap-3">
          <HelpCircle className="w-5 h-5 shrink-0" />

          <span className="flex-1">{error}</span>

          <button
            onClick={onRetry}
            className="text-xs font-bold border border-rose-300 px-2.5 py-1 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      ) : summary ? (
        <div className="bg-sky-50/10 border border-sky-100/30 rounded-xl p-6 leading-relaxed text-sm text-slate-700 space-y-4 shadow-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";
                const codeString = String(children).replace(/\n$/, "");
                const isInline = !className && !codeString.includes("\n");

                if (!isInline) {
                  return (
                    <CodeBlock
                      code={codeString}
                      language={language || "markdown"}
                    />
                  );
                }

                return (
                  <code
                    className="bg-slate-100 text-slate-800 text-xs px-1.5 py-0.5 rounded font-mono font-bold"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => <>{children}</>,
              h1: ({ children }) => (
                <h1 className="text-xl font-bold font-display text-slate-900 mt-5 border-b border-slate-100 pb-1.5 mb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold font-display text-slate-800 mt-4 mb-2">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-slate-600 leading-relaxed mb-3">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 mb-3 text-slate-600 space-y-1">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-sm">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-slate-50">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-slate-200 bg-white">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-slate-50 transition-colors">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-slate-600 font-light select-text">
                  {children}
                </td>
              ),
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400">
          No summary available. Reload or select this tab again to retry.
        </div>
      )}
    </div>
  );
}
