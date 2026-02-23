'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PlacementQuestion from '@/components/placement/PlacementQuestion'
import PlacementProgress from '@/components/placement/PlacementProgress'

interface Question {
  id: string
  question_text: string
  options: Array<{ id: string; text: string }>
}

export default function TakePlacementTestPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('placement_test_questions')
        .select('id, question_text, options')
        .eq('is_active', true)
        .order('sort_order')

      if (err) {
        setError(err.message)
      } else {
        setQuestions((data as Question[]) ?? [])
      }
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (res.ok) {
        router.push('/test/result')
      } else {
        const data = await res.json()
        setError(data.error ?? 'Submission failed')
        setSubmitting(false)
      }
    } catch {
      setError('Network error — please try again')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--gold)] text-[0.82rem] tracking-widest uppercase animate-pulse">
          Loading questions…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[700px] mx-auto mt-12 text-center">
        <p className="text-red-400 text-[0.9rem] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-sm px-6 py-4">
          {error}
        </p>
      </div>
    )
  }

  const question = questions[current]
  const isFirst = current === 0
  const isLast = current === questions.length - 1
  const answered = !!answers[question?.id]

  return (
    <div className="relative flex flex-col min-h-full bg-[var(--ink)] overflow-hidden">
      {/* طبقات التوهج الذهبي الخلفية */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 800,
            height: 800,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* المحتوى الرئيسي - مسافة علوية pt-40 */}
      <div className="relative z-10 flex-1 px-4 pt-40">
        <div className="max-w-[700px] mx-auto">
          <div className="mb-8 text-center">
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

          <PlacementProgress
            current={current + 1}
            total={questions.length}
            answers={answers}
            questions={questions}
          />

          {question && (
            <PlacementQuestion
              question={question}
              selectedOption={answers[question.id] ?? null}
              onSelect={(optionId) => handleAnswer(question.id, optionId)}
              questionNumber={current + 1}
              totalQuestions={questions.length}
            />
          )}

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
      </div>
    </div>
  )
}