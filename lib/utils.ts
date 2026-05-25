import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeImportPath(importPath: string): string {
  return importPath.split("/").map(encodeURIComponent).join("/");
}
