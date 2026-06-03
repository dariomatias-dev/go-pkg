import { PopularPageContent } from "@/components/popular/PopularPageContent";

type PopularPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function PopularPage({ searchParams }: PopularPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page ?? "1"));

  return <PopularPageContent initialPage={page} />;
}
