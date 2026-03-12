// app/(teacher)/teacher/groups/page.tsx

import { createClient }  from '@/lib/supabase/server'
import { requireUser }   from '@/lib/auth/helpers'

export const metadata = { title: 'My Groups — Eloquence Teacher Panel' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

export default async function TeacherGroupsPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  const { data: groups } = await supabase
    .from('groups')
    .select('*, courses(title), group_members(count)')
    .eq('teacher_id', user.id)

  const groupList = groups ?? []

  function statusBadge(isActive: boolean | null) {
    return isActive
      ? { label: 'Active',   bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  color: '#22c55e' }
      : { label: 'Inactive', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.25)', color: '#6b7280' }
  }

  return (
    <>
      <style>{`
        .group-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; padding:24px; text-decoration:none; display:block; transition:border-color 0.2s, background 0.2s; }
        .group-card:hover { border-color:rgba(76,168,201,0.3); background-color:#131211; }
        .meta-label { font-family:${sans}; font-weight:600; font-size:0.6rem; letter-spacing:0.16em; text-transform:uppercase; color:#5E5A54; margin-bottom:4px; }
        .meta-value { font-family:${sans}; font-size:0.82rem; color:#8A8278; }
        .status-badge { display:inline-block; font-family:${sans}; font-weight:600; font-size:0.6rem; letter-spacing:0.14em; text-transform:uppercase; padding:3px 9px; border-radius:4px; }
        .empty-state { padding:56px 24px; text-align:center; background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: blue, marginBottom: '8px' }}>
            Teacher Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
            My Groups
          </h1>
          <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
            {groupList.length} group{groupList.length !== 1 ? 's' : ''} assigned to you
          </p>
        </div>

        {groupList.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontFamily: serif, fontSize: '2rem', color: '#3A3830', marginBottom: '12px' }}>◎</div>
            <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#5E5A54' }}>
              No groups have been assigned to you yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {groupList.map((group: any) => {
              const studentCount = group.group_members?.[0]?.count ?? 0
              const courseTitle  = group.courses?.title ?? null
              const badge        = statusBadge(group.is_active)

              return (
                <div key={group.id} className="group-card">
                  {/* Card top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(76,168,201,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: blue, fontSize: '1rem' }}>
                      ◎
                    </div>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Group name */}
                  <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.35rem', color: '#EAE4D2', marginBottom: '18px', lineHeight: 1.3 }}>
                    {group.name}
                  </h2>

                  {/* Meta grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: courseTitle || group.schedule_note ? '18px' : 0 }}>
                    <div>
                      <div className="meta-label">Students</div>
                      <div style={{ fontFamily: sans, fontSize: '1.4rem', fontWeight: 300, color: blue, lineHeight: 1 }}>
                        {studentCount}
                      </div>
                    </div>
                    {courseTitle && (
                      <div>
                        <div className="meta-label">Course</div>
                        <div className="meta-value">{courseTitle}</div>
                      </div>
                    )}
                  </div>

                  {/* Schedule note */}
                  {group.schedule_note && (
                    <div style={{ borderTop: '1px solid rgba(245,240,232,0.06)', paddingTop: '14px' }}>
                      <div className="meta-label">Schedule</div>
                      <div className="meta-value">{group.schedule_note}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
