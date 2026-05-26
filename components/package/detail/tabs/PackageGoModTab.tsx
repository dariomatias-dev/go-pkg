import { CodeBlock } from "@/components/package/shared/CodeBlock";

interface PackageGoModTabProps {
  goMod: string | undefined;
  version: string | undefined;
}

export function PackageGoModTab({ goMod, version }: PackageGoModTabProps) {
  return (
    <div className="space-y-4 font-mono select-text animate-fade-in dark:text-[#c9d1d9]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#30363d] select-none">
        <span className="text-xs text-slate-500 dark:text-[#8b949e] font-semibold block">
          go.mod file for version {version}
        </span>
      </div>

      {goMod ? (
        <CodeBlock code={goMod} language="gomod" />
      ) : (
        <div className="p-8 text-center text-slate-400 dark:text-[#8b949e] text-sm select-none">
          No go.mod file provided.
        </div>
      )}
    </div>
  );
}
