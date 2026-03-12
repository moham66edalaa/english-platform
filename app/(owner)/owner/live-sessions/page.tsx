import { createClient } from '@/lib/supabase/server'
import { formatDate }   from '@/lib/utils'

export const metadata = { title: 'Live Sessions — Owner Panel | Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function OwnerLiveSessionsPage() {
  const supabase = await createClient()

  const { data: sessions } = await supabase
    .from('live_sessions')
    .select('*, courses(title)')
    .order('starts_at', { ascending: true })

  const count = sessions?.length ?? 0

  return (
    <>
      <style>{`
        .session-card { transition: border-color 0.2s, background 0.2s; }
        .session-card:hover { border-color: rgba(201,168,76,0.3) !important; background-color: #161613; }
        .schedule-btn { display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(201,168,76,0.25); border-radius:8px; padding:10px 18px; font-size:0.76rem; letter-spacing:0.06em; color:#C9A84C; text-decoration:none; transition:background 0.15s, border-color 0.15s; cursor:pointer; background:transparent; }
        .schedule-btn:hover { background-color:rgba(201,168,76,0.07); border-color:rgba(201,168,76,0.5); }
        .open-link { display:inline-flex; align-items:center; border:1px solid rgba(201,168,76,0.25); border-radius:8px; padding:8px 16px; font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; color:#C9A84C; text-decoration:none; transition:background 0.15s, border-color 0.15s; white-space:nowrap; }
        .open-link:hover { background-color:rgba(201,168,76,0.07); border-color:rgba(201,168,76,0.5); }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: gold, marginBottom: '8px' }}>
              Owner Panel
            </p>
            <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
              Live Sessions
            </h1>
            <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
              {count} session{count !== 1 ? 's' : ''} scheduled
            </p>
          </div>
          <button className="schedule-btn" style={{ fontFamily: sans, fontWeight: 500 }}>
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>+</span>
            Schedule Session
          </button>
        </div>

        {/* Session cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {count === 0 ? (
            <div style={{
              backgroundColor: '#111110',
              border: '1px solid rgba(245,240,232,0.07)',
              borderRadius: 16,
              padding: '60px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px', opacity: 0.3 }}>
                ◎
              </div>
              <p style={{ fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
                No sessions scheduled yet.
              </p>
            </div>
          ) : (
            (sessions ?? []).map((s: {
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
                  borderRadius: 16,
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                }}
              >
                <div>
                  <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, marginBottom: '6px' }}>
                    {s.courses?.title ?? 'All students'}
                  </p>
                  <h3 style={{ fontFamily: serif, fontWeight: 500, fontSize: '1.15rem', color: '#EAE4D2', marginBottom: '4px' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontFamily: sans, fontSize: '0.78rem', color: '#5E5A54' }}>
                    {formatDate(s.starts_at)} &middot; {s.duration_min} min
                  </p>
                </div>
                <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="open-link" style={{ fontFamily: sans, fontWeight: 500 }}>
                  Open Link &rarr;
                </a>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  )
}
