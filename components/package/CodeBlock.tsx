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
        '<span class="text-slate-450 italic font-light">$1</span>',
      )
      .replace(
        /(\/\*[\s\S]*?\*\/)/g,
        '<span class="text-slate-450 italic font-light">$1</span>',
      )
      .replace(
        /(&quot;.*?&quot;)/g,
        '<span class="text-emerald-600 font-normal">$1</span>',
      )
      .replace(
        /(`[\s\S]*?`)/g,
        '<span class="text-emerald-600 font-normal">$1</span>',
      )
      .replace(
        /\b(package|import|func|struct|interface|type|var|const|return|if|else|for|range|go|chan|select|defer|map|switch|case|default)\b/g,
        '<span class="text-[#007D9C] font-semibold">$1</span>',
      )
      .replace(
        /\b(\d+)\b/g,
        '<span class="text-[#00ADD8] font-medium">$1</span>',
      )
      .replace(
        /\b(string|int|int64|float64|bool|error|uint|uint64|byte|rune|any)\b/g,
        '<span class="text-violet-500 font-medium">$1</span>',
      )
      .replace(
        /\b(append|make|new|panic|recover|len|cap|print|println)\b/g,
        '<span class="text-indigo-600 font-medium">$1</span>',
      )
      .replace(
        /(\btype\s+)(\w+)/g,
        '$1<span class="text-sky-600 font-semibold">$2</span>',
      )
      .replace(
        /(\bfunc\s+)(\w+)/g,
        '$1<span class="text-indigo-600 font-medium">$2</span>',
      );
  }

  if (lang === "gomod" || lang === "go.mod") {
    return escaped
      .replace(
        /(\/\/.*)/g,
        '<span class="text-slate-450 italic font-light">$1</span>',
      )
      .replace(
        /^(module|require|replace|exclude|retract|go|toolchain)(\s)/gm,
        '<span class="text-[#007D9C] font-semibold">$1</span>$2',
      )
      .replace(
        /\b(v\d+\.\d+\.\d+(?:-[^\s]+)?)\b/g,
        '<span class="text-emerald-600 font-medium">$1</span>',
      );
  }

  if (lang === "json") {
    return escaped
      .replace(
        /(&quot;.*?&quot;)(\s*:)/g,
        '<span class="text-[#007D9C] font-semibold">$1</span>$2',
      )
      .replace(
        /(:)(\s*&quot;.*?&quot;)/g,
        '$1<span class="text-emerald-600">$2</span>',
      )
      .replace(
        /\b(true|false|null)\b/g,
        '<span class="text-indigo-600 font-semibold">$1</span>',
      )
      .replace(/\b(\d+)\b/g, '<span class="text-[#00ADD8]">$1</span>');
  }

  if (lang === "sh" || lang === "bash" || lang === "shell") {
    return escaped
      .replace(/(#.*)/g, '<span class="text-slate-400 italic">$1</span>')
      .replace(
        /\b(go|get|run|build|install|git|clone|mkdir|cd|curl|wget|tar|npm|npx)\b/g,
        '<span class="text-[#007D9C] font-bold">$1</span>',
      )
      .replace(/(\s-[a-zA-Z0-9-]+)/g, '<span class="text-amber-600">$1</span>');
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
    <div className="relative group my-4 border border-slate-200/80 rounded-xl bg-white shadow-sm overflow-hidden font-mono text-[11px] sm:text-xs">
      <div className="flex items-center justify-end px-3 py-1.5 border-b border-slate-100 bg-white select-none">
        <button
          onClick={handleCopy}
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <pre className="p-4 pl-10 text-slate-800 leading-relaxed select-text font-mono whitespace-pre overflow-x-auto">
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  );
}
