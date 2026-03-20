// app/(teacher)/teacher/exams/page.tsx

import { createClient } from '@/lib/supabase/server'
import { requireTeacher } from '@/lib/auth/helpers'
import ExamsManager from '@/components/admin/ExamsManager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exams & Quizzes — Teacher Panel | Eloquence',
}

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

export default async function TeacherExamsPage() {
  const user = await requireTeacher()
  const supabase = await createClient()

  const { data: teacherCourses } = await supabase
    .from('teacher_courses')
    .select('course_id')
    .eq('teacher_id', user.id)

  const courseIds = (teacherCourses ?? []).map((tc: any) => tc.course_id)

  const { data: sections } = await supabase
    .from('sections')
    .select('id')
    .in('course_id', courseIds.length ? courseIds : ['none'])

  const sectionIds = (sections ?? []).map((s: any) => s.id)

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(count), quiz_attempts(count, score, passed)')
    .in('section_id', sectionIds.length ? sectionIds : ['none'])
    .order('created_at', { ascending: false })

  const quizList = (quizzes ?? []) as any[]
  const totalQuizzes = quizList.length
  const totalAttempts = quizList.reduce(
    (sum: number, q: any) => sum + (q.quiz_attempts?.length ?? 0), 0
  )

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontFamily: sans, fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#2a7a9e' }}>
          Teacher Panel
        </span>
        <h1 style={{ fontFamily: serif, fontSize: '36px', fontWeight: 600, color: '#EAE4D2', margin: '8px 0 0' }}>
          Exams &amp; Quizzes
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'My Quizzes', value: totalQuizzes },
          { label: 'Total Attempts', value: totalAttempts },
          { label: 'Pending Review', value: 0 },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', padding: '28px 28px 24px' }}>
            <p style={{ fontFamily: sans, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#8A8278', margin: '0 0 8px' }}>{stat.label}</p>
            <p style={{ fontFamily: serif, fontSize: '32px', fontWeight: 700, color: blue, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table with CRUD */}
      <ExamsManager quizzes={quizList} accentColor={blue} />
    </div>
  )
}
