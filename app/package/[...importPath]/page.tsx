import { PackageDetail } from "@/components/package/detail/PackageDetail";

type PackagePageProps = {
  params: Promise<{
    importPath: string[];
  }>;
};

export default async function PackagePage({ params }: PackagePageProps) {
  const { importPath: segments } = await params;

  const importPath = segments.map(decodeURIComponent).join("/");

  return <PackageDetail importPath={importPath} />;
}
