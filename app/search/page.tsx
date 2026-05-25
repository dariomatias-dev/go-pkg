import SearchSection from "@/components/search/SearchSection";

interface SearchPageProps {
  searchParams?: Promise<{ q?: string; category?: string; tag?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return (
    <div className="bg-slate-50/40 min-h-screen py-8">
      <div className="container-scale">
        <SearchSection
          key={`${params?.q ?? ""}|${params?.category ?? ""}|${params?.tag ?? ""}`}
          initialQuery={params?.q ?? ""}
          initialCategory={params?.category ?? ""}
          initialTag={params?.tag ?? ""}
        />
      </div>
    </div>
  );
}
