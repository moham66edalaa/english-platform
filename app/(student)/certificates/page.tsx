import { requireUser }  from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Certificates — Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'DM Sans', sans-serif"
const teal  = '#4CC9A8'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function CertificatesPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, courses(title, category, cefr_level)')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })

  const list = certificates ?? []

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        .cert-card:hover {
          transform: translateY(-2px);
          border-color: rgba(76,201,168,0.35) !important;
        }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: sans,
          fontSize: '0.62rem',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: teal,
          marginBottom: 8,
        }}>
          Student
        </p>
        <h1 style={{
          fontFamily: serif,
          fontWeight: 300,
          fontSize: '2.6rem',
          color: '#EAE4D2',
          margin: 0,
          lineHeight: 1.15,
        }}>
          My Certificates
        </h1>
        {list.length > 0 && (
          <p style={{
            fontFamily: sans,
            fontSize: '0.85rem',
            color: '#8A8278',
            marginTop: 8,
          }}>
            {list.length} certificate{list.length !== 1 ? 's' : ''} earned
          </p>
        )}
      </div>

      {list.length === 0 ? (
        /* Empty state */
        <div style={{
          background: '#111110',
          border: '1px solid rgba(245,240,232,0.07)',
          borderRadius: 16,
          padding: '64px 32px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(76,201,168,0.08)',
            border: '1px solid rgba(76,201,168,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>
          <p style={{
            fontFamily: sans,
            fontSize: '0.92rem',
            color: '#8A8278',
          }}>
            Complete a course to earn your certificate.
          </p>
        </div>
      ) : (
        /* Certificates grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 20,
        }}>
          {list.map((cert: {
            id: string
            issued_at: string
            certificate_url: string | null
            courses: { title: string; cefr_level: string | null }
          }) => (
            <div
              key={cert.id}
              className="cert-card"
              style={{
                background: '#111110',
                border: '1px solid rgba(245,240,232,0.07)',
                borderRadius: 16,
                padding: 32,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
            >
              {/* Teal top stripe */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(135deg, #4CC9A8, #80e8cc, #4CC9A8)',
              }} />

              <p style={{
                fontFamily: sans,
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: teal,
                marginBottom: 14,
              }}>
                Certificate of Completion
              </p>

              <h3 style={{
                fontFamily: serif,
                fontWeight: 600,
                fontSize: '1.35rem',
                color: '#EAE4D2',
                margin: '0 0 6px',
                lineHeight: 1.3,
              }}>
                {cert.courses?.title}
              </h3>

              {cert.courses?.cefr_level && (
                <p style={{
                  fontFamily: sans,
                  fontSize: '0.82rem',
                  color: teal,
                  marginBottom: 12,
                }}>
                  CEFR Level: {cert.courses.cefr_level}
                </p>
              )}

              <p style={{
                fontFamily: sans,
                fontSize: '0.75rem',
                color: '#5E5A54',
                marginBottom: 22,
              }}>
                Issued: {formatDate(cert.issued_at)}
              </p>

              {cert.certificate_url && (
                <a
                  href={cert.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    border: `1px solid rgba(76,201,168,0.4)`,
                    color: teal,
                    fontFamily: sans,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    padding: '9px 22px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    transition: 'background 0.2s ease',
                  }}
                >
                  Download PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
