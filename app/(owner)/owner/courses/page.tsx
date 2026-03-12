import { createClient } from '@/lib/supabase/server'
import Link             from 'next/link'

export const metadata = { title: 'Courses — Owner Panel | Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function OwnerCoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*, plans(*)')
    .order('sort_order')

  const count = courses?.length ?? 0

  return (
    <>
      <style>{`
        .course-row { transition: background 0.15s; }
        .course-row:hover { background-color: rgba(245,240,232,0.02); }
        .new-course-btn { display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(201,168,76,0.25); border-radius:8px; padding:10px 18px; font-size:0.76rem; letter-spacing:0.06em; color:#C9A84C; text-decoration:none; transition:background 0.15s, border-color 0.15s; background:transparent; }
        .new-course-btn:hover { background-color:rgba(201,168,76,0.07); border-color:rgba(201,168,76,0.5); }
        .action-link { text-decoration:none; transition:opacity 0.15s; }
        .action-link:hover { opacity:0.8; text-decoration:underline; }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: gold, marginBottom: '8px' }}>
              Owner Panel
            </p>
            <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
              Courses
            </h1>
            <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
              {count} course{count !== 1 ? 's' : ''} in catalog
            </p>
          </div>
          <Link href="/owner/courses/new" className="new-course-btn" style={{ fontFamily: sans, fontWeight: 500 }}>
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>+</span>
            New Course
          </Link>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1.5fr 1.2fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            {['Title', 'Category', 'Level', 'Status', 'Plans', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                {h}
              </span>
            ))}
          </div>

          {count === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
              No courses found.
            </div>
          ) : (
            (courses ?? []).map((c: {
              id: string; slug: string; title: string; category: string;
              cefr_level: string | null; is_published: boolean;
              plans: { name: string }[]
            }, i: number) => (
              <div
                key={c.id}
                className="course-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1.5fr 1.2fr',
                  padding: '14px 24px',
                  borderBottom: i < count - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none',
                  alignItems: 'center',
                }}
              >
                {/* Title */}
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0', fontWeight: 500 }}>
                  {c.title}
                </span>

                {/* Category */}
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278', textTransform: 'capitalize' }}>
                  {c.category}
                </span>

                {/* Level */}
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                  {c.cefr_level ?? '\u2014'}
                </span>

                {/* Status badge */}
                <span>
                  <span style={{
                    fontFamily: sans, fontWeight: 600,
                    fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                    padding: '3px 9px', borderRadius: '4px',
                    backgroundColor: c.is_published ? 'rgba(34,197,94,0.1)' : 'rgba(245,240,232,0.05)',
                    border: `1px solid ${c.is_published ? 'rgba(34,197,94,0.3)' : 'rgba(245,240,232,0.1)'}`,
                    color: c.is_published ? '#4ade80' : '#6A6560',
                  }}>
                    {c.is_published ? 'Published' : 'Draft'}
                  </span>
                </span>

                {/* Plans */}
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                  {(c.plans ?? []).map((p) => p.name).join(', ') || '\u2014'}
                </span>

                {/* Actions */}
                <span style={{ display: 'flex', gap: '14px' }}>
                  <Link
                    href={`/owner/courses/${c.id}`}
                    className="action-link"
                    style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: gold }}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/owner/courses/${c.id}/sections`}
                    className="action-link"
                    style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A8278' }}
                  >
                    Sections
                  </Link>
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  )
}
