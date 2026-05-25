const STORAGE_KEY = "gopkg_search_history";
const MAX_ITEMS = 5;

export function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(query: string): void {
  if (!query.trim()) return;

  try {
    let h = loadHistory();

    h = h.filter((q) => q.toLowerCase() !== query.trim().toLowerCase());
    h.unshift(query.trim());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(0, MAX_ITEMS)));
  } catch {}
}

export function removeFromHistory(query: string): string[] {
  try {
    const h = loadHistory().filter((q) => q !== query);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(h));

    return h;
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
