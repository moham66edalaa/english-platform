// 📁 app/(public)/courses/page.tsx
import { createClient } from '@/lib/supabase/server'
import CourseGrid       from '@/components/courses/CourseGrid'
import CourseFilters    from '@/components/courses/CourseFilters'

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
    <div style={{ minHeight: '100vh', paddingTop: '7rem', paddingBottom: '5rem', paddingLeft: '3rem', paddingRight: '3rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{
            fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#c9a84c', marginBottom: '0.6rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ display: 'inline-block', width: 20, height: 1, background: '#c9a84c' }} />
            Our Curriculum
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 300,
            color: '#f5f0e8',
            lineHeight: 1.15,
            margin: 0,
          }}>
            Browse All Courses
          </h1>
        </div>

        {/* Filters + Grid */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>

          {/* Sidebar filters */}
          <aside style={{
            width: 200,
            flexShrink: 0,
            background: '#1a1e28',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: 4,
            padding: '1.25rem',
            position: 'sticky',
            top: '5.5rem',
          }}>
            <CourseFilters activeCategory={category} activeLevel={level} />
          </aside>

          {/* Course grid */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <CourseGrid courses={courses ?? []} />
          </main>

        </div>
      </div>
    </div>
  )
}
