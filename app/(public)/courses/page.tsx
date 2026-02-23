// 📁 app/(public)/courses/page.tsx
// Server Component — fetches all published courses from Supabase.

import { createClient } from '@/lib/supabase/server'
import CourseGrid    from '@/components/courses/CourseGrid'
import CourseFilters from '@/components/courses/CourseFilters'

export const metadata = { title: 'Courses — Eloquence' }

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; level?: string }>
}) {
  const { category, level } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('courses')
    .select('*, plans(*)')
    .eq('is_published', true)
    .order('sort_order')

  if (category) query = query.eq('category', category)
  if (level)    query = query.eq('cefr_level', level)

  const { data: courses } = await query

  return (
    <div className="min-h-screen pt-28 pb-20 px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--gold)] mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-[var(--gold)]" /> Our Curriculum
          </p>
          <h1 className="font-light leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,4vw,3rem)' }}>
            Browse All Courses
          </h1>
        </div>

        {/* Filters + Grid */}
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-56 flex-shrink-0">
            <CourseFilters activeCategory={category} activeLevel={level} />
          </aside>
          <main className="flex-1">
            <CourseGrid courses={courses ?? []} />
          </main>
        </div>
      </div>
    </div>
  )
}