const STORAGE_KEY = "gopkg_package_history";
const MAX_ITEMS = 5;
const EVENT = "package-history-update";

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

export function subscribePackageHistory(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);

  return () => window.removeEventListener(EVENT, callback);
}

let _cachedRaw: string | null | undefined = undefined;
let _cachedSnapshot: string[] = [];

export function getPackageHistorySnapshot(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw !== _cachedRaw) {
      _cachedRaw = raw;
      _cachedSnapshot = raw ? (JSON.parse(raw) as string[]) : [];
    }

    return _cachedSnapshot;
  } catch {
    return _cachedSnapshot;
  }
}

export function loadPackageHistory(): string[] {
  return getPackageHistorySnapshot();
}

export function saveToPackageHistory(importPath: string): void {
  if (!importPath.trim()) return;

  try {
    let h = loadPackageHistory();

    h = h.filter((p) => p !== importPath);
    h.unshift(importPath);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0, MAX_ITEMS)));

    notify();
  } catch {}
}

export function removeFromPackageHistory(importPath: string): void {
  try {
    const h = loadPackageHistory().filter((p) => p !== importPath);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(h));

    notify();
  } catch {}
}

export function clearPackageHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);

    notify();
  } catch {}
}
