"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
  size?: "sm" | "xs";
  useRehypeRaw?: boolean;
  extraComponents?: Partial<Components>;
}

const STYLES = {
  sm: {
    h1: "text-2xl font-bold font-display text-slate-900 dark:text-[#f0f6fc] mt-6 mb-3 border-b border-slate-100 dark:border-[#30363d] pb-2",
    h2: "text-xl font-semibold font-display text-slate-800 dark:text-[#f0f6fc] mt-5 mb-2.5",
    h3: "text-lg font-medium text-slate-800 dark:text-[#f0f6fc] mt-4 mb-2",
    p: "text-slate-600 dark:text-[#c9d1d9] text-sm leading-relaxed mb-4",
    ul: "list-disc pl-5 mb-4 text-slate-600 dark:text-[#c9d1d9] text-sm space-y-1",
    ol: "list-decimal pl-5 mb-4 text-slate-600 dark:text-[#c9d1d9] text-sm space-y-1",
    li: "leading-relaxed font-sans text-sm text-slate-600 dark:text-[#c9d1d9]",
    blockquote:
      "border-l-4 border-[#00ADD8] dark:border-sky-600 bg-sky-50/15 dark:bg-sky-950/10 p-3.5 my-4 rounded-r text-slate-700 dark:text-[#c9d1d9] italic font-light",
    a: "text-[#00ADD8] dark:text-sky-400 font-bold underline decoration-[#00ADD8]/30 dark:decoration-sky-400/30 hover:decoration-[#007D9C] dark:hover:decoration-sky-300 decoration-2 underline-offset-4 hover:text-[#007D9C] dark:hover:text-sky-300 transition-all break-all",
  },
  xs: {
    h1: "text-base font-bold text-slate-900 dark:text-[#f0f6fc] mt-4 mb-2 border-b border-slate-100 dark:border-[#30363d] pb-1",
    h2: "text-sm font-semibold text-slate-800 dark:text-[#f0f6fc] mt-3 mb-1.5",
    h3: "text-xs font-semibold text-slate-700 dark:text-[#c9d1d9] mt-2.5 mb-1",
    p: "text-xs text-slate-600 dark:text-[#c9d1d9] leading-relaxed mb-2",
    ul: "list-disc pl-4 mb-2 text-xs text-slate-600 dark:text-[#c9d1d9] space-y-0.5",
    ol: "list-decimal pl-4 mb-2 text-xs text-slate-600 dark:text-[#c9d1d9] space-y-0.5",
    li: "leading-relaxed text-xs text-slate-600 dark:text-[#c9d1d9]",
    blockquote:
      "border-l-4 border-[#00ADD8] dark:border-sky-600 bg-sky-50/15 dark:bg-sky-950/10 pl-3 py-1 my-2 rounded-r text-slate-700 dark:text-[#c9d1d9] italic text-xs",
    a: "text-[#00ADD8] dark:text-sky-400 hover:text-[#007D9C] dark:hover:text-sky-300 underline underline-offset-2 decoration-[#00ADD8]/40 text-xs transition-colors",
  },
} as const;

export function MarkdownRenderer({
  content,
  size = "sm",
  useRehypeRaw: enableRehypeRaw = false,
  extraComponents,
}: MarkdownRendererProps) {
  const s = STYLES[size];

  const components: Components = {
    pre: ({ children }) => (
      <div className="my-2 dark:text-[#e6edf3]">{children}</div>
    ),
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const codeString = String(children).replace(/\n$/, "");
      const isInline = !className && !codeString.includes("\n");

      if (!isInline) {
        return <CodeBlock code={codeString} language={language || "go"} />;
      }

      return (
        <code
          className="bg-slate-100 dark:bg-[#161b22] text-slate-800 dark:text-[#e6edf3] text-[11px] px-1.5 py-0.5 rounded font-mono font-semibold"
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => <h1 className={s.h1}>{children}</h1>,
    h2: ({ children }) => <h2 className={s.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={s.h3}>{children}</h3>,
    p: ({ children }) => <p className={s.p}>{children}</p>,
    ul: ({ children }) => <ul className={s.ul}>{children}</ul>,
    ol: ({ children }) => <ol className={s.ol}>{children}</ol>,
    li: ({ children }) => <li className={s.li}>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className={s.blockquote}>{children}</blockquote>
    ),
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={s.a}
        {...props}
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6 border border-slate-200/80 dark:border-[#30363d] rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-[#30363d] text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-50 dark:bg-[#161b22]">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-slate-200 dark:divide-[#30363d] bg-white dark:bg-[#0d1117]">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-slate-50/30 dark:hover:bg-[#161b22]/50 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-[#f0f6fc] uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-slate-600 dark:text-[#c9d1d9] font-light select-text">
        {children}
      </td>
    ),
    ...extraComponents,
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={enableRehypeRaw ? [rehypeRaw] : []}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
