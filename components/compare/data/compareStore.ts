import type { GoPackage } from "@/types";

const COMPARE_KEY = "gopkg_compared";
let _data: GoPackage[] = [];
let _ready = false;
const _listeners = new Set<() => void>();
const _EMPTY: GoPackage[] = [];

function _init() {
  if (_ready) return;

  _ready = true;

  try {
    const s = localStorage.getItem(COMPARE_KEY);

    if (s) _data = JSON.parse(s) as GoPackage[];
  } catch {}
}

export function compareSubscribe(cb: () => void) {
  _init();

  _listeners.add(cb);

  return () => _listeners.delete(cb);
}

export function compareSnapshot() {
  return _data;
}

export function compareServerSnapshot() {
  return _EMPTY;
}

export function getCompareData() {
  return _data;
}

export function setCompareData(next: GoPackage[]) {
  _data = next;

  try {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
  } catch {}

  _listeners.forEach((cb) => cb());
}
