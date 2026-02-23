// 📁 hooks/useQuiz.ts
'use client'

import { useState, useCallback } from 'react'
import type { QuizQuestionRow } from '@/types'

type QuizStatus = 'idle' | 'in-progress' | 'submitted'

interface QuizResult {
  score:   number
  passed:  boolean
  correct: number
  total:   number
}

/**
 * Manages quiz state: current question index, answers map, submission, and result.
 * Call `submitQuiz()` to POST to /api/quizzes/submit.
 */
export function useQuiz(quizId: string, questions: QuizQuestionRow[]) {
  const [status,      setStatus]      = useState<QuizStatus>('idle')
  const [currentIdx,  setCurrentIdx]  = useState(0)
  const [answers,     setAnswers]     = useState<Record<string, string>>({})
  const [result,      setResult]      = useState<QuizResult | null>(null)
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  const start = useCallback(() => {
    setStatus('in-progress')
    setCurrentIdx(0)
    setAnswers({})
    setResult(null)
    setError(null)
  }, [])

  const selectAnswer = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }, [])

  const next = useCallback(() => {
    setCurrentIdx((i) => Math.min(i + 1, questions.length - 1))
  }, [questions.length])

  const prev = useCallback(() => {
    setCurrentIdx((i) => Math.max(i - 1, 0))
  }, [])

  const submitQuiz = useCallback(async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res  = await fetch('/api/quizzes/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ quizId, answers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setResult(data)
      setStatus('submitted')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }, [quizId, answers])

  const answeredCount  = Object.keys(answers).length
  const isLastQuestion = currentIdx === questions.length - 1
  const currentQuestion = questions[currentIdx] ?? null
  const hasAnswered     = currentQuestion ? !!answers[currentQuestion.id] : false

  return {
    status,
    currentIdx,
    currentQuestion,
    answers,
    answeredCount,
    isLastQuestion,
    hasAnswered,
    result,
    submitting,
    error,
    start,
    selectAnswer,
    next,
    prev,
    submitQuiz,
  }
}