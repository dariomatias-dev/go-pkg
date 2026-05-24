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
  const cls = "w-5 h-5 text-[#00ADD8]";

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

export default function CategoriesSection({ loading }: CategoriesSectionProps) {
  const router = useRouter();

  return (
    <section className="py-12 bg-white">
      <div className="container-scale">
        <div className="border-b border-slate-100 pb-5 mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display font-medium text-2xl text-slate-900 tracking-tight">
              Curated Categories
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Browse the main structural solutions of the language
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/search")}
            className="text-xs font-semibold text-[#00ADD8] hover:text-[#007D9C] flex items-center gap-1 transition-colors"
          >
            View all packages <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-xl p-6 h-32 border border-slate-100/80 animate-shimmer relative overflow-hidden flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-200/50 shrink-0" />

                <div className="space-y-2.5 flex-1">
                  <div className="h-4 w-32 bg-slate-200/50 rounded-md" />
                  <div className="h-3 w-5/6 bg-slate-150/40 rounded-sm" />
                  <div className="h-3 w-1/2 bg-slate-150/40 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURATED_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() =>
                  router.push(
                    `/search?category=${cat.id}` as Route<`/search?category=${string}`>,
                  )
                }
                className="bg-slate-50 hover:bg-white hover:shadow-lg rounded-xl p-6 border border-slate-100 hover:border-sky-200 transition-all cursor-pointer flex items-start space-x-4 group"
              >
                <div className="bg-sky-50 group-hover:bg-[#E0F2FE] p-3 rounded-lg flex items-center justify-center shrink-0 transition-all">
                  <CategoryIcon name={cat.iconName} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 text-base group-hover:text-[#00ADD8] transition-colors flex items-center gap-1">
                    {cat.name}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
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
