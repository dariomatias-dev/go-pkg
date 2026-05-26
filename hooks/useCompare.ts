"use client";

import type { GoPackage } from "@/types";
import { useCallback, useSyncExternalStore } from "react";

import {
  compareServerSnapshot,
  compareSnapshot,
  compareSubscribe,
  setCompareData,
} from "@/components/compare/data/compareStore";

const MAX_COMPARE = 3;

export function useCompare() {
  const compared = useSyncExternalStore(
    compareSubscribe,
    compareSnapshot,
    compareServerSnapshot,
  );

  const isCompared = useCallback(
    (importPath: string) => compared.some((p) => p.importPath === importPath),
    [compared],
  );

  const addToCompare = useCallback((pkg: GoPackage): boolean => {
    const current = compareSnapshot();

    if (current.some((p) => p.importPath === pkg.importPath)) return false;
    if (current.length >= MAX_COMPARE) return false;

    setCompareData([...current, pkg]);

    return true;
  }, []);

  const removeFromCompare = useCallback((importPath: string) => {
    setCompareData(
      compareSnapshot().filter((p) => p.importPath !== importPath),
    );
  }, []);

  const isFull = compared.length >= MAX_COMPARE;

  return { compared, isCompared, addToCompare, removeFromCompare, isFull };
}
