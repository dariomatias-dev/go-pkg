import type { Metadata } from "next";
import { Suspense } from "react";

import { CompareSection } from "@/components/compare/CompareSection";

export const metadata: Metadata = {
  title: "Compare Packages",
  description:
    "Compare up to three Go packages side by side: stars, forks, dependencies, and licenses.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <Suspense>
      <CompareSection />
    </Suspense>
  );
}
