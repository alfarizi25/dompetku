import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseIndonesianNumber(value: string): number {
  if (!value) return 0

  // Remove all dots (thousand separators) and replace comma with dot for decimal
  const cleanValue = value.replace(/\./g, "").replace(",", ".")
  const parsed = Number.parseFloat(cleanValue)

  return isNaN(parsed) ? 0 : parsed
}

export function formatIndonesianNumber(value: number): string {
  return value.toLocaleString("id-ID")
}
