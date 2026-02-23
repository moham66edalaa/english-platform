// app/(student)/learn/[courseSlug]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import LessonSidebar from '@/components/player/LessonSidebar'

export default async function CoursePlayerHomePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>
}) {
  const { courseSlug } = await params
  const user = await requireUser()
  const supabase = await createClient()

  // جلب بيانات الكورس مع تحويل النوع
  const { data: course } = await supabase
    .from('courses')
    .select('*, sections(*, lessons(*))')
    .eq('slug', courseSlug)
    .single() as { data: any }

  if (!course) notFound()

  // التحقق من التسجيل مع تحويل النوع
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, plan_id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single() as { data: any }

  if (!enrollment) redirect(`/courses/${courseSlug}`)

  // التوجيه إلى أول درس
  const firstLesson = course.sections?.[0]?.lessons?.[0]
  if (firstLesson) redirect(`/learn/${courseSlug}/${firstLesson.id}`)

  return (
    <div className="flex gap-8">
      <LessonSidebar course={course} activeLesson={null} progress={{}} />
      <div className="flex-1 flex items-center justify-center text-[var(--muted)]">
        No lessons found for this course yet.
      </div>
    </div>
  )
}