// constants/cefr.ts
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export const CEFR_LABELS: Record<CEFRLevel, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
}

export const CEFR_THRESHOLDS: Record<CEFRLevel, number> = {
  A1: 0,
  A2: 10,
  B1: 18,
  B2: 24,
  C1: 28,
}

export const CEFR_TO_COURSE_SLUG: Record<CEFRLevel, string> = {
  A1: 'a1-beginner',
  A2: 'a2-elementary',
  B1: 'b1-intermediate',
  B2: 'b2-upper-intermediate',
  C1: 'c1-advanced',
}