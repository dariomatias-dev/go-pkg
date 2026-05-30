import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Suspense } from "react";

import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/header/Header";
import { ScrollToTop } from "@/components/providers/ScrollToTop";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GoPkg",
  description:
    "Search and explore Go packages with GitHub repository insights.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="bg-[#F8FAFC] dark:bg-[#0b0e14] text-slate-900 dark:text-[#f0f6fc] selection:bg-go-blue dark:selection:bg-sky-500 selection:text-white flex flex-col min-h-screen transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div className="h-16 bg-go-blue dark:bg-[#0d1117] border-b border-[#005a71]/50 dark:border-[#30363d]" />}>
            <Header />
          </Suspense>

          <Suspense>
            <ScrollToTop />
          </Suspense>

          <TooltipProvider>
            <main className="flex-1 flex flex-col">{children}</main>
          </TooltipProvider>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
