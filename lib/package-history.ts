const STORAGE_KEY = "gopkg_package_history";
const MAX_ITEMS = 5;

export function loadPackageHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToPackageHistory(importPath: string): void {
  if (!importPath.trim()) return;

  try {
    let h = loadPackageHistory();

    h = h.filter((p) => p !== importPath);
    h.unshift(importPath);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0, MAX_ITEMS)));
  } catch {}
}

export function removeFromPackageHistory(importPath: string): string[] {
  try {
    const h = loadPackageHistory().filter((p) => p !== importPath);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(h));

    return h;
  } catch {
    return [];
  }
}

export function clearPackageHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
