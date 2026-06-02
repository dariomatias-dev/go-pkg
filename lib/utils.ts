import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeImportPath(importPath: string): string {
  return importPath.split("/").map(encodeURIComponent).join("/");
}

export function formatRelativeTime(dateStr: string): string {
  if (
    !dateStr ||
    ["unknown", "n/a"].includes(dateStr.toLowerCase())
  ) {
    return "";
  }

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return "";

  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}min ago`;

  return "just now";
}
