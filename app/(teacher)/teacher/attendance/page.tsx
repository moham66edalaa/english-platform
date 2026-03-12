// app/(teacher)/teacher/attendance/page.tsx

import { createClient }  from '@/lib/supabase/server'
import { requireUser }   from '@/lib/auth/helpers'

export const metadata = { title: 'Attendance — Eloquence Teacher Panel' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

function statusStyle(status: AttendanceStatus | null) {
  const map: Record<AttendanceStatus, { label: string; bg: string; border: string; color: string }> = {
    present: { label: 'Present', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)',   color: '#22c55e' },
    absent:  { label: 'Absent',  bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   color: '#ef4444' },
    late:    { label: 'Late',    bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.25)',   color: '#eab308' },
    excused: { label: 'Excused', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.25)', color: '#9ca3af' },
  }
  return status && map[status] ? map[status] : null
}

export default async function TeacherAttendancePage() {
  const user     = await requireUser()
  const supabase = await createClient()

  const { data: myGroups } = await supabase
    .from('groups')
    .select('id, name, group_members(user_id, users(full_name))')
    .eq('teacher_id', user.id)
    .eq('is_active', true)

  const today    = new Date().toISOString().split('T')[0]
  const groupIds = (myGroups ?? []).map((g: any) => g.id)

  const { data: todayAttendance } = groupIds.length > 0
    ? await supabase
        .from('attendance')
        .select('*')
        .in('group_id', groupIds)
        .eq('session_date', today)
    : { data: [] }

  // Build lookup: groupId+userId -> status
  const attendanceMap = new Map<string, AttendanceStatus>()
  for (const record of todayAttendance ?? []) {
    attendanceMap.set(`${record.group_id}:${record.user_id}`, record.status)
  }

  const groups      = myGroups ?? []
  const dateDisplay = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <>
      <style>{`
        .att-row { display:grid; grid-template-columns:1fr 1fr; padding:14px 24px; transition:background 0.15s; }
        .att-row:hover { background-color:rgba(76,168,201,0.03); }
        .att-badge { display:inline-block; font-family:${sans}; font-weight:600; font-size:0.6rem; letter-spacing:0.14em; text-transform:uppercase; padding:3px 9px; border-radius:4px; }
        .group-block { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; overflow:hidden; margin-bottom:28px; }
        .empty-state { padding:56px 24px; text-align:center; background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: blue, marginBottom: '8px' }}>
            Teacher Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
            Attendance
          </h1>
          <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
            {dateDisplay}
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontFamily: serif, fontSize: '2rem', color: '#3A3830', marginBottom: '12px' }}>◉</div>
            <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#5E5A54' }}>
              You have no active groups assigned.
            </p>
          </div>
        ) : (
          groups.map((group: any) => {
            const members: any[] = group.group_members ?? []
            const recordedCount  = members.filter(
              (m: any) => attendanceMap.has(`${group.id}:${m.user_id}`)
            ).length
            const hasRecords = recordedCount > 0

            return (
              <div key={group.id} className="group-block">
                {/* Group header */}
                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.35rem', color: '#EAE4D2', margin: 0 }}>
                    {group.name}
                  </h2>
                  {hasRecords ? (
                    <span style={{ fontFamily: sans, fontSize: '0.72rem', color: '#5E5A54' }}>
                      {recordedCount}/{members.length} recorded
                    </span>
                  ) : (
                    <span style={{
                      fontFamily: sans, fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.14em',
                      textTransform: 'uppercase', padding: '3px 9px', borderRadius: '4px',
                      backgroundColor: 'rgba(107,114,128,0.08)', border: '1px solid rgba(107,114,128,0.25)',
                      color: '#6b7280',
                    }}>
                      Not recorded
                    </span>
                  )}
                </div>

                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '12px 24px', borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
                  {['Student', 'Status'].map(h => (
                    <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                      {h}
                    </span>
                  ))}
                </div>

                {members.length === 0 ? (
                  <div style={{ padding: '32px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
                    No students in this group.
                  </div>
                ) : (
                  members.map((m: any, i: number) => {
                    const fullName = m.users?.full_name ?? '—'
                    const status   = attendanceMap.get(`${group.id}:${m.user_id}`) ?? null
                    const badge    = statusStyle(status)

                    return (
                      <div
                        key={m.user_id ?? i}
                        className="att-row"
                        style={{ borderBottom: i < members.length - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
                      >
                        <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                          {fullName}
                        </span>
                        <span>
                          {badge ? (
                            <span
                              className="att-badge"
                              style={{ backgroundColor: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}
                            >
                              {badge.label}
                            </span>
                          ) : (
                            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#3A3830' }}>—</span>
                          )}
                        </span>
                      </div>
                    )
                  })
                )}

                {!hasRecords && members.length > 0 && (
                  <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(245,240,232,0.04)', fontFamily: sans, fontSize: '0.78rem', color: '#5E5A54', fontStyle: 'italic' }}>
                    No attendance recorded today for this group.
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
