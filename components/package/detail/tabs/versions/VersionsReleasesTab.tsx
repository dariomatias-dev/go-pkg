"use client";

import { GitBranch } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ReleaseDetail } from "@/components/package/detail/tabs/versions/ReleaseDetail";
import { VersionList } from "@/components/package/detail/tabs/versions/VersionList";
import type { GitHubRelease } from "@/lib/github/types";

const VERSIONS_PER_PAGE = 10;

interface VersionsReleasesTabProps {
  importPath: string;
  latestVersion: string | undefined;
}

interface VersionsState {
  versions: string[];
  total: number;
  page: number;
  totalPages: number;
  paginating: boolean;
  error: boolean;
  forPath: string;
}

interface ReleasesState {
  releases: GitHubRelease[];
  error: boolean;
  forPath: string;
}

function matchRelease(
  releases: GitHubRelease[],
  version: string,
): GitHubRelease | undefined {
  return releases.find(
    (r) =>
      r.tag_name === version ||
      r.tag_name === `v${version}` ||
      `v${r.tag_name}` === version,
  );
}

export function VersionsReleasesTab({
  importPath,
  latestVersion,
}: VersionsReleasesTabProps) {
  const [selected, setSelected] = useState<string>(latestVersion ?? "");
  const [versionsState, setVersionsState] = useState<VersionsState>({
    versions: [],
    total: 0,
    page: 1,
    totalPages: 1,
    paginating: false,
    error: false,
    forPath: "",
  });
  const [releasesState, setReleasesState] = useState<ReleasesState>({
    releases: [],
    error: false,
    forPath: "",
  });

  const fetchVersionsPage = useCallback(
    (page: number) => {
      fetch(
        `/api/package-versions?importPath=${encodeURIComponent(importPath)}&page=${page}&perPage=${VERSIONS_PER_PAGE}`,
      )
        .then((r) => r.json())
        .then(
          (d: {
            versions?: string[];
            total?: number;
            page?: number;
            totalPages?: number;
          }) => {
            setVersionsState({
              versions: d.versions ?? [],
              total: d.total ?? 0,
              page: d.page ?? page,
              totalPages: d.totalPages ?? 1,
              paginating: false,
              error: false,
              forPath: importPath,
            });
          },
        )
        .catch(() => {
          setVersionsState((prev) => ({
            ...prev,
            paginating: false,
            error: true,
            forPath: importPath,
          }));
        });
    },
    [importPath],
  );

  useEffect(() => {
    fetchVersionsPage(1);
  }, [fetchVersionsPage]);

  useEffect(() => {
    let cancelled = false;

    fetch(
      `/api/package-releases?importPath=${encodeURIComponent(importPath)}&perPage=100`,
    )
      .then((r) => r.json())
      .then((d: { releases?: GitHubRelease[] }) => {
        if (!cancelled) {
          setReleasesState({
            releases: d.releases ?? [],
            error: false,
            forPath: importPath,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReleasesState({ releases: [], error: true, forPath: importPath });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [importPath]);

  const versionsLoading =
    versionsState.forPath !== importPath || versionsState.paginating;
  const releasesLoading = releasesState.forPath !== importPath;

  const { versions, page, totalPages } = versionsState;
  const { releases } = releasesState;

  const activeRelease = selected ? matchRelease(releases, selected) : undefined;

  const goToPage = (next: number) => {
    setVersionsState((prev) => ({ ...prev, paginating: true, error: false }));
    fetchVersionsPage(next);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <h3 className="font-display font-semibold text-slate-800 dark:text-[#f0f6fc] text-base border-b border-slate-100 dark:border-[#30363d] pb-2 flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-[#007D9C] dark:text-sky-400" />
        Versions &amp; Releases
      </h3>

      <div className="flex flex-col sm:flex-row gap-4 min-h-64">
        <VersionList
          versions={versions}
          loading={versionsLoading}
          error={versionsState.error}
          selected={selected}
          latestVersion={latestVersion}
          releases={releases}
          releasesLoading={releasesLoading}
          page={page}
          totalPages={totalPages}
          onSelect={setSelected}
          onPageChange={goToPage}
        />

        <ReleaseDetail
          loading={releasesLoading}
          error={releasesState.error}
          selected={selected}
          release={activeRelease}
        />
      </div>
    </div>
  );
}
