// 📁 components/player/LessonQuiz.tsx
'use client'

import { useState }   from 'react'
import QuizQuestion   from '@/components/quiz/QuizQuestion'
import QuizResult     from '@/components/quiz/QuizResult'
import type { QuizRow, QuizQuestionRow } from '@/types'

interface Props {
  quiz:   QuizRow & { quiz_questions: QuizQuestionRow[] }
  userId: string
}

export default function LessonQuiz({ quiz, userId }: Props) {
  const [answers,  setAnswers]  = useState<Record<string, string>>({})
  const [result,   setResult]   = useState<{ score: number; passed: boolean; correct: number; total: number } | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch('/api/quizzes/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ quizId: quiz.id, answers }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="mt-10 bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--ink-3)] transition-colors"
      >
        <span className="font-semibold text-[1.1rem]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Section Quiz — {quiz.title}
        </span>
        <span className="text-[var(--muted)] text-[0.75rem] tracking-widest uppercase">
          {quiz.quiz_questions.length} questions {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[rgba(245,240,232,0.07)] p-6">
          {result ? (
            <QuizResult result={result} onRetry={() => { setResult(null); setAnswers({}) }} />
          ) : (
            <>
              <div className="flex flex-col gap-6 mb-6">
                {quiz.quiz_questions.map((q) => (
                  <QuizQuestion
                    key={q.id}
                    question={q}
                    selectedOption={answers[q.id] ?? null}
                    onSelect={(opt) => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    showResult={false}
                  />
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || Object.keys(answers).length < quiz.quiz_questions.length}
                className="bg-[var(--gold)] text-[var(--ink)] px-8 py-2.5 rounded-sm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Grading…' : 'Submit Quiz →'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}