import type { Metadata } from "next";
import { Suspense } from "react";

import { PackageDetail } from "@/components/package/detail/PackageDetail";
import type { Tab } from "@/components/package/detail/tabs/PackageTabs";

const VALID_TABS = new Set<Tab>(["summary", "readme", "goMod", "versions"]);

type PackagePageProps = {
  params: Promise<{ importPath: string[] }>;
  searchParams?: Promise<{ tab?: string }>;
};

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { importPath: segments } = await params;

  const importPath = segments.map(decodeURIComponent).join("/");
  const packageName = segments[segments.length - 1];

  return {
    title: packageName,
    description: `Documentation, versions, and details for the Go package ${importPath}.`,
  };
}

export default function PackagePage(props: PackagePageProps) {
  return (
    <Suspense>
      <PackagePageInner {...props} />
    </Suspense>
  );
}

async function PackagePageInner({ params, searchParams }: PackagePageProps) {
  const { importPath: segments } = await params;
  const { tab } = (await searchParams) ?? {};

  const importPath = segments.map(decodeURIComponent).join("/");
  const initialTab = VALID_TABS.has(tab as Tab) ? (tab as Tab) : undefined;

  return <PackageDetail importPath={importPath} initialTab={initialTab} />;
}
