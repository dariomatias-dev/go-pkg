import type { Metadata } from "next";

import { PackageDetail } from "@/components/package/detail/PackageDetail";

type PackagePageProps = {
  params: Promise<{
    importPath: string[];
  }>;
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

export default async function PackagePage({ params }: PackagePageProps) {
  const { importPath: segments } = await params;

  const importPath = segments.map(decodeURIComponent).join("/");

  return <PackageDetail importPath={importPath} />;
}
