"use client";

import { Check, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { type CSSProperties, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type PrismStyle = Record<string, CSSProperties>;

const BASE: CSSProperties = {
  fontFamily: "inherit",
  textAlign: "left",
  whiteSpace: "pre",
  wordSpacing: "normal",
  wordBreak: "normal",
  lineHeight: "1.6",
  tabSize: 2,
  hyphens: "none",
  background: "transparent",
};

const lightTheme: PrismStyle = {
  'code[class*="language-"]': { ...BASE, color: "#1e293b" },
  'pre[class*="language-"]': { ...BASE, color: "#1e293b" },
  comment: { color: "#94a3b8", fontStyle: "italic", fontWeight: "300" },
  prolog: { color: "#94a3b8" },
  doctype: { color: "#94a3b8" },
  cdata: { color: "#94a3b8" },
  string: { color: "#059669" },
  "attr-value": { color: "#059669" },
  regex: { color: "#0891b2" },
  char: { color: "#0e7490" },
  inserted: { color: "#059669" },
  version: { color: "#059669", fontWeight: "500" },
  keyword: { color: "#007D9C", fontWeight: "600" },
  "control-flow": { color: "#007D9C", fontWeight: "600" },
  number: { color: "#00ADD8", fontWeight: "500" },
  constant: { color: "#00ADD8" },
  boolean: { color: "#8b5cf6", fontWeight: "500" },
  builtin: { color: "#4f46e5", fontWeight: "500" },
  function: { color: "#4f46e5", fontWeight: "500" },
  "function-variable": { color: "#4f46e5", fontWeight: "500" },
  "class-name": { color: "#0284c7", fontWeight: "600" },
  "maybe-class-name": { color: "#0284c7", fontWeight: "600" },
  symbol: { color: "#8b5cf6" },
  important: { color: "#8b5cf6", fontWeight: "600" },
  deleted: { color: "#be123c" },
  operator: { color: "#0e7490" },
  punctuation: { color: "#64748b" },
  "attr-name": { color: "#007D9C" },
  property: { color: "#007D9C" },
  tag: { color: "#007D9C" },
  variable: { color: "#d97706" },
  parameter: { color: "#0e7490" },
  namespace: { color: "#0284c7", fontStyle: "italic" },
  label: { color: "#9333ea" },
};

const darkTheme: PrismStyle = {
  'code[class*="language-"]': { ...BASE, color: "#c9d1d9" },
  'pre[class*="language-"]': { ...BASE, color: "#c9d1d9" },
  comment: { color: "#64748b", fontStyle: "italic", fontWeight: "300" },
  prolog: { color: "#64748b" },
  doctype: { color: "#64748b" },
  cdata: { color: "#64748b" },
  string: { color: "#34d399" },
  "attr-value": { color: "#34d399" },
  regex: { color: "#67e8f9" },
  char: { color: "#86efac" },
  inserted: { color: "#34d399" },
  version: { color: "#34d399", fontWeight: "500" },
  keyword: { color: "#38bdf8", fontWeight: "600" },
  "control-flow": { color: "#38bdf8", fontWeight: "600" },
  number: { color: "#7dd3fc", fontWeight: "500" },
  constant: { color: "#7dd3fc" },
  boolean: { color: "#fb923c", fontWeight: "500" },
  builtin: { color: "#a78bfa", fontWeight: "500" },
  function: { color: "#a78bfa", fontWeight: "500" },
  "function-variable": { color: "#a78bfa", fontWeight: "500" },
  "class-name": { color: "#fdba74", fontWeight: "600" },
  "maybe-class-name": { color: "#fdba74", fontWeight: "600" },
  symbol: { color: "#fb923c" },
  important: { color: "#fb923c", fontWeight: "600" },
  deleted: { color: "#f87171" },
  operator: { color: "#38bdf8" },
  punctuation: { color: "#8b949e" },
  "attr-name": { color: "#38bdf8" },
  property: { color: "#38bdf8" },
  tag: { color: "#38bdf8" },
  variable: { color: "#fbbf24" },
  parameter: { color: "#67e8f9" },
  namespace: { color: "#7dd3fc", fontStyle: "italic" },
  label: { color: "#f472b6" },
};

const LANGUAGE_MAP: Record<string, string> = {
  gomod: "go-module",
  "go.mod": "go-module",
  golang: "go",
  shell: "bash",
  sh: "bash",
};

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = resolvedTheme === "dark";
  const normalizedLang = LANGUAGE_MAP[language.toLowerCase()] ?? language;

  return (
    <div className="relative group my-4 border border-slate-200/80 dark:border-[#30363d] rounded-xl overflow-hidden shadow-sm font-mono text-[11px] sm:text-xs">
      <div className="flex items-center justify-end px-3 py-1.5 border-b border-slate-100 dark:border-[#30363d] bg-white dark:bg-[#161b22] select-none">
        <button
          onClick={handleCopy}
          className="p-1 rounded text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-[#f0f6fc] hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={normalizedLang}
        style={isDark ? darkTheme : lightTheme}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "inherit",
          lineHeight: "1.6",
          padding: "1rem",
        }}
        codeTagProps={{ style: { padding: 0, backgroundColor: "transparent" } }}
        PreTag="div"
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
