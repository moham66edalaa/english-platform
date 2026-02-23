// 📁 app/(student)/my-courses/page.tsx

import { requireUser }     from '@/lib/auth/helpers'
import { createClient }    from '@/lib/supabase/server'
import EnrolledCourseCard  from '@/components/dashboard/EnrolledCourseCard'

export const metadata = { title: 'My Courses — Eloquence' }

export default async function MyCoursesPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(*), plans(*)')
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        My Courses
      </h1>

      {(enrollments ?? []).length === 0 ? (
        <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-12 text-center">
          <p className="text-[var(--muted)] mb-4">You haven't enrolled in any courses yet.</p>
          <a href="/courses" className="text-[var(--gold)] text-[0.85rem] tracking-widest uppercase hover:underline">
            Browse Courses →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {(enrollments ?? []).map((enrollment: Parameters<typeof EnrolledCourseCard>[0]['enrollment']) => (
            <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} progress={0} />
          ))}
        </div>
      )}
    </div>
  )
}