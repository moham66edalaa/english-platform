import { requireUser }     from '@/lib/auth/helpers'
import { createClient }    from '@/lib/supabase/server'
import EnrolledCourseCard  from '@/components/dashboard/EnrolledCourseCard'

export const metadata = { title: 'My Courses — Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'DM Sans', sans-serif"
const teal  = '#4CC9A8'

export default async function MyCoursesPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(*), plans(*)')
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })

  const list = enrollments ?? []

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: sans,
          fontSize: '0.62rem',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: teal,
          marginBottom: 8,
        }}>
          Student
        </p>
        <h1 style={{
          fontFamily: serif,
          fontWeight: 300,
          fontSize: '2.6rem',
          color: '#EAE4D2',
          margin: 0,
          lineHeight: 1.15,
        }}>
          My Courses
        </h1>
        {list.length > 0 && (
          <p style={{
            fontFamily: sans,
            fontSize: '0.85rem',
            color: '#8A8278',
            marginTop: 8,
          }}>
            {list.length} course{list.length !== 1 ? 's' : ''} enrolled
          </p>
        )}
      </div>

      {list.length === 0 ? (
        /* Empty state */
        <div style={{
          background: '#111110',
          border: '1px solid rgba(245,240,232,0.07)',
          borderRadius: 16,
          padding: '64px 32px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: `rgba(76,201,168,0.08)`,
            border: `1px solid rgba(76,201,168,0.2)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p style={{
            fontFamily: sans,
            fontSize: '0.92rem',
            color: '#8A8278',
            marginBottom: 20,
          }}>
            You haven&apos;t enrolled in any courses yet.
          </p>
          <a href="/courses" style={{
            display: 'inline-block',
            background: teal,
            color: '#0d0f14',
            fontFamily: sans,
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '10px 28px',
            borderRadius: 8,
            textDecoration: 'none',
          }}>
            Browse Courses
          </a>
        </div>
      ) : (
        /* Course grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {list.map((enrollment: Parameters<typeof EnrolledCourseCard>[0]['enrollment']) => (
            <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} progress={0} />
          ))}
        </div>
      )}
    </div>
  )
}
