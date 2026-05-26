import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PackageBreadcrumbProps {
  importPath: string;
}

export function PackageBreadcrumb({ importPath }: PackageBreadcrumbProps) {
  return (
    <div className="bg-slate-50 dark:bg-[#0d1117] border-b border-slate-200 dark:border-[#30363d] py-3 block select-none">
      <div className="container-scale flex items-center text-xs text-slate-500 dark:text-[#8b949e]">
        <div className="flex items-center space-x-1 overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-slate-800 dark:hover:text-[#f0f6fc] cursor-pointer">
            Home
          </Link>

          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-[#484f58]" />

          <Link href="/search" className="hover:text-slate-800 dark:hover:text-[#f0f6fc] cursor-pointer">
            Packages
          </Link>

          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-[#484f58]" />

          <span className="font-mono font-semibold text-slate-700 dark:text-[#c9d1d9] bg-slate-100/50 dark:bg-[#161b22] px-2 py-0.5 rounded truncate">
            {importPath}
          </span>
        </div>
      </div>
    </div>
  );
}
