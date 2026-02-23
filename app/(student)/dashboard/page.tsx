// 📁 app/(student)/dashboard/page.tsx

import { requireUser }       from '@/lib/auth/helpers'
import { createClient }      from '@/lib/supabase/server'
import { computeProgress }   from '@/lib/utils'
import PlacementBanner       from '@/components/dashboard/PlacementBanner'
import ContinueWatching      from '@/components/dashboard/ContinueWatching'
import EnrolledCourseCard    from '@/components/dashboard/EnrolledCourseCard'

export const metadata = { title: 'Dashboard — Eloquence' }

export default async function DashboardPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  // Fetch enrollments with course + plan info
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`*, courses(*), plans(*)`)
    .eq('user_id', user.id)

  // Fetch lesson progress for progress calculation
  const { data: allProgress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', user.id)

  // Fetch total lessons per enrolled course
  const courseIds = (enrollments ?? []).map((e: { courses: { id: string } }) => e.courses.id)
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, section_id, sections(course_id)')
    .in('sections.course_id', courseIds)

  const completedIds = new Set((allProgress ?? []).filter((p: { completed: boolean }) => p.completed).map((p: { lesson_id: string }) => p.lesson_id))

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-light text-[2rem] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Welcome back, <em className="italic text-[var(--gold)]">{user.full_name?.split(' ')[0] ?? 'Student'}</em>
        </h1>
        <p className="text-[var(--muted)] text-[0.88rem]">
          {user.cefr_level ? `Current level: ${user.cefr_level}` : 'Take the placement test to discover your level.'}
        </p>
      </div>

      {/* Placement test banner if not taken */}
      {!user.cefr_level && <PlacementBanner />}

      {/* Continue watching */}
      {(enrollments ?? []).length > 0 && (
        <ContinueWatching enrollments={enrollments ?? []} progress={allProgress ?? []} />
      )}

      {/* Enrolled courses grid */}
      <h2 className="text-[1.25rem] font-semibold mt-10 mb-5"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        My Courses
      </h2>
      {(enrollments ?? []).length === 0 ? (
        <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-10 text-center">
          <p className="text-[var(--muted)] mb-4">You haven't enrolled in any courses yet.</p>
          <a href="/courses" className="text-[var(--gold)] text-[0.85rem] tracking-widest uppercase hover:underline">
            Browse Courses →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {(enrollments ?? []).map((enrollment: { courses: { id: string }; id: string; plans: unknown }) => {
            const courseId = enrollment.courses.id
            const totalLessons = (allLessons ?? []).filter(
              (l: { sections: { course_id: string } | null }) => l.sections?.course_id === courseId
            ).length
            const completedLessons = (allLessons ?? []).filter(
              (l: { id: string; sections: { course_id: string } | null }) =>
                l.sections?.course_id === courseId && completedIds.has(l.id)
            ).length
            const progress = computeProgress(totalLessons, completedLessons)

            return (
              <EnrolledCourseCard
                key={enrollment.id}
                enrollment={enrollment as Parameters<typeof EnrolledCourseCard>[0]['enrollment']}
                progress={progress}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}