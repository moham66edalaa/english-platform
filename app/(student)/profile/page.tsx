// app/(student)/profile/page.tsx
import { requireUser } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Profile — Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'DM Sans', sans-serif"
const teal  = '#4CC9A8'

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

function ProfileRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 24,
      padding: '14px 0',
      borderBottom: '1px solid rgba(245,240,232,0.05)',
    }}>
      <span style={{
        fontFamily: sans,
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#6b7280',
        flexShrink: 0,
        minWidth: 140,
        paddingTop: 2,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: sans,
        fontSize: '0.92rem',
        color: value ? '#EAE4D2' : '#4b5563',
        textAlign: 'right',
        lineHeight: 1.5,
      }}>
        {value ?? '—'}
      </span>
    </div>
  )
}

export default async function ProfilePage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const p = profile ?? user
  const initials = getInitials(p.full_name)

  const roleLabelMap: Record<string, string> = {
    student: 'Student',
    teacher: 'Teacher',
    owner:   'Owner / Admin',
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <style>{`
        .edit-btn:hover {
          background: rgba(76,201,168,0.08) !important;
        }
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
          My Profile
        </h1>
        <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#6b7280' }}>
          Your account information and learning details.
        </p>
      </div>

      {/* Profile card */}
      <div style={{
        background: '#111110',
        border: '1px solid rgba(245,240,232,0.07)',
        borderRadius: 16,
        padding: '32px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Teal top stripe */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, #4CC9A8 0%, #80e8cc 50%, #4CC9A8 100%)',
        }} />

        {/* Avatar + name + edit button row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          marginBottom: 36,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Avatar circle */}
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(76,201,168,0.25), rgba(76,201,168,0.08))',
              border: '2px solid rgba(76,201,168,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: serif,
                fontSize: '1.6rem',
                fontWeight: 500,
                color: teal,
                lineHeight: 1,
              }}>
                {initials}
              </span>
            </div>

            {/* Name + role */}
            <div>
              <p style={{
                fontFamily: serif,
                fontSize: '1.5rem',
                fontWeight: 400,
                color: '#EAE4D2',
                lineHeight: 1.2,
                marginBottom: 4,
              }}>
                {p.full_name ?? 'Unnamed Student'}
              </p>
              {p.cefr_level && (
                <span style={{
                  display: 'inline-block',
                  fontFamily: sans,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: teal,
                  background: 'rgba(76,201,168,0.1)',
                  border: '1px solid rgba(76,201,168,0.25)',
                  borderRadius: 6,
                  padding: '3px 10px',
                }}>
                  {p.cefr_level}
                </span>
              )}
            </div>
          </div>

          {/* Edit Profile button (placeholder — non-functional) */}
          <button
            className="edit-btn"
            disabled
            style={{
              fontFamily: sans,
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: teal,
              background: 'transparent',
              border: `1px solid rgba(76,201,168,0.4)`,
              borderRadius: 8,
              padding: '10px 22px',
              cursor: 'not-allowed',
              opacity: 0.7,
              transition: 'background 0.2s',
            }}
          >
            Edit Profile
          </button>
        </div>

        {/* Profile fields */}
        <div>
          <ProfileRow label="Full Name"   value={p.full_name} />
          <ProfileRow label="Email"       value={p.email} />
          <ProfileRow label="Role"        value={roleLabelMap[p.role] ?? p.role} />
          <ProfileRow label="CEFR Level"  value={p.cefr_level} />
          <ProfileRow label="Phone"       value={(p as any).phone} />
          <ProfileRow label="Parent Name" value={(p as any).parent_name} />
          <ProfileRow label="Bio"         value={(p as any).bio} />
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 24,
            padding: '14px 0',
          }}>
            <span style={{
              fontFamily: sans,
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#6b7280',
              flexShrink: 0,
              minWidth: 140,
              paddingTop: 2,
            }}>
              Member Since
            </span>
            <span style={{
              fontFamily: sans,
              fontSize: '0.92rem',
              color: '#9ca3af',
              textAlign: 'right',
            }}>
              {formatDate((p as any).created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
