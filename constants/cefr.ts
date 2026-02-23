// 📁 constants/cefr.ts
// Maps a CEFR level (returned by the placement test grader) to the
// recommended course slug so the redirect logic stays in one place.

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export const CEFR_LABELS: Record<CEFRLevel, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
}

/** After the placement test, redirect the student to this course. */
export const CEFR_TO_COURSE_SLUG: Record<CEFRLevel, string> = {
  A1: 'a1-beginner',
  A2: 'a2-elementary',
  B1: 'b1-intermediate',
  B2: 'b2-upper-intermediate',
  C1: 'c1-advanced',
}