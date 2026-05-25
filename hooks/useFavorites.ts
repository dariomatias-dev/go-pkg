"use client";

import type { GoPackage } from "@/types";
import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "gopkg_favorites";
const listeners = new Set<() => void>();

const EMPTY: GoPackage[] = [];
let snapshotCache: GoPackage[] = EMPTY;
let snapshotRaw: string | null = null;

function getSnapshot(): GoPackage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === snapshotRaw) return snapshotCache;
    snapshotRaw = raw;
    snapshotCache = raw ? (JSON.parse(raw) as GoPackage[]) : EMPTY;
    return snapshotCache;
  } catch {
    return EMPTY;
  }
}

function getServerSnapshot(): GoPackage[] {
  return EMPTY;
}

function emit() {
  listeners.forEach((l) => l());
}

function persist(favorites: GoPackage[]) {
  const raw = JSON.stringify(favorites);
  localStorage.setItem(STORAGE_KEY, raw);
  snapshotRaw = raw;
  snapshotCache = favorites;
  emit();
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getSnapshot,
    getServerSnapshot,
  );

  const isFavorite = useCallback(
    (importPath: string) => favorites.some((f) => f.importPath === importPath),
    [favorites],
  );

  const addFavorite = useCallback((pkg: GoPackage) => {
    const current = getSnapshot();
    if (current.some((f) => f.importPath === pkg.importPath)) return;
    persist([...current, pkg]);
  }, []);

  const removeFavorite = useCallback((importPath: string) => {
    persist(getSnapshot().filter((f) => f.importPath !== importPath));
  }, []);

  const toggleFavorite = useCallback(
    (pkg: GoPackage) => {
      if (getSnapshot().some((f) => f.importPath === pkg.importPath)) {
        removeFavorite(pkg.importPath);
      } else {
        addFavorite(pkg);
      }
    },
    [addFavorite, removeFavorite],
  );

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}
