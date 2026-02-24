// app/(public)/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/helpers'
import CourseSyllabus from '@/components/courses/CourseSyllabus'
import PlanSelector from '@/components/courses/PlanSelector'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  // تحويل النوع إلى any
  const { data } = await supabase
    .from('courses')
    .select('title')
    .eq('slug', slug)
    .single() as { data: any }

  return { title: data ? `${data.title} — Eloquence` : 'Course — Eloquence' }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const user = await getUser()

  // جلب بيانات الكورس مع تحويل النوع
  const { data: course } = await supabase
    .from('courses')
    .select(`*, plans(*), sections(*, lessons(*, attachments(*)))`)
    .eq('slug', slug)
    .eq('is_published', true)
    .single() as { data: any }

  if (!course) notFound()

  // التحقق من التسجيل مع تحويل النوع
  let enrollment = null
  if (user) {
    const { data } = await supabase
      .from('enrollments')
      .select('*, plans(*)')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single() as { data: any }
    enrollment = data
  }

  const totalLessons = course.sections?.reduce(
    (acc: number, s: { lessons: unknown[] }) => acc + (s.lessons?.length ?? 0),
    0
  ) ?? 0

  return (
    <div className="min-h-screen pt-28 pb-20 px-12">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* القسم الأيسر: معلومات الكورس */}
        <div className="lg:col-span-2">
          <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--gold)] mb-3">
            {course.category === 'level' ? `Level Course · ${course.cefr_level}` :
             course.category === 'skill' ? 'Skill Course' :
             course.category === 'academic' ? 'Academic Course' : 'Exam Preparation'}
          </p>
          <h1
            className="font-light leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,4vw,3.5rem)' }}
          >
            {course.title}
          </h1>
          <p className="text-[var(--cream-dim)] leading-relaxed mb-8 text-[1rem]">
            {course.description}
          </p>

          {/* شارات إضافية */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              `${totalLessons} lessons`,
              `${course.sections?.length ?? 0} sections`,
              'Certificate included',
              'Lifetime access',
            ].map((item) => (
              <span
                key={item}
                className="text-[0.75rem] tracking-wide border border-[rgba(201,168,76,0.2)] text-[var(--cream-dim)] px-3 py-1.5 rounded-sm"
              >
                {item}
              </span>
            ))}
          </div>

          {/* المنهج الدراسي */}
          <h2
            className="text-[1.5rem] font-semibold mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Course Syllabus
          </h2>
          <CourseSyllabus sections={course.sections ?? []} />
        </div>

        {/* القسم الأيمن: اختيار الخطة */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <PlanSelector
              course={course}
              plans={course.plans ?? []}
              enrollment={enrollment}
              userId={user?.id ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  )
}