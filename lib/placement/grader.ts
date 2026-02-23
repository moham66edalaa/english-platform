// 📁 lib/placement/grader.ts
// Grades a placement test submission and assigns a CEFR level.

import { CEFR_LEVELS, type CEFRLevel } from '@/constants/cefr'

const PASS_THRESHOLD = 0.6   // student must score ≥ 60% in a band to "pass" it

interface Question {
  id:             string
  correct_option: string
  cefr_level:     CEFRLevel
}

export interface GraderResult {
  assignedLevel:  CEFRLevel
  scoreByLevel:   Record<CEFRLevel, number>   // 0-100 percentage per band
  totalQuestions: number
  correctAnswers: number
}

/**
 * Assign a CEFR level from a student's answers.
 *
 * Algorithm:
 *  1. Count correct answers per level band.
 *  2. Find the highest band where the student scored ≥ 60%.
 *  3. Default to A1 if no band meets the threshold.
 */
export function gradePlacementTest(
  answers:   Record<string, string>,   // { questionId: selectedOptionId }
  questions: Question[]
): GraderResult {
  const totalByLevel:   Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 }
  const correctByLevel: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 }
  let correctAnswers = 0

  for (const q of questions) {
    totalByLevel[q.cefr_level]++
    if (answers[q.id] === q.correct_option) {
      correctByLevel[q.cefr_level]++
      correctAnswers++
    }
  }

  const scoreByLevel = CEFR_LEVELS.reduce((acc, lvl) => {
    acc[lvl] = totalByLevel[lvl]
      ? Math.round((correctByLevel[lvl] / totalByLevel[lvl]) * 100)
      : 0
    return acc
  }, {} as Record<CEFRLevel, number>)

  // Walk levels from lowest to highest; keep upgrading while threshold is met
  let assignedLevel: CEFRLevel = 'A1'
  for (const lvl of CEFR_LEVELS) {
    if (totalByLevel[lvl] > 0 && scoreByLevel[lvl] / 100 >= PASS_THRESHOLD) {
      assignedLevel = lvl
    }
  }

  return {
    assignedLevel,
    scoreByLevel,
    totalQuestions: questions.length,
    correctAnswers,
  }
}