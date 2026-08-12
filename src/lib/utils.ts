import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `CA$ ${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `CA$ ${Math.round(n / 1_000)}K`
  return `CA$ ${n.toLocaleString()}`
}

export function fmtNumber(n: number): string {
  return n.toLocaleString()
}

export const ADVANCE_DELAY = 780
