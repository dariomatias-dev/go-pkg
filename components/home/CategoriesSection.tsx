"use client";

import {
  Activity,
  CheckSquare,
  ChevronRight,
  Cpu,
  Database,
  Globe,
  Terminal,
} from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { CURATED_CATEGORIES } from "@/lib/curated-categories";

interface CategoriesSectionProps {
  loading?: boolean;
}

function CategoryIcon({ name }: { name: string }) {
  const cls = "w-5 h-5 text-[#00ADD8] dark:text-sky-400";

  switch (name) {
    case "Globe":
      return <Globe className={cls} />;
    case "Database":
      return <Database className={cls} />;
    case "Terminal":
      return <Terminal className={cls} />;
    case "Activity":
      return <Activity className={cls} />;
    case "Cpu":
      return <Cpu className={cls} />;
    case "CheckSquare":
      return <CheckSquare className={cls} />;
    default:
      return <Terminal className={cls} />;
  }
}

export function CategoriesSection({ loading }: CategoriesSectionProps) {
  const router = useRouter();

  return (
    <section className="bg-white py-12 transition-colors duration-300 dark:bg-[#0d1117]">
      <div className="container-scale">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end dark:border-[#30363d]">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-slate-900 dark:text-[#f0f6fc]">
              Curated Categories
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-[#8b949e]">
              Browse the main structural solutions of the language
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/search")}
            className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#00ADD8] transition-colors hover:text-[#007D9C] dark:text-sky-400 dark:hover:text-sky-300"
          >
            View all packages <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-shimmer relative flex h-32 items-start gap-4 overflow-hidden rounded-xl border border-slate-100/80 bg-slate-50 p-6 dark:border-[#30363d] dark:bg-[#161b22]"
              >
                <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-200/50 dark:bg-[#21262d]" />

                <div className="flex-1 space-y-2.5">
                  <div className="h-4 w-32 rounded-md bg-slate-200/50 dark:bg-[#21262d]" />
                  <div className="bg-slate-150/40 h-3 w-5/6 rounded-sm dark:bg-[#21262d]/50" />
                  <div className="bg-slate-150/40 h-3 w-1/2 rounded-sm dark:bg-[#21262d]/50" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CURATED_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() =>
                  router.push(
                    `/search?category=${cat.id}` as Route<`/search?category=${string}`>,
                  )
                }
                className="group flex cursor-pointer items-start space-x-4 rounded-xl border border-slate-100 bg-slate-50 p-6 transition-all hover:border-sky-200 hover:bg-white hover:shadow-lg dark:border-[#30363d] dark:bg-[#161b22] dark:hover:border-sky-500/30 dark:hover:bg-[#21262d] dark:hover:shadow-2xl/20"
              >
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-sky-50 p-3 transition-all group-hover:bg-[#E0F2FE] dark:bg-[#0d1117] dark:group-hover:bg-[#30363d]">
                  <CategoryIcon name={cat.iconName} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-1 text-base font-semibold text-slate-900 transition-colors group-hover:text-[#00ADD8] dark:text-[#f0f6fc] dark:group-hover:text-sky-400">
                    {cat.name}
                    <ChevronRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </h3>

                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-[#8b949e]">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
