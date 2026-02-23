// 📁 app/(student)/learn/[courseSlug]/page.tsx

import { notFound, redirect } from 'next/navigation'
import { requireUser }        from '@/lib/auth/helpers'
import { createClient }       from '@/lib/supabase/server'
import LessonSidebar          from '@/components/player/LessonSidebar'

export default async function CoursePlayerHomePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>
}) {
  const { courseSlug } = await params
  const user           = await requireUser()
  const supabase       = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*, sections(*, lessons(*))')
    .eq('slug', courseSlug)
    .single()

  if (!course) notFound()

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, plan_id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  if (!enrollment) redirect(`/courses/${courseSlug}`)

  // Redirect to the first lesson
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