"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

function highlightCode(code: string, language: string): string {
  if (!code) return "";

  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const lang = (language || "").toLowerCase();

  if (lang === "go" || lang === "golang") {
    return escaped
      .replace(
        /(\/\/.*)/g,
        '<span class="text-slate-450 dark:text-slate-500 italic font-light">$1</span>',
      )
      .replace(
        /(\/\*[\s\S]*?\*\/)/g,
        '<span class="text-slate-450 dark:text-slate-500 italic font-light">$1</span>',
      )
      .replace(
        /(&quot;.*?&quot;)/g,
        '<span class="text-emerald-600 dark:text-emerald-400 font-normal">$1</span>',
      )
      .replace(
        /(`[\s\S]*?`)/g,
        '<span class="text-emerald-600 dark:text-emerald-400 font-normal">$1</span>',
      )
      .replace(
        /\b(package|import|func|struct|interface|type|var|const|return|if|else|for|range|go|chan|select|defer|map|switch|case|default)\b/g,
        '<span class="text-[#007D9C] dark:text-sky-400 font-semibold">$1</span>',
      )
      .replace(
        /\b(\d+)\b/g,
        '<span class="text-[#00ADD8] dark:text-sky-300 font-medium">$1</span>',
      )
      .replace(
        /\b(string|int|int64|float64|bool|error|uint|uint64|byte|rune|any)\b/g,
        '<span class="text-violet-500 dark:text-orange-400 font-medium">$1</span>',
      )
      .replace(
        /\b(append|make|new|panic|recover|len|cap|print|println)\b/g,
        '<span class="text-indigo-600 dark:text-violet-400 font-medium">$1</span>',
      )
      .replace(
        /(\btype\s+)(\w+)/g,
        '$1<span class="text-sky-600 dark:text-orange-300 font-semibold">$2</span>',
      )
      .replace(
        /(\bfunc\s+)(\w+)/g,
        '$1<span class="text-indigo-600 dark:text-violet-400 font-medium">$2</span>',
      );
  }

  if (lang === "gomod" || lang === "go.mod") {
    return escaped
      .replace(
        /(\/\/.*)/g,
        '<span class="text-slate-450 dark:text-slate-500 italic font-light">$1</span>',
      )
      .replace(
        /^(module|require|replace|exclude|retract|go|toolchain)(\s)/gm,
        '<span class="text-[#007D9C] dark:text-sky-400 font-semibold">$1</span>$2',
      )
      .replace(
        /\b(v\d+\.\d+\.\d+(?:-[^\s]+)?)\b/g,
        '<span class="text-emerald-600 dark:text-emerald-400 font-medium">$1</span>',
      );
  }

  if (lang === "json") {
    return escaped
      .replace(
        /(&quot;.*?&quot;)(\s*:)/g,
        '<span class="text-[#007D9C] dark:text-sky-400 font-semibold">$1</span>$2',
      )
      .replace(
        /(:)(\s*&quot;.*?&quot;)/g,
        '$1<span class="text-emerald-600 dark:text-emerald-400">$2</span>',
      )
      .replace(
        /\b(true|false|null)\b/g,
        '<span class="text-indigo-600 dark:text-violet-400 font-semibold">$1</span>',
      )
      .replace(
        /\b(\d+)\b/g,
        '<span class="text-[#00ADD8] dark:text-sky-300">$1</span>',
      );
  }

  if (lang === "sh" || lang === "bash" || lang === "shell") {
    return escaped
      .replace(
        /(#.*)/g,
        '<span class="text-slate-400 dark:text-slate-500 italic">$1</span>',
      )
      .replace(
        /\b(go|get|run|build|install|git|clone|mkdir|cd|curl|wget|tar|npm|npx)\b/g,
        '<span class="text-[#007D9C] dark:text-sky-400 font-bold">$1</span>',
      )
      .replace(
        /(\s-[a-zA-Z0-9-]+)/g,
        '<span class="text-amber-600 dark:text-amber-500">$1</span>',
      );
  }

  return escaped;
}

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedHtml = highlightCode(code, language);

  return (
    <div className="relative group my-4 border border-slate-200/80 dark:border-[#30363d] rounded-xl bg-white dark:bg-[#0d1117] shadow-sm overflow-hidden font-mono text-[11px] sm:text-xs transition-colors duration-300">
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

      <pre className="p-4 pl-10 text-slate-800 dark:text-[#c9d1d9] leading-relaxed select-text font-mono whitespace-pre overflow-x-auto custom-scrollbar">
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  );
}
