// 📁 lib/utils.ts

import { type ClassValue, clsx } from 'clsx'

/** Merge Tailwind classes safely (mirrors shadcn pattern). */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Format seconds as mm:ss for video duration display. */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Format a UTC date string to a readable local date. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

/** Compute overall course progress percentage from lesson completions. */
export function computeProgress(
  totalLessons:     number,
  completedLessons: number
): number {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

/** Truncate a string with an ellipsis. */
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str
}