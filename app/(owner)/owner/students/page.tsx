// app/(owner)/owner/students/page.tsx

import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Students — Owner Panel | Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function OwnerStudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from('users')
    .select('*, enrollments(count), group_members(count)')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  const total        = students?.length ?? 0
  const withLevel    = students?.filter((s: any) => s.cefr_level).length ?? 0
  const withoutLevel = total - withLevel

  const stats = [
    { label: 'Total Students',       value: total,        icon: '◉' },
    { label: 'Students with Level',  value: withLevel,    icon: '◎' },
    { label: 'Without Level',        value: withoutLevel, icon: '○' },
  ]

  return (
    <>
      <style>{`
        .stat-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; padding:28px 28px 24px; display:block; }
        .student-row { display:grid; grid-template-columns:2fr 2fr 1fr 1fr 1fr 1fr 1fr; padding:14px 24px; transition:background 0.15s; align-items:center; }
        .student-row:hover { background-color:rgba(245,240,232,0.02); }
      `}</style>

      <div style={{ maxWidth: '1200px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6F35', marginBottom: '8px' }}>
            Owner Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2' }}>
            Students
          </h1>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="stat-card">
              <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '0.9rem', marginBottom: '16px' }}>
                {icon}
              </div>
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: '3rem', lineHeight: 1, color: gold, marginBottom: '8px' }}>
                {value.toLocaleString()}
              </div>
              <div style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.78rem', color: '#6A6560', letterSpacing: '0.04em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Students table */}
        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.4rem', color: '#EAE4D2', marginBottom: '16px' }}>
          All Students
        </h2>

        <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            {['Name', 'Email', 'Level', 'Groups', 'Courses', 'Status', 'Joined'].map(h => (
              <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                {h}
              </span>
            ))}
          </div>

          {(students ?? []).length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: serif, fontSize: '2rem', color: 'rgba(201,168,76,0.15)', marginBottom: '12px' }}>◉</div>
              <p style={{ fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
                No students registered yet.
              </p>
            </div>
          ) : (
            (students ?? []).map((s: any, i: number) => {
              const isActive      = s.is_active !== false
              const enrollCount   = s.enrollments?.[0]?.count ?? 0
              const groupCount    = s.group_members?.[0]?.count ?? 0
              const joinedDate    = s.created_at
                ? new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—'

              return (
                <div
                  key={s.id}
                  className="student-row"
                  style={{ borderBottom: i < (students?.length ?? 0) - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
                >
                  {/* Name */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                    {s.full_name ?? '—'}
                  </span>

                  {/* Email */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.email ?? '—'}
                  </span>

                  {/* CEFR Level badge */}
                  <span>
                    {s.cefr_level ? (
                      <span style={{
                        fontFamily: sans, fontWeight: 600,
                        fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                        padding: '3px 9px', borderRadius: '4px',
                        backgroundColor: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: gold,
                      }}>
                        {s.cefr_level}
                      </span>
                    ) : (
                      <span style={{ fontFamily: sans, fontSize: '0.76rem', color: '#3E3A36' }}>—</span>
                    )}
                  </span>

                  {/* Groups count */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                    {groupCount}
                  </span>

                  {/* Enrolled courses count */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                    {enrollCount}
                  </span>

                  {/* Status badge */}
                  <span>
                    <span style={{
                      fontFamily: sans, fontWeight: 600,
                      fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                      padding: '3px 9px', borderRadius: '4px',
                      backgroundColor: isActive ? 'rgba(201,168,76,0.1)' : 'rgba(245,240,232,0.05)',
                      border: `1px solid ${isActive ? 'rgba(201,168,76,0.3)' : 'rgba(245,240,232,0.1)'}`,
                      color: isActive ? gold : '#6A6560',
                    }}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </span>

                  {/* Joined date */}
                  <span style={{ fontFamily: sans, fontSize: '0.76rem', color: '#5E5A54' }}>
                    {joinedDate}
                  </span>
                </div>
              )
            })
          )}
        </div>

      </div>
    </>
  )
}
