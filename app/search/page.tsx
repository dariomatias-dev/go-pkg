import { Suspense } from "react";

import SearchSection from "@/components/search/SearchSection";

type SearchParams = {
  q?: string;
  category?: string;
  tag?: string;
  page?: string;
  perPage?: string;
  semantic?: string;
};

type SearchPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default function SearchPage(props: SearchPageProps) {
  return (
    <div className="min-h-screen py-8">
      <div className="container-scale">
        <Suspense>
          <SearchPageInner {...props} />
        </Suspense>
      </div>
    </div>
  );
}

async function SearchPageInner({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const page = params?.page ? Math.max(1, Number(params.page)) : 1;
  const perPage = params?.perPage ? Number(params.perPage) : 10;

  return (
    <SearchSection
      key={`${params?.q ?? ""}|${params?.category ?? ""}|${params?.tag ?? ""}|${page}|${perPage}|${params?.semantic ?? ""}`}
      initialQuery={params?.q ?? ""}
      initialCategory={params?.category ?? ""}
      initialTag={params?.tag ?? ""}
      initialPage={page}
      initialPerPage={perPage}
      initialSemantic={params?.semantic === "true"}
    />
  );
}
