// app/(admin)/admin/analytics/page.tsx

import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Analytics — Admin' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [
    { count: totalStudents },
    { count: totalEnrollments },
    { count: completedLessons },
    { data: revenueData },
    { data: levelDist },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('completed', true),
    supabase.from('payments').select('amount_usd').eq('status', 'completed'),
    supabase.from('users').select('cefr_level').eq('role', 'student').not('cefr_level', 'is', null),
  ])

  const totalRevenue = (revenueData ?? []).reduce(
    (sum: number, p: { amount_usd: number }) => sum + p.amount_usd, 0
  )

  // Count per CEFR level
  const levelCounts: Record<string, number> = {}
  ;(levelDist ?? []).forEach((u: { cefr_level: string | null }) => {
    if (u.cefr_level) levelCounts[u.cefr_level] = (levelCounts[u.cefr_level] ?? 0) + 1
  })
  const totalWithLevel = Object.values(levelCounts).reduce((a, b) => a + b, 0)
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']

  const stats = [
    { label: 'Total Students',    value: (totalStudents ?? 0).toLocaleString(),        icon: '◉', sub: 'Registered learners' },
    { label: 'Total Enrolments',  value: (totalEnrollments ?? 0).toLocaleString(),     icon: '◈', sub: 'Active course enrolments' },
    { label: 'Lessons Completed', value: (completedLessons ?? 0).toLocaleString(),     icon: '▶', sub: 'Across all students' },
    { label: 'Total Revenue',     value: `$${totalRevenue.toFixed(2)}`,                icon: '◆', sub: 'Completed payments' },
  ]

  return (
    <div style={{ maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6F35', marginBottom: '8px' }}>
          Admin Panel
        </p>
        <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2' }}>
          Analytics
        </h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px', marginBottom: '32px' }}>
        {stats.map(({ label, value, icon, sub }) => (
          <div key={label} style={{
            backgroundColor: '#111110',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: '16px',
            padding: '24px 22px',
          }}>
            <div style={{ width: 34, height: 34, borderRadius: '8px', backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '0.85rem', marginBottom: '16px' }}>
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

      {/* CEFR Distribution */}
      <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', padding: '28px 28px', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '6px' }}>
          Student Level Distribution
        </h2>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.78rem', color: '#5E5A54', marginBottom: '24px' }}>
          Based on placement test results
        </p>

        {totalWithLevel === 0 ? (
          <p style={{ fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54', textAlign: 'center', padding: '20px 0' }}>
            No placement test results yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {LEVELS.map(lvl => {
              const count = levelCounts[lvl] ?? 0
              const pct   = totalWithLevel > 0 ? Math.round((count / totalWithLevel) * 100) : 0
              return (
                <div key={lvl}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                    <span style={{ fontFamily: sans, fontWeight: 500, fontSize: '0.82rem', color: '#D8D2C0' }}>
                      {lvl}
                    </span>
                    <span style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.78rem', color: '#8A8278' }}>
                      {count} students · {pct}%
                    </span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '100px',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #C9A84C, #E8CC80)',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Charts placeholder */}
      <div style={{
        backgroundColor: '#111110',
        border: '1px dashed rgba(201,168,76,0.15)',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: serif, fontSize: '1.6rem', color: 'rgba(201,168,76,0.2)', marginBottom: '12px' }}>
          ◈
        </div>
        <p style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.85rem', color: '#5E5A54' }}>
          Detailed charts coming soon
        </p>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.75rem', color: '#3E3A36', marginTop: '4px' }}>
          Integrate with Recharts or Chart.js
        </p>
      </div>

    </div>
  )
}