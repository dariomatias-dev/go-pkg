import type { Metadata } from "next";

import { PackageDetail } from "@/components/package/detail/PackageDetail";
import type { Tab } from "@/components/package/detail/tabs/PackageTabs";
import { getCachedPackageDetail } from "@/lib/github/cached";

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
  const description = `Documentation, versions, and details for the Go package ${importPath}.`;
  const canonical = `/package/${segments.join("/")}`;

  return {
    title: packageName,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: packageName,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: packageName,
      description,
    },
  };
}

export default async function PackagePage({
  params,
  searchParams,
}: PackagePageProps) {
  const { importPath: segments } = await params;
  const { tab } = (await searchParams) ?? {};

  const importPath = segments.map(decodeURIComponent).join("/");
  const initialTab = VALID_TABS.has(tab as Tab) ? (tab as Tab) : undefined;
  const { pkg } = await getCachedPackageDetail(importPath);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: pkg.name,
    description: pkg.description,
    codeRepository: pkg.githubUrl,
    programmingLanguage: "Go",
    ...(pkg.license && pkg.license !== "Unknown"
      ? { license: pkg.license }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackageDetail importPath={importPath} initialTab={initialTab} />
    </>
  );
}
