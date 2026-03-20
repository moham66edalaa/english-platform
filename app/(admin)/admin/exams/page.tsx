// app/(owner)/admin/exams/page.tsx

import { createClient } from '@/lib/supabase/server'
import ExamsManager from '@/components/admin/ExamsManager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exams & Quizzes — Admin Panel | Eloquence',
}

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function OwnerExamsPage() {
  const supabase = await createClient()

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(count), quiz_attempts(count, score, passed)')
    .order('created_at', { ascending: false })

  const quizList = (quizzes ?? []) as any[]
  const totalQuizzes = quizList.length

  let totalAttempts = 0
  let totalScoreSum = 0
  let totalScoreCount = 0

  quizList.forEach((quiz: any) => {
    const attempts = quiz.quiz_attempts ?? []
    totalAttempts += attempts.length
    attempts.forEach((a: any) => {
      if (a.score != null) {
        totalScoreSum += a.score
        totalScoreCount++
      }
    })
  })

  const overallAvgScore = totalScoreCount > 0 ? (totalScoreSum / totalScoreCount).toFixed(1) : '—'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111110', color: '#EAE4D2', padding: '48px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontFamily: sans, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', color: gold, marginBottom: 8 }}>
          Admin Panel
        </p>
        <h1 style={{ fontFamily: serif, fontSize: 36, fontWeight: 600, color: '#EAE4D2', margin: '0 0 40px' }}>
          Exams &amp; Quizzes
        </h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
          {[
            { label: 'Total Quizzes', value: totalQuizzes },
            { label: 'Total Attempts', value: totalAttempts },
            { label: 'Average Score', value: `${overallAvgScore}%` },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, padding: '28px 28px 24px' }}>
              <p style={{ fontFamily: sans, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: '#8A8278', margin: '0 0 8px' }}>{s.label}</p>
              <p style={{ fontFamily: serif, fontSize: 32, fontWeight: 600, color: gold, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table with CRUD */}
        <ExamsManager quizzes={quizList} accentColor={gold} />
      </div>
    </div>
  )
}
