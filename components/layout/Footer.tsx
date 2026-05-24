"use client";

import {
  ArrowUp,
  BookOpen,
  Code,
  GitBranch,
  Globe,
  Heart,
  type LucideIcon,
  Scale,
  Server,
  Terminal,
  TrendingUp,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

const NAV_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/trending", label: "Popular Modules", icon: TrendingUp },
  { href: "/compare", label: "Comparison Tool", icon: Scale },
  { href: "/favorites", label: "My Watchlist", icon: Heart },
];

const RESOURCE_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "https://go.dev", label: "Official Website", icon: Globe },
  { href: "https://pkg.go.dev", label: "Module Index", icon: Server },
  { href: "https://go.dev/doc", label: "Documentation", icon: BookOpen },
];

const navLinkClass =
  "group flex items-center gap-2.5 text-slate-400 hover:text-[#00ADD8] transition-all duration-200 text-xs font-medium";
const externalLinkClass =
  "group flex items-center gap-2 text-slate-500 hover:text-white transition-all duration-200 text-xs font-medium";

export default function Footer() {
  return (
    <footer className="bg-[#020617] text-slate-400 py-10 mt-auto border-t border-slate-900 select-none">
      <div className="container-scale">
        <div className="flex justify-center mb-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] group cursor-pointer active:scale-95"
          >
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform text-[#00ADD8]" />

            <span>Back to top</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-900/50">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="bg-[#00ADD8] p-1.5 rounded-lg shadow-lg shadow-sky-500/10">
                <Terminal className="w-5 h-5 text-white" />
              </div>

              <span className="font-display font-black text-white tracking-tighter text-xl italic leading-none">
                GoPkg
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 max-w-sm">
              The high-performance discovery engine for the Golang community.
              Track dependencies and discover modules with precision.
            </p>

            <a
              href="https://github.com/dariomatias-dev"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest pt-1"
            >
              <GitBranch className="w-3.5 h-3.5" />

              <span>GitHub Repository</span>
            </a>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-40">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href as Route} className={navLinkClass}>
                    <Icon className="w-3.5 h-3.5 opacity-40" />

                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-40">
              Resources
            </h4>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className={externalLinkClass}
                  >
                    <Icon className="w-3.5 h-3.5" />

                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center">
            <div className="flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-sky-500" />

              <span>
                Developed by{" "}
                <a
                  href="https://github.com/dariomatias-dev"
                  target="_blank"
                  rel="noopener"
                  className="text-slate-400 hover:text-[#00ADD8] transition-colors"
                >
                  dariomatias-dev
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5" />

              <span>Powered by Go Proxy API</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} GOPKG.DEV. Todos os direitos
              reservados.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
