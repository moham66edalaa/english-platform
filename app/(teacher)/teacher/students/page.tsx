// app/(teacher)/teacher/students/page.tsx

import { createClient }  from '@/lib/supabase/server'
import { requireUser }   from '@/lib/auth/helpers'

export const metadata = { title: 'My Students — Eloquence Teacher Panel' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

export default async function TeacherStudentsPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  const { data: myGroups } = await supabase
    .from('groups')
    .select('id, name, group_members(*, users(full_name, email, cefr_level))')
    .eq('teacher_id', user.id)

  const groups = myGroups ?? []
  const totalStudents = groups.reduce(
    (sum: number, g: any) => sum + (g.group_members?.length ?? 0),
    0
  )

  function levelColor(level: string | null) {
    if (!level) return '#5E5A54'
    const map: Record<string, string> = {
      A1: '#6b7280', A2: '#6b7280',
      B1: '#4CA8C9', B2: '#4CA8C9',
      C1: '#a78bfa', C2: '#a78bfa',
    }
    return map[level] ?? '#5E5A54'
  }

  return (
    <>
      <style>{`
        .student-row { display:grid; grid-template-columns:2fr 2fr 1fr; padding:14px 24px; transition:background 0.15s; }
        .student-row:hover { background-color:rgba(76,168,201,0.04); }
        .level-badge { display:inline-block; font-family:${sans}; font-weight:600; font-size:0.6rem; letter-spacing:0.14em; text-transform:uppercase; padding:3px 9px; border-radius:4px; }
        .group-section { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; overflow:hidden; margin-bottom:28px; }
        .empty-state { padding:56px 24px; text-align:center; }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: blue, marginBottom: '8px' }}>
            Teacher Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
            My Students
          </h1>
          <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
            {totalStudents} student{totalStudents !== 1 ? 's' : ''} across {groups.length} group{groups.length !== 1 ? 's' : ''}
          </p>
        </div>

        {groups.length === 0 ? (
          <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px' }}>
            <div className="empty-state">
              <div style={{ fontFamily: serif, fontSize: '2rem', color: '#3A3830', marginBottom: '12px' }}>◈</div>
              <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#5E5A54' }}>
                You have no groups assigned yet.
              </p>
            </div>
          </div>
        ) : (
          groups.map((group: any) => {
            const members: any[] = group.group_members ?? []
            return (
              <div key={group.id} className="group-section">
                {/* Group header */}
                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.35rem', color: '#EAE4D2', margin: 0 }}>
                    {group.name}
                  </h2>
                  <span style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54' }}>
                    {members.length} student{members.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', padding: '12px 24px', borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
                  {['Name', 'Email', 'Level'].map(h => (
                    <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                      {h}
                    </span>
                  ))}
                </div>

                {members.length === 0 ? (
                  <div style={{ padding: '32px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
                    No students in this group yet.
                  </div>
                ) : (
                  members.map((m: any, i: number) => {
                    const u = m.users ?? {}
                    const level = u.cefr_level ?? null
                    return (
                      <div
                        key={m.user_id ?? i}
                        className="student-row"
                        style={{ borderBottom: i < members.length - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
                      >
                        <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                          {u.full_name ?? '—'}
                        </span>
                        <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                          {u.email ?? '—'}
                        </span>
                        <span>
                          {level ? (
                            <span
                              className="level-badge"
                              style={{
                                backgroundColor: `${levelColor(level)}18`,
                                border: `1px solid ${levelColor(level)}44`,
                                color: levelColor(level),
                              }}
                            >
                              {level}
                            </span>
                          ) : (
                            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>—</span>
                          )}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
