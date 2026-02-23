// 📁 app/(student)/learn/[courseSlug]/[lessonId]/page.tsx

import { notFound, redirect } from 'next/navigation'
import { requireUser }        from '@/lib/auth/helpers'
import { createClient }       from '@/lib/supabase/server'
import VideoPlayer            from '@/components/player/VideoPlayer'
import LessonSidebar          from '@/components/player/LessonSidebar'
import AttachmentList         from '@/components/player/AttachmentList'
import LessonQuiz             from '@/components/player/LessonQuiz'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonId: string }>
}) {
  const { courseSlug, lessonId } = await params
  const user                      = await requireUser()
  const supabase                  = await createClient()

  // Fetch full course structure
  const { data: course } = await supabase
    .from('courses')
    .select('*, sections(*, lessons(*, attachments(*)), quiz:quizzes(*, quiz_questions(*)))')
    .eq('slug', courseSlug)
    .single()

  if (!course) notFound()

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, plans(*)')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  if (!enrollment) redirect(`/courses/${courseSlug}`)

  // Find current lesson
  let currentLesson = null
  let currentSection = null
  for (const section of course.sections ?? []) {
    for (const lesson of section.lessons ?? []) {
      if (lesson.id === lessonId) {
        currentLesson = lesson
        currentSection = section
        break
      }
    }
    if (currentLesson) break
  }

  if (!currentLesson) notFound()

  // Fetch lesson progress
  const { data: progressData } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', user.id)

  const progressMap = (progressData ?? []).reduce(
    (acc: Record<string, boolean>, p: { lesson_id: string; completed: boolean }) => {
      acc[p.lesson_id] = p.completed
      return acc
    }, {}
  )

  const plan = (enrollment as { plans: { has_assignments: boolean } }).plans

  return (
    <div className="flex gap-0 -m-10">
      {/* Sidebar */}
      <LessonSidebar course={course} activeLesson={currentLesson} progress={progressMap} />

      {/* Main player area */}
      <div className="flex-1 p-10 overflow-y-auto">
        {/* Video */}
        <VideoPlayer lesson={currentLesson} userId={user.id} />

        {/* Lesson info */}
        <div className="mt-8 mb-6">
          <p className="text-[0.7rem] tracking-[0.15em] uppercase text-[var(--gold)] mb-2">
            {currentSection?.title}
          </p>
          <h1 className="font-light text-[2rem]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {currentLesson.title}
          </h1>
          {currentLesson.description && (
            <p className="text-[var(--cream-dim)] leading-relaxed mt-3 text-[0.92rem]">
              {currentLesson.description}
            </p>
          )}
        </div>

        {/* Attachments (Standard + Premium) */}
        {currentLesson.attachments?.length > 0 && (
          <AttachmentList attachments={currentLesson.attachments} />
        )}

        {/* Section Quiz */}
        {currentSection?.quiz && (
          <LessonQuiz quiz={currentSection.quiz} userId={user.id} />
        )}
      </div>
    </div>
  )
}