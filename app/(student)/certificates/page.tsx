// 📁 app/(student)/certificates/page.tsx

import { requireUser }  from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { formatDate }   from '@/lib/utils'

export const metadata = { title: 'Certificates — Eloquence' }

export default async function CertificatesPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, courses(title, category, cefr_level)')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        My Certificates
      </h1>

      {(certificates ?? []).length === 0 ? (
        <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-12 text-center">
          <p className="text-[var(--muted)]">Complete a course to earn your certificate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {(certificates ?? []).map((cert: {
            id: string
            issued_at: string
            certificate_url: string | null
            courses: { title: string; cefr_level: string | null }
          }) => (
            <div key={cert.id}
                 className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.25)] rounded-sm p-8 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              {/* Gold top bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                   style={{ background: 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)' }} />
              <div className="text-[0.7rem] tracking-widest uppercase text-[var(--gold)] mb-3">
                Certificate of Completion
              </div>
              <h3 className="font-semibold text-[1.35rem] mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {cert.courses?.title}
              </h3>
              {cert.courses?.cefr_level && (
                <p className="text-[0.82rem] text-[var(--muted)] mb-3">
                  CEFR Level: {cert.courses.cefr_level}
                </p>
              )}
              <p className="text-[0.75rem] text-[var(--muted)] mb-5">
                Issued: {formatDate(cert.issued_at)}
              </p>
              {cert.certificate_url && (
                <a href={cert.certificate_url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-block border border-[rgba(201,168,76,0.4)] text-[var(--gold)] px-5 py-2 rounded-sm text-[0.75rem] tracking-widest uppercase hover:bg-[rgba(201,168,76,0.1)] transition-all">
                  Download PDF →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}