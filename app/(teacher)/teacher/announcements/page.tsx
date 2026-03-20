// app/(teacher)/teacher/announcements/page.tsx

import { createClient }  from '@/lib/supabase/server'
import { requireUser }   from '@/lib/auth/helpers'

export const metadata = { title: 'Announcements — Eloquence Teacher Panel' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

function truncate(text: string | null, max = 100): string {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default async function TeacherAnnouncementsPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*, groups(name)')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  const list = announcements ?? []

  return (
    <>
      <style>{`
        .ann-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; padding:24px; transition:border-color 0.2s, background 0.2s; }
        .ann-card:hover { border-color:rgba(76,168,201,0.25); background-color:#131211; }
        .pinned-badge { display:inline-block; font-family:${sans}; font-weight:600; font-size:0.58rem; letter-spacing:0.14em; text-transform:uppercase; padding:2px 8px; border-radius:4px; background-color:rgba(76,168,201,0.1); border:1px solid rgba(76,168,201,0.3); color:${blue}; }
        .target-badge { display:inline-block; font-family:${sans}; font-weight:600; font-size:0.58rem; letter-spacing:0.12em; text-transform:uppercase; padding:2px 8px; border-radius:4px; background-color:rgba(245,240,232,0.05); border:1px solid rgba(245,240,232,0.1); color:#8A8278; }
        .empty-state { padding:56px 24px; text-align:center; background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; }
      `}</style>

      <div style={{ maxWidth: '900px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: blue, marginBottom: '8px' }}>
            Teacher Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
            Announcements
          </h1>
          <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
            {list.length} announcement{list.length !== 1 ? 's' : ''} authored by you
          </p>
        </div>

        {list.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontFamily: serif, fontSize: '2rem', color: '#3A3830', marginBottom: '12px' }}>◌</div>
            <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#5E5A54' }}>
              No announcements yet.
            </p>
            <p style={{ fontFamily: sans, fontSize: '0.78rem', color: '#3A3830', marginTop: '6px' }}>
              Announcements you create will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {list.map((ann: any) => {
              const groupName   = ann.groups?.name ?? null
              const targetLabel = groupName
                ? groupName
                : ann.target_role
                  ? ann.target_role.charAt(0).toUpperCase() + ann.target_role.slice(1) + 's'
                  : 'All'
              const preview = truncate(ann.body, 100)

              return (
                <div key={ann.id} className="ann-card">
                  {/* Top row: badges + date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    {ann.is_pinned && (
                      <span className="pinned-badge">Pinned</span>
                    )}
                    <span className="target-badge">→ {targetLabel}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: sans, fontSize: '0.72rem', color: '#5E5A54' }}>
                      {formatDate(ann.created_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.2rem', color: '#EAE4D2', marginBottom: preview ? '10px' : 0, lineHeight: 1.35 }}>
                    {ann.title ?? 'Untitled'}
                  </h3>

                  {/* Body preview */}
                  {preview && (
                    <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278', lineHeight: 1.6, margin: 0 }}>
                      {preview}
                    </p>
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
