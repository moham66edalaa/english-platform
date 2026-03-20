'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'

const serif = "'Cormorant Garamond', serif"
const sans = "'Raleway', sans-serif"

interface ExamsManagerProps {
  quizzes: any[]
  accentColor?: string
}

export default function ExamsManager({ quizzes, accentColor = '#C9A84C' }: ExamsManagerProps) {
  const supabase = createClient()
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const quizToDelete = quizzes.find((q) => q.id === deleteId)

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('quizzes').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    router.refresh()
  }

  return (
    <>
      {/* Header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr',
          gap: '12px',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(245,240,232,0.06)',
        }}
      >
        {['Exam', 'Questions', 'Attempts', 'Avg Score', 'Pass Rate', 'Actions'].map((h) => (
          <span
            key={h}
            style={{
              fontFamily: sans,
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#8A8278',
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Quiz rows */}
      {quizzes.map((quiz) => {
        const attempts = quiz.quiz_attempts ?? []
        const avgScore =
          attempts.length > 0
            ? Math.round(attempts.reduce((sum: number, a: any) => sum + (a.score ?? 0), 0) / attempts.length)
            : 0
        const passRate =
          attempts.length > 0
            ? Math.round(
                (attempts.filter((a: any) => (a.score ?? 0) >= (quiz.pass_score ?? 70)).length /
                  attempts.length) *
                  100
              )
            : 0

        return (
          <div
            key={quiz.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.5fr',
              gap: '12px',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(245,240,232,0.04)',
              alignItems: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,240,232,0.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Title + pass score */}
            <div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#F5F0E8',
                }}
              >
                {quiz.title}
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: '0.72rem',
                  color: '#8A8278',
                  marginTop: '2px',
                }}
              >
                Pass: {quiz.pass_score ?? 70}%
              </div>
            </div>

            {/* Questions count */}
            <span style={{ fontFamily: sans, fontSize: '0.88rem', color: '#C2B9A7' }}>
              {quiz.questions?.length ?? quiz.question_count ?? 0}
            </span>

            {/* Attempts count */}
            <span style={{ fontFamily: sans, fontSize: '0.88rem', color: '#C2B9A7' }}>
              {attempts.length}
            </span>

            {/* Avg Score */}
            <span style={{ fontFamily: sans, fontSize: '0.88rem', color: '#C2B9A7' }}>
              {attempts.length > 0 ? `${avgScore}%` : '—'}
            </span>

            {/* Pass Rate */}
            <span
              style={{
                fontFamily: sans,
                fontSize: '0.88rem',
                color: passRate >= 70 ? '#4CAF50' : passRate > 0 ? '#FF9800' : '#8A8278',
              }}
            >
              {attempts.length > 0 ? `${passRate}%` : '—'}
            </span>

            {/* Delete button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteId(quiz.id)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(245,240,232,0.08)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  color: '#8A8278',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444'
                  e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
                  e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8A8278'
                  e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)'
                  e.currentTarget.style.background = 'transparent'
                }}
                aria-label={`Delete ${quiz.title}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        )
      })}

      {/* Empty state */}
      {quizzes.length === 0 && (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            fontFamily: sans,
            fontSize: '0.85rem',
            color: '#8A8278',
          }}
        >
          No exams found.
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Exam" size="sm">
        <p
          style={{
            fontFamily: sans,
            fontSize: '0.88rem',
            color: '#C2B9A7',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          Delete quiz &lsquo;{quizToDelete?.title}&rsquo;? This will remove all associated questions
          and attempts.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setDeleteId(null)}
            style={{
              fontFamily: sans,
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(245,240,232,0.12)',
              background: 'transparent',
              color: '#C2B9A7',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              fontFamily: sans,
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#EF4444',
              color: '#fff',
              cursor: deleting ? 'not-allowed' : 'pointer',
              opacity: deleting ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </>
  )
}
