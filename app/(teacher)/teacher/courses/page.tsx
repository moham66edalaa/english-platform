// app/(teacher)/teacher/courses/page.tsx

import { createClient } from '@/lib/supabase/server'
import Link             from 'next/link'

export const metadata = { title: 'Courses — Eloquence Teacher Panel' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

export default async function TeacherCoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*, plans(*)')
    .order('sort_order')

  const courseList = courses ?? []

  return (
    <>
      <style>{`
        .course-row { transition: background-color 0.2s; }
        .course-row:hover { background-color: rgba(76,168,201,0.04); }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: blue, marginBottom: '8px' }}>
              Teacher Panel
            </p>
            <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
              Courses
            </h1>
            <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
              {courseList.length} course{courseList.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <Link
            href="/teacher/courses/new"
            style={{
              fontFamily: sans,
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: blue,
              border: `1px solid rgba(76,168,201,0.35)`,
              borderRadius: '8px',
              padding: '10px 22px',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap' as const,
            }}
          >
            + New Course
          </Link>
        </div>

        {/* Table card */}
        <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: sans, fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
                {['Title', 'Category', 'Level', 'Status', 'Plans'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontFamily: sans,
                      fontWeight: 600,
                      fontSize: '0.6rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#5E5A54',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courseList.map((c: {
                id: string; slug: string; title: string; category: string;
                cefr_level: string | null; is_published: boolean;
                plans: { name: string }[]
              }) => (
                <tr key={c.id} className="course-row" style={{ borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
                  <td style={{ padding: '14px 20px', color: '#EAE4D2', fontWeight: 500 }}>{c.title}</td>
                  <td style={{ padding: '14px 20px', color: '#8A8278', textTransform: 'capitalize' }}>{c.category}</td>
                  <td style={{ padding: '14px 20px', color: '#8A8278' }}>{c.cefr_level ?? '—'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      display: 'inline-block',
                      fontFamily: sans,
                      fontWeight: 600,
                      fontSize: '0.6rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      padding: '3px 9px',
                      borderRadius: '4px',
                      backgroundColor: c.is_published ? 'rgba(34,197,94,0.08)' : 'rgba(107,114,128,0.08)',
                      border: c.is_published ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(107,114,128,0.25)',
                      color: c.is_published ? '#22c55e' : '#6b7280',
                    }}>
                      {c.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8A8278' }}>
                    {(c.plans ?? []).map((p) => p.name).join(', ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
