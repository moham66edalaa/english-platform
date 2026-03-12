// app/(owner)/owner/analytics/page.tsx

import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Analytics — Owner' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [
    { count: studentCount },
    { count: teacherCount },
    { count: courseCount },
    { count: enrollmentCount },
    { data: cefrData },
    { data: payments },
    { data: recentEnrollments },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('cefr_level').eq('role', 'student').not('cefr_level', 'is', null),
    supabase.from('payments').select('amount_usd, status'),
    supabase.from('enrollments')
      .select('*, users(full_name), courses(title)')
      .order('enrolled_at', { ascending: false })
      .limit(5),
  ])

  // CEFR distribution
  const cefrCounts: Record<string, number> = {}
  ;(cefrData ?? []).forEach((u: any) => {
    cefrCounts[u.cefr_level] = (cefrCounts[u.cefr_level] || 0) + 1
  })
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
  const maxCefr = Math.max(...levels.map(l => cefrCounts[l] || 0), 1)

  // Revenue
  const completedPayments = (payments ?? []).filter((p: any) => p.status === 'completed')
  const totalRevenue = completedPayments.reduce(
    (sum: number, p: any) => sum + (p.amount_usd ?? 0), 0
  )
  const pendingPayments = (payments ?? []).filter((p: any) => p.status === 'pending')

  const stats = [
    { label: 'Total Students',    value: (studentCount ?? 0).toLocaleString(),    icon: '◉', sub: 'Registered learners' },
    { label: 'Total Teachers',    value: (teacherCount ?? 0).toLocaleString(),    icon: '◎', sub: 'Active instructors' },
    { label: 'Total Courses',     value: (courseCount ?? 0).toLocaleString(),     icon: '▣', sub: 'Published courses' },
    { label: 'Total Enrolments',  value: (enrollmentCount ?? 0).toLocaleString(), icon: '◈', sub: 'Course enrolments' },
  ]

  return (
    <>
      <style>{`
        .analytics-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; }
        .enrol-row { display:grid; grid-template-columns:2fr 2fr 1fr; padding:14px 24px; transition:background 0.15s; }
        .enrol-row:hover { background-color:rgba(245,240,232,0.02); }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6F35', marginBottom: '8px' }}>
            Owner Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2' }}>
            Analytics
          </h1>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px', marginBottom: '32px' }}>
          {stats.map(({ label, value, icon, sub }) => (
            <div key={label} className="analytics-card" style={{ padding: '24px 22px' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '8px',
                backgroundColor: 'rgba(201,168,76,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: gold, fontSize: '0.85rem', marginBottom: '16px',
              }}>
                {icon}
              </div>
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', lineHeight: 1, color: gold, marginBottom: '6px' }}>
                {value}
              </div>
              <div style={{ fontFamily: sans, fontWeight: 500, fontSize: '0.78rem', color: '#D8D2C0', marginBottom: '3px' }}>
                {label}
              </div>
              <div style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.7rem', color: '#5E5A54' }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Two-column: CEFR + Revenue */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

          {/* CEFR Distribution */}
          <div className="analytics-card" style={{ padding: '28px' }}>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '4px' }}>
              CEFR Distribution
            </h2>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.78rem', color: '#5E5A54', marginBottom: '24px' }}>
              Student levels from placement tests
            </p>

            {levels.every(l => !cefrCounts[l]) ? (
              <p style={{ fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54', textAlign: 'center', padding: '20px 0' }}>
                No placement test results yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {levels.map(lvl => {
                  const count = cefrCounts[lvl] ?? 0
                  const widthPct = Math.round((count / maxCefr) * 100)
                  return (
                    <div key={lvl}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.1em', color: '#D8D2C0' }}>
                          {lvl}
                        </span>
                        <span style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.72rem', color: '#8A8278' }}>
                          {count} {count === 1 ? 'student' : 'students'}
                        </span>
                      </div>
                      <div style={{ height: '7px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          borderRadius: '100px',
                          width: `${widthPct}%`,
                          background: 'linear-gradient(90deg, #C9A84C, #E8CC80)',
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Revenue */}
          <div className="analytics-card" style={{ padding: '28px' }}>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '4px' }}>
              Revenue
            </h2>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.78rem', color: '#5E5A54', marginBottom: '24px' }}>
              Payment activity overview
            </p>

            <div style={{ fontFamily: serif, fontWeight: 300, fontSize: '3rem', lineHeight: 1, color: gold, marginBottom: '6px' }}>
              ${totalRevenue.toFixed(2)}
            </div>
            <div style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.75rem', color: '#6A6560', marginBottom: '28px' }}>
              Total completed revenue
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#6DC87A' }} />
                  <span style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.78rem', color: '#D8D2C0' }}>Completed</span>
                </div>
                <span style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.78rem', color: '#EAE4D2' }}>
                  {completedPayments.length} {completedPayments.length === 1 ? 'payment' : 'payments'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#B8A060' }} />
                  <span style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.78rem', color: '#D8D2C0' }}>Pending</span>
                </div>
                <span style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.78rem', color: '#EAE4D2' }}>
                  {pendingPayments.length} {pendingPayments.length === 1 ? 'payment' : 'payments'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#5E5A54' }} />
                  <span style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.78rem', color: '#D8D2C0' }}>Total recorded</span>
                </div>
                <span style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.78rem', color: '#EAE4D2' }}>
                  {(payments ?? []).length} {(payments ?? []).length === 1 ? 'payment' : 'payments'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="analytics-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '2px' }}>
              Recent Activity
            </h2>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.78rem', color: '#5E5A54' }}>
              Last 5 enrolments
            </p>
          </div>

          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', padding: '12px 28px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            {['Student', 'Course', 'Date'].map(h => (
              <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                {h}
              </span>
            ))}
          </div>

          {(recentEnrollments ?? []).length === 0 ? (
            <div style={{ padding: '40px 28px', textAlign: 'center', fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
              No enrolments yet.
            </div>
          ) : (
            (recentEnrollments ?? []).map((e: any, i: number) => (
              <div
                key={e.id}
                className="enrol-row"
                style={{ borderBottom: i < (recentEnrollments?.length ?? 0) - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
              >
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                  {e.users?.full_name ?? '—'}
                </span>
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                  {e.courses?.title ?? '—'}
                </span>
                <span style={{ fontFamily: sans, fontSize: '0.75rem', color: '#5E5A54' }}>
                  {e.enrolled_at
                    ? new Date(e.enrolled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                    : '—'}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  )
}
