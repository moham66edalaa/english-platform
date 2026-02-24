// 📁 app/(student)/test/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter }           from 'next/navigation'
import { createClient }        from '@/lib/supabase/client'
import type { PlacementQuestion as PQ } from '@/types'
import type { QuizOption } from '@/types'

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
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

  /* ── Loading ── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '2px solid rgba(201,168,76,0.2)',
          borderTopColor: '#c9a84c',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280' }}>
          Loading questions…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  /* ── Error ── */
  if (error && questions.length === 0) return (
    <div style={{ maxWidth: 600, margin: '3rem auto' }}>
      <div style={{
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 4,
        padding: '1rem 1.25rem',
        color: '#f87171',
        fontSize: '0.88rem',
      }}>
        {error}
      </div>
    </div>
  )

  const question = questions[current]
  const isFirst  = current === 0
  const isLast   = current === questions.length - 1
  const answered = !!answers[question?.id]
  const answeredCount = questions.filter((q) => answers[q.id]).length
  const percent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{
          fontSize: '0.62rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.75)',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ display: 'inline-block', width: 16, height: 1, background: '#c9a84c' }} />
          CEFR Assessment
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2.25rem',
          fontWeight: 300,
          color: '#f5f0e8',
          lineHeight: 1.15,
          margin: 0,
        }}>
          Placement Test
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.4rem' }}>
          Answer every question — don't leave any blank for the most accurate result.
        </p>
      </div>

      {/* ── Progress ── */}
      <div style={{
        background: '#1a1e28',
        border: '1px solid rgba(245,240,232,0.07)',
        borderRadius: 4,
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.6rem',
          fontSize: '0.78rem',
          color: '#6b7280',
        }}>
          <span>Question <strong style={{ color: '#f5f0e8' }}>{current + 1}</strong> of {questions.length}</span>
          <span><strong style={{ color: '#c9a84c' }}>{answeredCount}</strong> answered</span>
        </div>
        <div style={{ height: 3, background: '#252c3a', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #c9a84c, #e8cc80)',
            borderRadius: 99,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* ── Question card ── */}
      {question && (
        <div style={{
          background: '#1a1e28',
          border: '1px solid rgba(245,240,232,0.07)',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}>
          {/* Gold top bar */}
          <div style={{
            height: 2,
            background: 'linear-gradient(90deg, #c9a84c, #e8cc80, #c9a84c)',
          }} />

          <div style={{ padding: '1.75rem' }}>
            {/* Question number + text */}
            <p style={{
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              marginBottom: '0.75rem',
              opacity: 0.75,
            }}>
              Question {current + 1}
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.35rem',
              fontWeight: 400,
              color: '#f5f0e8',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
            }}>
              {question.question_text}
            </p>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {(question.options as QuizOption[]).map((opt, i) => {
                const isSelected = answers[question.id] === opt.id
                const letters = ['A', 'B', 'C', 'D']
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(question.id, opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      padding: '0.875rem 1rem',
                      borderRadius: 3,
                      border: isSelected
                        ? '1px solid rgba(201,168,76,0.6)'
                        : '1px solid rgba(245,240,232,0.08)',
                      background: isSelected
                        ? 'rgba(201,168,76,0.08)'
                        : 'rgba(255,255,255,0.02)',
                      color: isSelected ? '#f5f0e8' : '#d8cebc',
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      width: '100%',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
                        e.currentTarget.style.color = '#f5f0e8'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)'
                        e.currentTarget.style.color = '#d8cebc'
                      }
                    }}
                  >
                    {/* Letter badge */}
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: 3,
                      border: `1px solid ${isSelected ? 'rgba(201,168,76,0.6)' : 'rgba(245,240,232,0.15)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      color: isSelected ? '#c9a84c' : '#6b7280',
                      flexShrink: 0,
                      background: isSelected ? 'rgba(201,168,76,0.1)' : 'transparent',
                    }}>
                      {letters[i] ?? opt.id.toUpperCase()}
                    </span>
                    {opt.text}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Error inline ── */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 3,
          padding: '0.75rem 1rem',
          color: '#f87171',
          fontSize: '0.82rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* ── Navigation ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={isFirst}
          style={{
            border: '1px solid rgba(245,240,232,0.15)',
            background: 'transparent',
            color: isFirst ? 'rgba(245,240,232,0.2)' : '#d8cebc',
            padding: '0.65rem 1.5rem',
            borderRadius: 3,
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: isFirst ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (!isFirst) { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.color = '#f5f0e8' } }}
          onMouseLeave={e => { if (!isFirst) { e.currentTarget.style.borderColor = 'rgba(245,240,232,0.15)'; e.currentTarget.style.color = '#d8cebc' } }}
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || !answered}
            style={{
              background: submitting || !answered ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)',
              border: 'none',
              color: '#0d0f14',
              padding: '0.65rem 2rem',
              borderRadius: 3,
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: submitting || !answered ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Test →'}
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={!answered}
            style={{
              background: !answered ? 'rgba(201,168,76,0.35)' : 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)',
              border: 'none',
              color: '#0d0f14',
              padding: '0.65rem 2rem',
              borderRadius: 3,
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: !answered ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Next →
          </button>
        )}
      </div>

    </div>
  )
}
