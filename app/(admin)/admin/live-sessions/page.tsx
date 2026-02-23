// 📁 app/(admin)/admin/live-sessions/page.tsx

import { createClient } from '@/lib/supabase/server'
import { formatDate }   from '@/lib/utils'

export const metadata = { title: 'Live Sessions — Admin' }

export default async function LiveSessionsPage() {
  const supabase = await createClient()

  const { data: sessions } = await supabase
    .from('live_sessions')
    .select('*, courses(title)')
    .order('starts_at', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-light text-[2rem]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Live Sessions
        </h1>
        <button className="bg-[var(--gold)] text-[var(--ink)] px-6 py-2.5 rounded-sm text-[0.78rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all">
          + Schedule Session
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {(sessions ?? []).length === 0 && (
          <p className="text-[var(--muted)] text-[0.88rem]">No sessions scheduled yet.</p>
        )}
        {(sessions ?? []).map((s: {
          id: string; title: string; meeting_url: string;
          starts_at: string; duration_min: number;
          courses: { title: string } | null
        }) => (
          <div key={s.id}
               className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-6 flex items-center justify-between gap-6 hover:border-[rgba(201,168,76,0.2)] transition-colors">
            <div>
              <p className="text-[0.7rem] tracking-widest uppercase text-[var(--gold)] mb-1">
                {s.courses?.title ?? 'All students'}
              </p>
              <h3 className="font-semibold text-[1.1rem]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {s.title}
              </h3>
              <p className="text-[0.8rem] text-[var(--muted)] mt-1">
                {formatDate(s.starts_at)} · {s.duration_min} min
              </p>
            </div>
            <a href={s.meeting_url} target="_blank" rel="noopener noreferrer"
               className="border border-[rgba(201,168,76,0.4)] text-[var(--gold)] px-5 py-2 rounded-sm text-[0.75rem] tracking-widest uppercase hover:bg-[rgba(201,168,76,0.08)] transition-all whitespace-nowrap">
              Open Link →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}