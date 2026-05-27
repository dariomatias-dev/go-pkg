"use client";

import { ChevronRight } from "lucide-react";
import React, { createContext } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "./CodeBlock";

export const InListContext = createContext(false);

interface MarkdownRendererProps {
  content: string;
  size?: "sm" | "xs";
  useRehypeRaw?: boolean;
  extraComponents?: Partial<Components>;
}

function extractText(children: unknown): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children))
    return (children as unknown[]).map(extractText).join("");
  if (
    children &&
    typeof children === "object" &&
    "props" in (children as object)
  ) {
    return extractText(
      (children as { props: { children?: unknown } }).props.children,
    );
  }

  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const STYLES = {
  sm: {
    h1: "text-2xl font-bold font-display text-slate-900 dark:text-[#f0f6fc] mt-6 mb-3",
    h2: "text-xl font-semibold font-display text-slate-800 dark:text-[#f0f6fc] mt-5 mb-2.5",
    h3: "text-lg font-medium text-slate-800 dark:text-[#f0f6fc] mt-4 mb-2",
    p: "text-slate-600 dark:text-[#c9d1d9] text-sm leading-relaxed mb-4",
    ul: "list-disc pl-5 mb-4 text-slate-600 dark:text-[#c9d1d9] text-sm space-y-1",
    ol: "list-decimal pl-5 mb-4 text-slate-600 dark:text-[#c9d1d9] text-sm space-y-1",
    li: "leading-relaxed font-sans text-sm text-slate-600 dark:text-[#c9d1d9]",
    blockquote:
      "border-l-4 border-[#00ADD8] dark:border-sky-600 bg-sky-50/15 dark:bg-sky-950/10 p-3.5 my-4 rounded-r text-slate-700 dark:text-[#c9d1d9] italic font-light",
    a: "text-[#00ADD8] dark:text-sky-400 font-bold underline decoration-[#00ADD8]/30 dark:decoration-sky-400/30 hover:decoration-[#007D9C] dark:hover:decoration-sky-300 decoration-2 underline-offset-4 hover:text-[#007D9C] dark:hover:text-sky-300 transition-all break-all",
    inlineCode:
      "bg-[#007D9C]/10 dark:bg-sky-950/30 text-[#007D9C] dark:text-sky-400 border border-[#007D9C]/20 dark:border-sky-800/30 text-[11px] px-1.5 py-0.5 rounded font-mono font-semibold",
    anchor:
      "ml-2 opacity-0 group-hover:opacity-50 text-[#00ADD8] dark:text-sky-500 no-underline hover:opacity-80 transition-opacity font-normal select-none",
  },
  xs: {
    h1: "text-base font-bold text-slate-900 dark:text-[#f0f6fc] mt-4 mb-2",
    h2: "text-sm font-semibold text-slate-800 dark:text-[#f0f6fc] mt-3 mb-1.5",
    h3: "text-xs font-semibold text-slate-700 dark:text-[#c9d1d9] mt-2.5 mb-1",
    p: "text-xs text-slate-600 dark:text-[#c9d1d9] leading-relaxed mb-2",
    ul: "list-disc pl-4 mb-2 text-xs text-slate-600 dark:text-[#c9d1d9] space-y-0.5",
    ol: "list-decimal pl-4 mb-2 text-xs text-slate-600 dark:text-[#c9d1d9] space-y-0.5",
    li: "leading-relaxed text-xs text-slate-600 dark:text-[#c9d1d9]",
    blockquote:
      "border-l-4 border-[#00ADD8] dark:border-sky-600 bg-sky-50/15 dark:bg-sky-950/10 pl-3 py-1 my-2 rounded-r text-slate-700 dark:text-[#c9d1d9] italic text-xs",
    a: "text-[#00ADD8] dark:text-sky-400 hover:text-[#007D9C] dark:hover:text-sky-300 underline underline-offset-2 decoration-[#00ADD8]/40 text-xs transition-colors",
    inlineCode:
      "bg-[#007D9C]/10 dark:bg-sky-950/30 text-[#007D9C] dark:text-sky-400 border border-[#007D9C]/20 dark:border-sky-800/30 text-[10px] px-1 py-0.5 rounded font-mono font-semibold",
    anchor:
      "ml-1.5 opacity-0 group-hover:opacity-50 text-[#00ADD8] dark:text-sky-500 no-underline hover:opacity-80 transition-opacity font-normal select-none",
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
    pre: ({ children }) => <>{children}</>,
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : undefined;
      const codeString = String(children).replace(/^\n+|\n+$/g, "");
      const isBlock = !!match || codeString.includes("\n");

      if (isBlock) {
        return <CodeBlock code={codeString} language={language || "text"} />;
      }

      return <code className={s.inlineCode}>{children}</code>;
    },
    h1: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h1 id={id} className={`${s.h1} scroll-mt-20 group`}>
          {children}
          <a
            href={`#${id}`}
            className={s.anchor}
            aria-hidden="true"
            tabIndex={-1}
          >
            #
          </a>
        </h1>
      );
    },
    h2: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h2 id={id} className={`${s.h2} scroll-mt-20 group`}>
          {children}
          <a
            href={`#${id}`}
            className={s.anchor}
            aria-hidden="true"
            tabIndex={-1}
          >
            #
          </a>
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h3 id={id} className={`${s.h3} scroll-mt-20 group`}>
          {children}
          <a
            href={`#${id}`}
            className={s.anchor}
            aria-hidden="true"
            tabIndex={-1}
          >
            #
          </a>
        </h3>
      );
    },
    p: ({ children }) => <p className={s.p}>{children}</p>,
    ul: ({ children }) => <ul className={s.ul}>{children}</ul>,
    ol: ({ children }) => <ol className={s.ol}>{children}</ol>,
    li: ({ children }) => (
      <InListContext.Provider value={true}>
        <li className={s.li}>{children}</li>
      </InListContext.Provider>
    ),
    blockquote: ({ children }) => (
      <blockquote className={s.blockquote}>{children}</blockquote>
    ),
    a: ({ href, children, ...props }) => {
      const isAnchor = href?.startsWith("#");
      return (
        <a
          href={href}
          target={isAnchor ? undefined : "_blank"}
          rel={isAnchor ? undefined : "noopener noreferrer"}
          className={s.a}
          {...props}
        >
          {children}
        </a>
      );
    },
    details: ({ children, ...props }) => {
      const kids = React.Children.toArray(children);
      const isSummary = (c: React.ReactNode) =>
        React.isValidElement(c) &&
        (c as React.ReactElement<{ node?: { tagName?: string } }>).props?.node
          ?.tagName === "summary";
      const summaryEl = kids.find(isSummary);
      const contentEls = kids.filter((c) => !isSummary(c));
      return (
        <details
          className="group border border-slate-200/80 dark:border-[#30363d] rounded-lg overflow-hidden"
          {...props}
        >
          {summaryEl}
          {contentEls.length > 0 && <div className="p-4">{contentEls}</div>}
        </details>
      );
    },
    summary: ({ children, ...props }) => (
      <summary
        className="cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-[#c9d1d9] bg-slate-50/80 dark:bg-[#161b22] select-none hover:bg-slate-100/60 dark:hover:bg-[#21262d] transition-colors [&::-webkit-details-marker]:hidden list-none"
        {...props}
      >
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#8b949e] shrink-0 transition-transform group-open:rotate-90" />
        {children}
      </summary>
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
      remarkPlugins={[remarkGfm, remarkEmoji]}
      rehypePlugins={enableRehypeRaw ? [rehypeRaw] : []}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
