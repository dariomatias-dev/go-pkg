"use client";

import type { GoPackage } from "@/types";
import { useCallback, useState } from "react";

const STORAGE_KEY = "gopkg_compared";
const MAX_COMPARE = 3;

export function useCompare() {
  const [compared, setCompared] = useState<GoPackage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      return stored ? (JSON.parse(stored) as GoPackage[]) : [];
    } catch {
      return [];
    }
  });

  const isCompared = useCallback(
    (importPath: string) => compared.some((p) => p.importPath === importPath),
    [compared],
  );

  const addToCompare = useCallback((pkg: GoPackage): boolean => {
    let added = false;

    setCompared((prev) => {
      if (prev.some((p) => p.importPath === pkg.importPath)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;

      const next = [...prev, pkg];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      added = true;

      return next;
    });

    return added;
  }, []);

  const removeFromCompare = useCallback((importPath: string) => {
    setCompared((prev) => {
      const next = prev.filter((p) => p.importPath !== importPath);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  }, []);

  const isFull = compared.length >= MAX_COMPARE;

  return { compared, isCompared, addToCompare, removeFromCompare, isFull };
}
