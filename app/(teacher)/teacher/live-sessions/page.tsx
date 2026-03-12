// app/(teacher)/teacher/live-sessions/page.tsx

import { createClient } from '@/lib/supabase/server'
import { formatDate }   from '@/lib/utils'

export const metadata = { title: 'Live Sessions — Eloquence Teacher Panel' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

export default async function TeacherLiveSessionsPage() {
  const supabase = await createClient()

  const { data: sessions } = await supabase
    .from('live_sessions')
    .select('*, courses(title)')
    .order('starts_at', { ascending: true })

  const sessionList = sessions ?? []

  return (
    <>
      <style>{`
        .session-card { transition: border-color 0.2s, background-color 0.2s; }
        .session-card:hover { border-color: rgba(76,168,201,0.3) !important; background-color: #131211; }
        .open-link { transition: background-color 0.2s; }
        .open-link:hover { background-color: rgba(76,168,201,0.08); }
        .empty-state { padding: 56px 24px; text-align: center; background-color: #111110; border: 1px solid rgba(245,240,232,0.07); border-radius: 16px; }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: blue, marginBottom: '8px' }}>
              Teacher Panel
            </p>
            <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
              Live Sessions
            </h1>
            <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
              {sessionList.length} session{sessionList.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>

          <button
            style={{
              fontFamily: sans,
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: blue,
              backgroundColor: 'transparent',
              border: '1px solid rgba(76,168,201,0.35)',
              borderRadius: '8px',
              padding: '10px 22px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            + Schedule Session
          </button>
        </div>

        {/* Content */}
        {sessionList.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontFamily: serif, fontSize: '2rem', color: '#3A3830', marginBottom: '12px' }}>◎</div>
            <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#5E5A54' }}>
              No sessions scheduled yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sessionList.map((s: {
              id: string; title: string; meeting_url: string;
              starts_at: string; duration_min: number;
              courses: { title: string } | null
            }) => (
              <div
                key={s.id}
                className="session-card"
                style={{
                  backgroundColor: '#111110',
                  border: '1px solid rgba(245,240,232,0.07)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                }}
              >
                <div>
                  <p style={{ fontFamily: sans, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: blue, marginBottom: '6px' }}>
                    {s.courses?.title ?? 'All students'}
                  </p>
                  <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '6px', lineHeight: 1.3 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontFamily: sans, fontSize: '0.8rem', color: '#5E5A54' }}>
                    {formatDate(s.starts_at)} · {s.duration_min} min
                  </p>
                </div>

                <a
                  href={s.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-link"
                  style={{
                    fontFamily: sans,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: blue,
                    border: '1px solid rgba(76,168,201,0.35)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Open Link →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
