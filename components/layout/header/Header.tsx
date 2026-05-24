"use client";

import {
  BookOpen,
  Box,
  ChevronDown,
  Code,
  Globe,
  Heart,
  type LucideIcon,
  Scale,
  Terminal,
  TrendingUp,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { HeaderSearch } from "@/components/layout/header/HeaderSearch";

const ECOSYSTEM_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "https://go.dev", label: "Official Website", icon: Globe },
  { href: "https://go.dev/doc", label: "Documentation", icon: BookOpen },
  { href: "https://pkg.go.dev", label: "Packages Search", icon: Box },
  { href: "https://go.dev/ref/spec", label: "Language Spec", icon: Code },
];

export default function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    {
      href: "/trending",
      label: "Popular Modules",
      icon: TrendingUp,
      badge: null as null | { count: number; cls: string },
    },
    {
      href: "/compare",
      label: "Package Compare",
      icon: Scale,
      badge: null,
    },
    {
      href: "/favorites",
      label: "My Favorites",
      icon: Heart,
      badge: null,
    },
  ];

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const dropdownItemClass = (route: string) => {
    const active = pathname.startsWith(route);

    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
      active
        ? "bg-sky-50 text-sky-700 shadow-sm"
        : "text-slate-700 hover:bg-slate-100 hover:text-sky-600"
    }`;
  };

  return (
    <header className="sticky top-0 z-100 bg-go-blue shadow-md select-none border-b border-[#005a71]/50 h-16 w-full">
      <div className="container-scale h-full flex items-center justify-between gap-6">
        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/"
            className="bg-white p-1.5 rounded-lg flex items-center justify-center shadow-inner hover:scale-105 transition-transform border border-white/20"
          >
            <Terminal className="w-5 h-5 text-go-blue stroke-[2.5]" />
          </Link>

          <Link
            href="/"
            className="font-display font-black text-xl tracking-tight hover:opacity-90 transition-opacity text-white"
          >
            GoPkg
          </Link>
        </div>

        <HeaderSearch onSearch={() => setMenuOpen(false)} />

        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-4 py-1.5 bg-[#005a71] border border-sky-400/30 rounded-full text-white font-bold text-sm transition-all active:scale-[0.98] outline-none focus:outline-none"
          >
            <span>Menu</span>

            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] w-72 max-h-[calc(100vh-80px)] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-130 p-3 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200 ease-out">
              <div className="md:hidden">
                <p className="px-3.5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Search
                </p>

                <HeaderSearch mobile onSearch={() => setMenuOpen(false)} />
              </div>

              <div className="space-y-1 mb-4">
                <p className="px-3.5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Navigation
                </p>

                {navLinks.map(({ href, label, icon: Icon, badge }) => (
                  <Link
                    key={href}
                    href={href as Route}
                    onClick={() => setMenuOpen(false)}
                    className={dropdownItemClass(href)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{label}</span>
                    </div>

                    {badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${badge.cls}`}
                      >
                        {badge.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              <div className="space-y-1">
                <p className="px-3.5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Go Ecosystem
                </p>

                {ECOSYSTEM_LINKS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-sky-600 transition-all"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />

                    <span>{label}</span>
                  </a>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 px-3.5 py-1 flex justify-end items-center text-[10px] text-slate-400 font-bold">
                <span className="text-sky-500">GOPKG PROJECT</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
