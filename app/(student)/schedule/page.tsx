// app/(student)/schedule/page.tsx
import { requireUser } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Schedule — Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'DM Sans', sans-serif"
const teal  = '#4CC9A8'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t: string | null | undefined): string {
  if (!t) return '—'
  // Handle HH:MM or HH:MM:SS
  const [hStr, mStr] = t.split(':')
  const h = parseInt(hStr, 10)
  const m = mStr ?? '00'
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m} ${ampm}`
}

export default async function SchedulePage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: myMemberships } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', user.id)

  const groupIds = (myMemberships ?? []).map((m: any) => m.group_id)

  const { data: sessions } = groupIds.length > 0
    ? await supabase
        .from('scheduled_sessions')
        .select('*, groups(name), users(full_name)')
        .in('group_id', groupIds)
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
    : { data: [] as any[] }

  // Group sessions by day_of_week (0 = Sunday … 6 = Saturday)
  const byDay: Record<number, any[]> = {}
  for (let i = 0; i < 7; i++) byDay[i] = []
  for (const s of (sessions ?? []) as any[]) {
    const day = typeof s.day_of_week === 'number' ? s.day_of_week : parseInt(s.day_of_week, 10)
    if (day >= 0 && day <= 6) byDay[day].push(s)
  }

  const hasSessions = (sessions ?? []).length > 0

  return (
    <div style={{ maxWidth: 1000 }}>
      <style>{`
        .session-card:hover {
          border-color: rgba(76,201,168,0.35) !important;
          transform: translateY(-1px);
        }
        .meeting-link:hover { opacity: 0.8; }
        .day-block { margin-bottom: 32px; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: 44 }}>
        <p style={{
          fontFamily: sans,
          fontSize: '0.62rem',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: teal,
          marginBottom: 10,
        }}>
          Student
        </p>
        <h1 style={{
          fontFamily: serif,
          fontWeight: 300,
          fontSize: '2.6rem',
          color: '#EAE4D2',
          lineHeight: 1.15,
          marginBottom: 8,
        }}>
          My Schedule
        </h1>
        <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#6b7280' }}>
          Your weekly class sessions at a glance.
        </p>
      </div>

      {!hasSessions ? (
        /* Empty state */
        <div style={{
          background: 'linear-gradient(135deg, rgba(26,30,40,0.8), rgba(13,15,20,0.9))',
          border: '1px solid rgba(245,240,232,0.07)',
          borderRadius: 16,
          padding: '72px 40px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(76,201,168,0.08)',
            border: '1px solid rgba(76,201,168,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '1.6rem',
          }}>
            📅
          </div>
          <p style={{
            fontFamily: serif,
            fontSize: '1.3rem',
            color: '#EAE4D2',
            marginBottom: 8,
          }}>
            No scheduled sessions yet
          </p>
          <p style={{
            fontFamily: sans,
            fontSize: '0.85rem',
            color: '#6b7280',
            maxWidth: 380,
            margin: '0 auto',
          }}>
            Once you are added to a group your sessions will appear here.
          </p>
        </div>
      ) : (
        /* Weekly grid */
        <div>
          {DAY_NAMES.map((dayName, idx) => {
            const daySessions = byDay[idx]
            if (daySessions.length === 0) return null

            return (
              <div key={idx} className="day-block">
                {/* Day heading */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                }}>
                  <span style={{
                    fontFamily: sans,
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: teal,
                    background: 'rgba(76,201,168,0.08)',
                    border: '1px solid rgba(76,201,168,0.18)',
                    borderRadius: 6,
                    padding: '4px 12px',
                  }}>
                    {dayName}
                  </span>
                  <div style={{
                    flex: 1,
                    height: 1,
                    background: 'rgba(245,240,232,0.06)',
                  }} />
                </div>

                {/* Session cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 14,
                }}>
                  {daySessions.map((session: any) => (
                    <div
                      key={session.id}
                      className="session-card"
                      style={{
                        background: 'rgba(17,17,16,0.85)',
                        border: '1px solid rgba(245,240,232,0.07)',
                        borderRadius: 12,
                        padding: '20px 22px',
                        transition: 'border-color 0.2s, transform 0.2s',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Left teal accent line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 3,
                        bottom: 0,
                        background: 'linear-gradient(180deg, #4CC9A8, #80e8cc)',
                        borderRadius: '12px 0 0 12px',
                      }} />

                      <div style={{ paddingLeft: 12 }}>
                        {/* Session title */}
                        <p style={{
                          fontFamily: serif,
                          fontSize: '1.15rem',
                          fontWeight: 500,
                          color: '#EAE4D2',
                          marginBottom: 8,
                          lineHeight: 1.3,
                        }}>
                          {session.title ?? 'Class Session'}
                        </p>

                        {/* Time */}
                        <p style={{
                          fontFamily: sans,
                          fontSize: '0.82rem',
                          color: teal,
                          fontWeight: 600,
                          marginBottom: 6,
                        }}>
                          {formatTime(session.start_time)} – {formatTime(session.end_time)}
                        </p>

                        {/* Group name */}
                        {session.groups?.name && (
                          <p style={{
                            fontFamily: sans,
                            fontSize: '0.78rem',
                            color: '#9ca3af',
                            marginBottom: 4,
                          }}>
                            Group: {session.groups.name}
                          </p>
                        )}

                        {/* Teacher name */}
                        {session.users?.full_name && (
                          <p style={{
                            fontFamily: sans,
                            fontSize: '0.78rem',
                            color: '#9ca3af',
                            marginBottom: 4,
                          }}>
                            Teacher: {session.users.full_name}
                          </p>
                        )}

                        {/* Meeting URL */}
                        {session.meeting_url && (
                          <a
                            href={session.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="meeting-link"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              marginTop: 10,
                              fontFamily: sans,
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: teal,
                              border: '1px solid rgba(76,201,168,0.35)',
                              borderRadius: 6,
                              padding: '5px 12px',
                              textDecoration: 'none',
                              transition: 'opacity 0.2s',
                            }}
                          >
                            Join Meeting →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
