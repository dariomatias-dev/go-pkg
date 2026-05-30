"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/common/Tooltip";

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
    <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-[#30363d] rounded-lg p-1.5 pl-3 w-fit max-w-full font-mono text-xs select-none shadow-inner border-dashed transition-colors duration-300">
      <div className="flex items-center gap-1.5 min-w-0 pr-2">
        <Terminal className="w-3.5 h-3.5 text-slate-400 dark:text-[#484f58] shrink-0" />

        <span className="text-[#007D9C] dark:text-sky-400 font-bold select-none">
          $
        </span>

        <span className="text-slate-700 dark:text-[#c9d1d9] font-semibold truncate select-all">
          {installCmd}
        </span>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="text-slate-400 dark:text-[#484f58] hover:text-[#00ADD8] dark:hover:text-sky-400 p-1.5 rounded-md hover:bg-white dark:hover:bg-[#21262d] border border-transparent hover:border-slate-200 dark:hover:border-[#30363d] transition-all cursor-pointer shrink-0 active:scale-90"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </TooltipTrigger>

        <TooltipContent>
          {copied ? "Copied!" : "Copy install command"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
