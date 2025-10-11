
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add the range function
export function range(size: number, startAt: number = 0): number[] {
  return Array.from({ length: size }, (_, i) => i + startAt)
}