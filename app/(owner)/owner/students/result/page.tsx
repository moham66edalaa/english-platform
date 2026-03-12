// app/(owner)/owner/students/result/page.tsx

import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Student Results — Owner Panel | Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function OwnerStudentResultsPage() {
  const supabase = await createClient()

  const { data: results } = await supabase
    .from('placement_test_results')
    .select('*, users(full_name, email)')
    .order('taken_at', { ascending: false })

  const total        = results?.length ?? 0
  const avgScore     = total > 0
    ? Math.round((results ?? []).reduce((sum: number, r: any) => {
        const pct = r.total_questions > 0 ? (r.correct_answers / r.total_questions) * 100 : 0
        return sum + pct
      }, 0) / total)
    : 0

  const levelCounts: Record<string, number> = {}
  ;(results ?? []).forEach((r: any) => {
    if (r.assigned_level) {
      levelCounts[r.assigned_level] = (levelCounts[r.assigned_level] ?? 0) + 1
    }
  })
  const distinctLevels = Object.keys(levelCounts).length

  const stats = [
    { label: 'Total Results',    value: total,          icon: '◈', suffix: '' },
    { label: 'Average Score',    value: avgScore,       icon: '◆', suffix: '%' },
    { label: 'Distinct Levels',  value: distinctLevels, icon: '◎', suffix: '' },
  ]

  return (
    <>
      <style>{`
        .stat-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; padding:28px 28px 24px; display:block; }
        .result-row { display:grid; grid-template-columns:2fr 2fr 1fr 1fr 1fr; padding:14px 24px; transition:background 0.15s; align-items:center; }
        .result-row:hover { background-color:rgba(245,240,232,0.02); }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6F35', marginBottom: '8px' }}>
            Owner Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2' }}>
            Student Results
          </h1>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {stats.map(({ label, value, icon, suffix }) => (
            <div key={label} className="stat-card">
              <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '0.9rem', marginBottom: '16px' }}>
                {icon}
              </div>
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: '3rem', lineHeight: 1, color: gold, marginBottom: '8px' }}>
                {value.toLocaleString()}{suffix}
              </div>
              <div style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.78rem', color: '#6A6560', letterSpacing: '0.04em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Results table */}
        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.4rem', color: '#EAE4D2', marginBottom: '16px' }}>
          Placement Test Results
        </h2>

        <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            {['Student', 'Email', 'Score', 'Level', 'Date Taken'].map(h => (
              <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                {h}
              </span>
            ))}
          </div>

          {(results ?? []).length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: serif, fontSize: '2rem', color: 'rgba(201,168,76,0.15)', marginBottom: '12px' }}>◈</div>
              <p style={{ fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
                No placement test results yet.
              </p>
            </div>
          ) : (
            (results ?? []).map((r: any, i: number) => {
              const score    = r.total_questions > 0
                ? Math.round((r.correct_answers / r.total_questions) * 100)
                : 0
              const takenDate = r.taken_at
                ? new Date(r.taken_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—'

              return (
                <div
                  key={r.id}
                  className="result-row"
                  style={{ borderBottom: i < (results?.length ?? 0) - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
                >
                  {/* Student name */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                    {r.users?.full_name ?? '—'}
                  </span>

                  {/* Email */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.users?.email ?? '—'}
                  </span>

                  {/* Score */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                    <span style={{ color: score >= 70 ? gold : '#8A8278' }}>
                      {r.correct_answers ?? 0}
                    </span>
                    <span style={{ color: '#3E3A36' }}>/{r.total_questions ?? 0}</span>
                    <span style={{ fontFamily: sans, fontSize: '0.7rem', color: '#5E5A54', marginLeft: '6px' }}>
                      ({score}%)
                    </span>
                  </span>

                  {/* Assigned Level badge */}
                  <span>
                    {r.assigned_level ? (
                      <span style={{
                        fontFamily: sans, fontWeight: 600,
                        fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                        padding: '3px 9px', borderRadius: '4px',
                        backgroundColor: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: gold,
                      }}>
                        {r.assigned_level}
                      </span>
                    ) : (
                      <span style={{ fontFamily: sans, fontSize: '0.76rem', color: '#3E3A36' }}>—</span>
                    )}
                  </span>

                  {/* Date taken */}
                  <span style={{ fontFamily: sans, fontSize: '0.76rem', color: '#5E5A54' }}>
                    {takenDate}
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
