import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

import Footer from "@/components/layout/Footer";
import Header  from "@/components/layout/header/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "GoPkg",
  description:
    "Search and explore Go packages with GitHub repository insights.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="bg-[#F8FAFC] text-slate-900 selection:bg-go-blue selection:text-white flex flex-col min-h-screen">
        <Header />

        <TooltipProvider>
          <main className="flex-1 flex flex-col">{children}</main>
        </TooltipProvider>

        <Footer />
      </body>
    </html>
  );
}
