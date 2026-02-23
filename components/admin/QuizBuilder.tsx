// 📁 components/admin/QuizBuilder.tsx
'use client'

import { useState }     from 'react'
import { useRouter }    from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CEFR_LEVELS }  from '@/constants/cefr'

interface Question {
  id:             string
  question_text:  string
  correct_option: string
  cefr_level?:    string
  is_active?:     boolean
}

interface Props {
  questions:        Question[]
  isPlacementTest?: boolean
  quizId?:          string
}

export default function QuizBuilder({ questions, isPlacementTest, quizId }: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const [qText,    setQText]    = useState('')
  const [optA,     setOptA]     = useState('')
  const [optB,     setOptB]     = useState('')
  const [optC,     setOptC]     = useState('')
  const [optD,     setOptD]     = useState('')
  const [correct,  setCorrect]  = useState('a')
  const [level,    setLevel]    = useState('B1')

  const inputCls = "w-full bg-[var(--ink-3)] border border-[rgba(245,240,232,0.1)] rounded-sm px-3 py-2 text-[0.82rem] text-[var(--cream)] focus:outline-none focus:border-[var(--gold)] transition-colors"

  async function addQuestion() {
    if (!qText.trim() || !optA || !optB) return
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
    await supabase.from(table).insert(payload as Record<string, unknown>)
    setQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD('')
    router.refresh()
  }

  async function deleteQuestion(id: string) {
    const table = isPlacementTest ? 'placement_test_questions' : 'quiz_questions'
    await supabase.from(table).delete().eq('id', id)
    router.refresh()
  }

  return (
    <div>
      {/* Question list */}
      <div className="flex flex-col gap-3 mb-8">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm px-5 py-4 flex items-start justify-between gap-4">
            <div>
              <span className="text-[0.62rem] tracking-widest uppercase text-[var(--gold)] mr-2">Q{i + 1}</span>
              {isPlacementTest && q.cefr_level && (
                <span className="text-[0.62rem] tracking-widest uppercase border border-[rgba(201,168,76,0.2)] text-[var(--gold)] px-1.5 py-0.5 rounded-sm mr-2">
                  {q.cefr_level}
                </span>
              )}
              <p className="text-[0.88rem] text-[var(--cream-dim)] mt-1">{q.question_text}</p>
              <p className="text-[0.75rem] text-green-400 mt-1">✓ {q.correct_option.toUpperCase()}</p>
            </div>
            <button onClick={() => deleteQuestion(q.id)}
                    className="flex-shrink-0 text-[0.7rem] text-red-400 hover:underline tracking-widest uppercase">
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add question form */}
      <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-6">
        <h3 className="font-semibold text-[1rem] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Add Question
        </h3>
        <div className="flex flex-col gap-3">
          <textarea rows={2} value={qText} onChange={(e) => setQText(e.target.value)}
                    placeholder="Question text…" className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <input value={optA} onChange={(e) => setOptA(e.target.value)} placeholder="Option A" className={inputCls} />
            <input value={optB} onChange={(e) => setOptB(e.target.value)} placeholder="Option B" className={inputCls} />
            <input value={optC} onChange={(e) => setOptC(e.target.value)} placeholder="Option C (optional)" className={inputCls} />
            <input value={optD} onChange={(e) => setOptD(e.target.value)} placeholder="Option D (optional)" className={inputCls} />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="text-[0.7rem] tracking-widest uppercase text-[var(--muted)] mb-1 block">Correct</label>
              <select value={correct} onChange={(e) => setCorrect(e.target.value)} className={`${inputCls} w-24`}>
                {['a','b','c','d'].map((v) => <option key={v} value={v}>{v.toUpperCase()}</option>)}
              </select>
            </div>
            {isPlacementTest && (
              <div>
                <label className="text-[0.7rem] tracking-widest uppercase text-[var(--muted)] mb-1 block">CEFR Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)} className={`${inputCls} w-28`}>
                  {CEFR_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            )}
          </div>
          <button onClick={addQuestion}
                  className="self-start bg-[var(--gold)] text-[var(--ink)] px-6 py-2.5 rounded-sm text-[0.78rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all">
            + Add Question
          </button>
        </div>
      </div>
    </div>
  )
}