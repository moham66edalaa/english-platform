// components/admin/QuizBuilder.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CEFR_LEVELS } from '@/constants/cefr'

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

interface Question {
  id: string
  question_text: string
  correct_option: string
  cefr_level?: string
  is_active?: boolean
}

interface Props {
  questions: Question[]
  isPlacementTest?: boolean
  quizId?: string
}

const LEVEL_LABELS: Record<string, string> = {
  A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate',
  B2: 'Upper-Intermediate', C1: 'Advanced',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#0D0D0B',
  border: '1px solid rgba(245,240,232,0.1)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '0.82rem',
  color: '#E0DAC8',
  fontFamily: sans,
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function QuizBuilder({ questions, isPlacementTest, quizId }: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const [qText,   setQText]   = useState('')
  const [optA,    setOptA]    = useState('')
  const [optB,    setOptB]    = useState('')
  const [optC,    setOptC]    = useState('')
  const [optD,    setOptD]    = useState('')
  const [correct, setCorrect] = useState('a')
  const [level,   setLevel]   = useState('B1')
  const [loading, setLoading] = useState(false)
  const [openLevels, setOpenLevels] = useState<Record<string, boolean>>({
    A1: true, A2: true, B1: true, B2: true, C1: true,
  })

  // Group questions by CEFR level
  const grouped = (CEFR_LEVELS as string[]).reduce<Record<string, Question[]>>((acc, lvl) => {
    acc[lvl] = questions.filter(q => q.cefr_level === lvl)
    return acc
  }, {})

  async function addQuestion() {
    if (!qText.trim() || !optA || !optB) return
    setLoading(true)
    const options = [
      { id: 'a', text: optA },
      { id: 'b', text: optB },
      ...(optC ? [{ id: 'c', text: optC }] : []),
      ...(optD ? [{ id: 'd', text: optD }] : []),
    ]
    const payload = isPlacementTest
      ? { question_text: qText, options, correct_option: correct, cefr_level: level, is_active: true, sort_order: questions.length }
      : { question_text: qText, options, correct_option: correct, quiz_id: quizId, sort_order: questions.length }

    const table = isPlacementTest ? 'placement_test_questions' : 'quiz_questions'
    await supabase.from(table).insert(payload as never)
    setQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD('')
    setLoading(false)
    router.refresh()
  }

  async function deleteQuestion(id: string) {
    const table = isPlacementTest ? 'placement_test_questions' : 'quiz_questions'
    await supabase.from(table).delete().eq('id', id)
    router.refresh()
  }

  const toggleLevel = (lvl: string) =>
    setOpenLevels(prev => ({ ...prev, [lvl]: !prev[lvl] }))

  return (
    <div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {(CEFR_LEVELS as string[]).map(lvl => (
          <div key={lvl} style={{
            backgroundColor: '#111110',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: '10px',
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontFamily: serif, fontSize: '1.1rem', color: gold }}>{lvl}</span>
            <span style={{ fontFamily: sans, fontSize: '0.75rem', color: '#6A6560' }}>
              {grouped[lvl]?.length ?? 0} questions
            </span>
          </div>
        ))}
        <div style={{
          backgroundColor: 'rgba(201,168,76,0.07)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '10px',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontFamily: serif, fontSize: '1.1rem', color: gold }}>Total</span>
          <span style={{ fontFamily: sans, fontSize: '0.75rem', color: '#C9A84C' }}>
            {questions.length} questions
          </span>
        </div>
      </div>

      {/* Grouped question list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {(CEFR_LEVELS as string[]).map(lvl => {
          const qs     = grouped[lvl] ?? []
          const isOpen = openLevels[lvl]

          return (
            <div key={lvl} style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '14px', overflow: 'hidden' }}>

              {/* Level header */}
              <button
                onClick={() => toggleLevel(lvl)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 24px',
                  borderBottom: isOpen && qs.length > 0 ? '1px solid rgba(245,240,232,0.07)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: serif, fontSize: '1.5rem', fontWeight: 400, color: gold }}>{lvl}</span>
                  <span style={{ fontFamily: sans, fontSize: '0.72rem', color: '#8A8278' }}>
                    {LEVEL_LABELS[lvl]}
                  </span>
                  <span style={{
                    fontFamily: sans, fontSize: '0.6rem', fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    backgroundColor: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: gold, padding: '2px 8px', borderRadius: '4px',
                  }}>
                    {qs.length}
                  </span>
                </div>
                <span style={{ color: '#5E5A54', fontSize: '0.75rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  ▾
                </span>
              </button>

              {/* Questions */}
              {isOpen && qs.length > 0 && (
                <div>
                  {qs.map((q, i) => (
                    <div key={q.id} style={{
                      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px',
                      padding: '14px 24px',
                      borderBottom: i < qs.length - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                          <span style={{ fontFamily: sans, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', color: '#5E5A54', textTransform: 'uppercase' }}>
                            Q{i + 1}
                          </span>
                        </div>
                        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.85rem', color: '#D8D2C0', lineHeight: 1.6, marginBottom: '6px' }}>
                          {q.question_text}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#4ADE80', fontSize: '0.7rem' }}>✓</span>
                          <span style={{ fontFamily: sans, fontSize: '0.72rem', fontWeight: 500, color: '#4ADE80', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {q.correct_option}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        style={{
                          flexShrink: 0, background: 'none', border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: '6px', padding: '5px 12px', cursor: 'pointer',
                          fontFamily: sans, fontSize: '0.65rem', fontWeight: 600,
                          letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F87171',
                          transition: 'background 0.15s, border-color 0.15s',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isOpen && qs.length === 0 && (
                <div style={{ padding: '20px 24px', fontFamily: sans, fontSize: '0.8rem', color: '#3E3A36' }}>
                  No questions yet for this level.
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add question form */}
      <div style={{ backgroundColor: '#111110', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '16px', padding: '28px' }}>
        {/* Top gold line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #C9A84C, #E8CC80, #C9A84C)', borderRadius: '2px', marginBottom: '24px' }} />

        <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '20px' }}>
          Add New Question
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea
            rows={2} value={qText}
            onChange={e => setQText(e.target.value)}
            placeholder="Question text…"
            style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { val: optA, set: setOptA, ph: 'Option A' },
              { val: optB, set: setOptB, ph: 'Option B' },
              { val: optC, set: setOptC, ph: 'Option C (optional)' },
              { val: optD, set: setOptD, ph: 'Option D (optional)' },
            ].map(({ val, set, ph }) => (
              <input key={ph} value={val} onChange={e => set(e.target.value)} placeholder={ph} style={inputStyle} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5E5A54', display: 'block', marginBottom: '6px' }}>
                Correct Answer
              </label>
              <select value={correct} onChange={e => setCorrect(e.target.value)} style={{ ...inputStyle, width: '100px' }}>
                {['a','b','c','d'].map(v => <option key={v} value={v}>{v.toUpperCase()}</option>)}
              </select>
            </div>
            {isPlacementTest && (
              <div>
                <label style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5E5A54', display: 'block', marginBottom: '6px' }}>
                  CEFR Level
                </label>
                <select value={level} onChange={e => setLevel(e.target.value)} style={{ ...inputStyle, width: '110px' }}>
                  {(CEFR_LEVELS as string[]).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={addQuestion}
            disabled={loading || !qText.trim() || !optA || !optB}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: loading ? 'rgba(201,168,76,0.5)' : gold,
              color: '#0D0D0B',
              padding: '12px 28px', borderRadius: '8px', border: 'none',
              fontFamily: sans, fontWeight: 600,
              fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Adding…' : '+ Add Question'}
          </button>
        </div>
      </div>

    </div>
  )
}