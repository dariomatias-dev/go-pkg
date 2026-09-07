"use client";

import { ArrowUp, Code, GitBranch, Server, Terminal } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { ECOSYSTEM_LINKS, NAV_LINKS } from "@/components/layout/nav-links";

const CURRENT_YEAR = new Date().getFullYear();

const navLinkClass =
  "group flex items-center gap-2.5 text-slate-400 hover:text-[#00ADD8] transition-all duration-200 text-xs font-medium cursor-pointer";
const externalLinkClass =
  "group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 text-xs font-medium cursor-pointer";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-[#020617] py-10 text-slate-400 select-none">
      <div className="container-scale">
        <div className="mb-10 flex justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex cursor-pointer items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-colors hover:text-white active:scale-95"
          >
            <ArrowUp className="h-3.5 w-3.5 text-[#00ADD8] transition-transform group-hover:-translate-y-1" />

            <span>Back to top</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 border-b border-slate-900/50 pb-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center space-x-2.5">
              <div className="rounded-lg bg-[#00ADD8] p-1.5 shadow-lg shadow-sky-500/10">
                <Terminal className="h-5 w-5 text-white" />
              </div>

              <span className="font-display text-xl leading-none font-black tracking-tighter text-white italic">
                GoPkg
              </span>
            </div>

            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              The high-performance discovery engine for the Golang community.
              Track dependencies and discover packages with precision.
            </p>

            <a
              href="https://github.com/dariomatias-dev/go-pkg"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 pt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase transition-all hover:text-white"
            >
              <GitBranch className="h-3.5 w-3.5" />

              <span>GitHub Repository</span>
            </a>
          </div>

          <div className="space-y-4 md:col-span-3">
            <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Navigation
            </h4>

            <ul className="space-y-3">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href as Route} className={navLinkClass}>
                    <Icon className="h-3.5 w-3.5 opacity-40" />

                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:col-span-4">
            <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              Resources
            </h4>

            <ul className="space-y-3">
              {ECOSYSTEM_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className={externalLinkClass}
                  >
                    <Icon className="h-3.5 w-3.5" />

                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 pt-8 text-[10px] font-bold tracking-widest text-slate-400 uppercase md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <Code className="h-3.5 w-3.5 text-sky-500" />

              <span>
                Developed by{" "}
                <a
                  href="https://github.com/dariomatias-dev"
                  target="_blank"
                  rel="noopener"
                  className="cursor-pointer text-slate-400 transition-colors hover:text-[#00ADD8]"
                >
                  dariomatias-dev
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Server className="h-3.5 w-3.5" />

              <span>Powered by Go Proxy API</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>© {CURRENT_YEAR} GOPKG.DEV. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
