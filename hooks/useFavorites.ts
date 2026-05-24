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
    (modulePath: string) => favorites.some((f) => f.modulePath === modulePath),
    [favorites],
  );

  const addFavorite = useCallback((pkg: GoPackage) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.modulePath === pkg.modulePath)) return prev;

      const next = [...prev, pkg];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  }, []);

  const removeFavorite = useCallback((modulePath: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.modulePath !== modulePath);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    (pkg: GoPackage) => {
      if (isFavorite(pkg.modulePath)) {
        removeFavorite(pkg.modulePath);
      } else {
        addFavorite(pkg);
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  );

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}
