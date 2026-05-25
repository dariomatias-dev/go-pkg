"use client";

import type { GoPackage } from "@/types";
import { useCallback, useState } from "react";

const STORAGE_KEY = "gopkg_favorites";

function loadFavorites(): GoPackage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<GoPackage[]>(loadFavorites);

  const isFavorite = useCallback(
    (importPath: string) => favorites.some((f) => f.importPath === importPath),
    [favorites],
  );

  const addFavorite = useCallback((pkg: GoPackage) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.importPath === pkg.importPath)) return prev;

      const next = [...prev, pkg];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  }, []);

  const removeFavorite = useCallback((importPath: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.importPath !== importPath);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    (pkg: GoPackage) => {
      if (isFavorite(pkg.importPath)) {
        removeFavorite(pkg.importPath);
      } else {
        addFavorite(pkg);
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  );

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}
