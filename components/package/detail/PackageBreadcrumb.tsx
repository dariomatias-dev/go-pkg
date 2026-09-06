import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PackageBreadcrumbProps {
  importPath: string;
}

export function PackageBreadcrumb({ importPath }: PackageBreadcrumbProps) {
  return (
    <div className="block border-b border-slate-200 bg-slate-50 py-3 select-none dark:border-[#30363d] dark:bg-[#0d1117]">
      <div className="container-scale flex items-center text-xs text-slate-500 dark:text-[#8b949e]">
        <div className="flex items-center space-x-1 overflow-x-auto py-1 whitespace-nowrap">
          <Link
            href="/"
            className="cursor-pointer hover:text-slate-800 dark:hover:text-[#f0f6fc]"
          >
            Home
          </Link>

          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-[#484f58]" />

          <Link
            href="/search"
            className="cursor-pointer hover:text-slate-800 dark:hover:text-[#f0f6fc]"
          >
            Packages
          </Link>

          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-[#484f58]" />

          <span className="truncate rounded bg-slate-100/50 px-2 py-0.5 font-mono font-semibold text-slate-700 dark:bg-[#161b22] dark:text-[#c9d1d9]">
            {importPath}
          </span>
        </div>
      </div>
    </div>
  );
}
