import { CodeBlock } from "@/components/package/shared/CodeBlock";

interface PackageGoModTabProps {
  goMod: string | undefined;
  version: string | undefined;
}

export function PackageGoModTab({ goMod, version }: PackageGoModTabProps) {
  return (
    <div className="animate-fade-in space-y-4 font-mono select-text dark:text-[#c9d1d9]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 select-none dark:border-[#30363d]">
        <span className="block text-xs font-semibold text-slate-500 dark:text-[#8b949e]">
          go.mod file for version {version}
        </span>
      </div>

      {goMod ? (
        <CodeBlock code={goMod} language="gomod" />
      ) : (
        <div className="p-8 text-center text-sm text-slate-400 select-none dark:text-[#8b949e]">
          No go.mod file provided.
        </div>
      )}
    </div>
  );
}
