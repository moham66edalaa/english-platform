import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Groups — Owner Panel | Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function OwnerGroupsPage() {
  const supabase = await createClient()

  const { data: groups } = await supabase
    .from('groups')
    .select('*, courses(title), users(full_name), group_members(count)')
    .order('created_at', { ascending: false })

  const totalGroups  = groups?.length ?? 0
  const activeGroups = groups?.filter((g: any) => g.is_active !== false).length ?? 0

  const stats = [
    { label: 'Total Groups',  value: totalGroups,  icon: '▣' },
    { label: 'Active Groups', value: activeGroups, icon: '◈' },
  ]

  return (
    <>
      <style>{`
        .stat-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; padding:28px 28px 24px; text-decoration:none; display:block; transition:border-color 0.2s, background 0.2s; }
        .stat-card:hover { background-color:#161613; border-color:rgba(201,168,76,0.3); }
        .add-btn { display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(201,168,76,0.25); border-radius:8px; padding:10px 18px; font-size:0.76rem; letter-spacing:0.06em; color:#C9A84C; text-decoration:none; transition:background 0.15s, border-color 0.15s; cursor:pointer; background:transparent; }
        .add-btn:hover { background-color:rgba(201,168,76,0.07); border-color:rgba(201,168,76,0.5); }
        .group-row { display:grid; grid-template-columns:2fr 2fr 2fr 1fr 1fr; padding:14px 24px; transition:background 0.15s; }
        .group-row:hover { background-color:rgba(245,240,232,0.02); }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6F35', marginBottom: '8px' }}>
            Owner Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2' }}>
            Groups
          </h1>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
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

        {/* New Group button */}
        <div style={{ marginBottom: '40px' }}>
          <button className="add-btn" style={{ fontFamily: sans, fontWeight: 500 }}>
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>+</span>
            New Group
          </button>
        </div>

        {/* Groups table */}
        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.4rem', color: '#EAE4D2', marginBottom: '16px' }}>
          All Groups
        </h2>

        <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            {['Name', 'Course', 'Teacher', 'Students', 'Status'].map(h => (
              <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                {h}
              </span>
            ))}
          </div>

          {(groups ?? []).length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
              No groups found.
            </div>
          ) : (
            (groups ?? []).map((g: any, i: number) => {
              const isActive      = g.is_active !== false
              const studentCount  = g.group_members?.[0]?.count ?? 0

              return (
                <div
                  key={g.id}
                  className="group-row"
                  style={{ borderBottom: i < (groups?.length ?? 0) - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
                >
                  {/* Name */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                    {g.name ?? '—'}
                  </span>

                  {/* Course */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                    {g.courses?.title ?? '—'}
                  </span>

                  {/* Teacher */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                    {g.users?.full_name ?? '—'}
                  </span>

                  {/* Students count */}
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                    {studentCount}
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
                </div>
              )
            })
          )}
        </div>

      </div>
    </>
  )
}
