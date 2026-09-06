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
    <div className="flex w-fit max-w-full items-center gap-2 rounded-lg border border-dashed border-slate-200/80 bg-slate-50 p-1.5 pl-3 font-mono text-xs shadow-inner transition-colors duration-300 select-none dark:border-[#30363d] dark:bg-[#0d1117]">
      <div className="flex min-w-0 items-center gap-1.5 pr-2">
        <Terminal className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-[#484f58]" />

        <span className="font-bold text-[#007D9C] select-none dark:text-sky-400">
          $
        </span>

        <span className="truncate font-semibold text-slate-700 select-all dark:text-[#c9d1d9]">
          {installCmd}
        </span>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="shrink-0 cursor-pointer rounded-md border border-transparent p-1.5 text-slate-400 transition-all hover:border-slate-200 hover:bg-white hover:text-[#00ADD8] active:scale-90 dark:text-[#484f58] dark:hover:border-[#30363d] dark:hover:bg-[#21262d] dark:hover:text-sky-400"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
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
