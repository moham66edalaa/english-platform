// 📁 app/(student)/test/page.tsx
// URL: /test  (authenticated — student takes the placement test here)
// The public marketing page stays at /placement-test
'use client'

import { useEffect, useState } from 'react'
import { useRouter }           from 'next/navigation'
import { createClient }        from '@/lib/supabase/client'
import PlacementQuestion       from '@/components/placement/PlacementQuestion'
import PlacementProgress       from '@/components/placement/PlacementProgress'
import type { PlacementQuestion as PQ } from '@/types'

export default function TakePlacementTestPage() {
  const router = useRouter()
  const [questions,  setQuestions]  = useState<PQ[]>([])
  const [current,    setCurrent]    = useState(0)
  const [answers,    setAnswers]    = useState<Record<string, string>>({})
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('placement_test_questions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (err) setError(err.message)
      else     setQuestions((data as PQ[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  function handleAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/placement-test/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ answers }),
      })
      if (res.ok) router.push('/test/result')
      else {
        const data = await res.json()
        setError(data.error ?? 'Submission failed')
        setSubmitting(false)
      }
    } catch {
      setError('Network error — please try again')
      setSubmitting(false)
    }
  }

  /* ── Loading state ── */
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-[var(--gold)] text-[0.82rem] tracking-widest uppercase animate-pulse">
        Loading questions…
      </div>
    </div>
  )

  /* ── Error state ── */
  if (error) return (
    <div className="max-w-[700px] mx-auto mt-12 text-center">
      <p className="text-red-400 text-[0.9rem] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-sm px-6 py-4">
        {error}
      </p>
    </div>
  )

  const question = questions[current]
  const isFirst  = current === 0
  const isLast   = current === questions.length - 1
  const answered = !!answers[question?.id]

  return (
    <div className="max-w-[700px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-light text-[2rem] mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Placement Test
        </h1>
        <p className="text-[var(--muted)] text-[0.85rem]">
          Answer every question — don't leave any blank for the most accurate result.
        </p>
      </div>

      {/* Progress bar */}
      <PlacementProgress
        current={current + 1}
        total={questions.length}
        answers={answers}
        questions={questions}
      />

      {/* Question */}
      {question && (
        <PlacementQuestion
          question={question}
          selectedOption={answers[question.id] ?? null}
          onSelect={(optionId) => handleAnswer(question.id, optionId)}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={isFirst}
          className="border border-[rgba(245,240,232,0.15)] text-[var(--cream-dim)] px-6 py-2.5 rounded-sm text-[0.82rem] tracking-widest uppercase hover:border-[var(--gold)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || !answered}
            className="bg-[var(--gold)] text-[var(--ink)] px-8 py-2.5 rounded-sm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit Test →'}
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={!answered}
            className="bg-[var(--gold)] text-[var(--ink)] px-8 py-2.5 rounded-sm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}