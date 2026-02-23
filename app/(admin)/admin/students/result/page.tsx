// app/(admin)/admin/students/result/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CEFR_TO_COURSE_SLUG } from '@/constants/cefr'

// تعريف الأنواع المطلوبة
type PlacementResult = {
  id: string
  user_id: string
  answers: any
  total_questions: number
  correct_answers: number
  score_by_level: any
  assigned_level: string
  taken_at: string
}

type Student = {
  id: string
  email: string
  full_name: string | null
  cefr_level: string | null
}

type RecommendedCourse = {
  id: string
  title: string
  description: string | null
  slug: string
}

export default async function StudentResultPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params
  const supabase = await createClient()

  // جلب الطالب
  const { data: student } = await supabase
    .from('users')
    .select('*')
    .eq('id', studentId)
    .single() as { data: Student | null }

  if (!student) notFound()

  // جلب آخر نتيجة اختبار للطالب
  const { data: result } = await supabase
    .from('placement_test_results')
    .select('*')
    .eq('user_id', studentId)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single() as { data: PlacementResult | null }

  // جلب الكورس الموصى به بناءً على المستوى
  const recommendedSlug = result?.assigned_level
    ? CEFR_TO_COURSE_SLUG[result.assigned_level as keyof typeof CEFR_TO_COURSE_SLUG]
    : null

  const { data: recommendedCourse } = recommendedSlug
    ? await supabase.from('courses').select('id, title, description, slug').eq('slug', recommendedSlug).single() as { data: RecommendedCourse | null }
    : { data: null }

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {student.full_name} - Result
      </h1>
      <p className="text-[var(--muted)] text-[0.85rem] mb-8">
        Placement test result and recommended course.
      </p>

      {result ? (
        <div>
          <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.3)] rounded-sm p-6 mb-6">
            <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--gold)] mb-2">Assigned Level</p>
            <p className="text-2xl font-semibold text-[var(--cream)]">{result.assigned_level}</p>
            <p className="text-sm text-[var(--muted)] mt-1">
              {result.correct_answers} / {result.total_questions} correct
            </p>
          </div>

          {recommendedCourse && (
            <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.2)] rounded-sm p-6">
              <p className="text-[0.7rem] tracking-widest uppercase text-[var(--gold)] mb-2">Recommended Course</p>
              <h3 className="text-xl font-semibold text-[var(--cream)]">{recommendedCourse.title}</h3>
              <p className="text-[var(--muted)] text-[0.85rem] mt-2">{recommendedCourse.description}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[var(--muted)]">No test result found for this student.</p>
      )}
    </div>
  )
}