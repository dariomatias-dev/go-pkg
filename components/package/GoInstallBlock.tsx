"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";

interface GoInstallBlockProps {
  importPath: string;
}

export function GoInstallBlock({ importPath }: GoInstallBlockProps) {
  const [copied, setCopied] = useState(false);

  const cleanPath = importPath.split("/v")[0];
  const installCmd = `go get ${cleanPath}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 pl-3 w-fit max-w-full font-mono text-xs select-none shadow-inner border-dashed">
      <div className="flex items-center gap-1.5 min-w-0 pr-2">
        <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <span className="text-[#007D9C] font-bold select-none">$</span>

        <span className="text-slate-700 font-semibold truncate select-all">
          {installCmd}
        </span>
      </div>

      <button
        onClick={handleCopy}
        className="text-slate-400 hover:text-[#00ADD8] p-1.5 rounded-md hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer shrink-0 active:scale-90"
        title="Copy install command"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
