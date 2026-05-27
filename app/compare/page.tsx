import { Suspense } from "react";

import { CompareSection } from "@/components/compare/CompareSection";

export default function ComparePage() {
  return (
    <Suspense>
      <CompareSection />
    </Suspense>
  );
}
