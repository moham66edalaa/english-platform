// lib/placement/grader.ts
import { CEFR_LEVELS, CEFR_THRESHOLDS, type CEFRLevel } from '@/constants/cefr'

interface Question {
  id: string
  correct_option: string
  cefr_level: CEFRLevel
}

export interface GraderResult {
  assignedLevel: CEFRLevel
  scoreByLevel: Record<CEFRLevel, number>
  totalQuestions: number
  correctAnswers: number
}

export function gradePlacementTest(
  answers: Record<string, string>,
  questions: Question[]
): GraderResult {
  const correctByLevel: Record<CEFRLevel, number> = {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    C1: 0,
  }
  const totalByLevel: Record<CEFRLevel, number> = {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    C1: 0,
  }

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

  let assignedLevel: CEFRLevel = 'A1'
  for (const lvl of CEFR_LEVELS) {
    if (correctAnswers >= CEFR_THRESHOLDS[lvl]) {
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