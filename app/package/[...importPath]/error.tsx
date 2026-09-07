"use client";

import { useEffect } from "react";

import { PackageDetailError } from "@/components/package/detail/PackageDetailError";

export default function PackageRouteError({
  error,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Package detail route error boundary:", error);
  }, [error]);

  return <PackageDetailError error={error.message} />;
}
