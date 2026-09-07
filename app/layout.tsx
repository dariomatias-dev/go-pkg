import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/header/Header";
import { ScrollToTop } from "@/components/providers/ScrollToTop";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "optional",
});

const DESCRIPTION =
  "Search and explore Go packages with GitHub repository insights.";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="selection:bg-go-blue flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 transition-colors duration-300 selection:text-white dark:bg-[#0b0e14] dark:text-[#f0f6fc] dark:selection:bg-sky-500">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-200 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-900 focus:shadow-lg dark:focus:bg-[#161b22] dark:focus:text-[#f0f6fc]"
        >
          Skip to content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <div className="bg-go-blue h-16 border-b border-[#005a71]/50 dark:border-[#30363d] dark:bg-[#0d1117]" />
            }
          >
            <Header />
          </Suspense>

          <Suspense>
            <ScrollToTop />
          </Suspense>

          <TooltipProvider>
            <main id="main-content" className="flex flex-1 flex-col">
              {children}
            </main>
          </TooltipProvider>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
