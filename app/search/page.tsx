import { Suspense } from "react";

import SearchSection from "@/components/search/SearchSection";

const VALID_SORTS = new Set(["best", "stars", "updated", "forks"]);

type SearchParams = {
  q?: string;
  category?: string;
  tag?: string;
  page?: string;
  perPage?: string;
  semantic?: string;
  sort?: string;
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
  const sort = VALID_SORTS.has(params?.sort ?? "") ? params!.sort! : "stars";

  return (
    <SearchSection
      key={`${params?.q ?? ""}|${params?.category ?? ""}|${params?.tag ?? ""}|${page}|${perPage}|${params?.semantic ?? ""}|${sort}`}
      initialQuery={params?.q ?? ""}
      initialCategory={params?.category ?? ""}
      initialTag={params?.tag ?? ""}
      initialPage={page}
      initialPerPage={perPage}
      initialSemantic={params?.semantic === "true"}
      initialSort={sort as "best" | "stars" | "updated" | "forks"}
    />
  );
}
