// components/admin/AssignmentReview.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

interface Submission {
  id: string
  status: string
  content_text: string | null
  content_url: string | null
  submitted_at: string
  grade: number | null
  feedback: string | null
  users: { full_name: string | null; email: string }
  assignments: { title: string; courses: { title: string } }
}

export default function AssignmentReview({ submissions }: { submissions: Submission[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [feedbacks, setFeedbacks] = useState<Record<string, { feedback: string; grade: string }>>({})

  async function submitReview(id: string) {
    const data = feedbacks[id]
    if (!data?.feedback) return
    await supabase
      .from('assignment_submissions')
      .update({
        feedback: data.feedback,
        grade: data.grade ? parseInt(data.grade) : null,
        status: 'reviewed',
        reviewed_at: new Date().toISOString(),
      } as never) // استخدام as never بدلاً من as any
      .eq('id', id)
    router.refresh()
  }

  const inputCls = "w-full bg-[var(--ink-3)] border border-[rgba(245,240,232,0.1)] rounded-sm px-3 py-2 text-[0.82rem] text-[var(--cream)] focus:outline-none focus:border-[var(--gold)] transition-colors"

  return (
    <div className="flex flex-col gap-5">
      {submissions.length === 0 && (
        <p className="text-[var(--muted)] text-[0.88rem]">No submissions yet.</p>
      )}
      {submissions.map((s) => (
        <div key={s.id} className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-6">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div>
              <p className="text-[0.62rem] tracking-widest uppercase text-[var(--gold)] mb-1">
                {s.assignments?.courses?.title} · {s.assignments?.title}
              </p>
              <p className="font-medium text-[0.95rem]">{s.users?.full_name ?? s.users?.email}</p>
              <p className="text-[0.75rem] text-[var(--muted)]">Submitted: {formatDate(s.submitted_at)}</p>
            </div>
            <span className={`text-[0.65rem] tracking-widest uppercase px-2 py-1 rounded-sm border flex-shrink-0 ${
              s.status === 'reviewed'
                ? 'bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)] text-green-400'
                : 'bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.3)] text-[var(--gold)]'
            }`}>
              {s.status}
            </span>
          </div>

          {s.content_text && (
            <p className="text-[0.85rem] text-[var(--cream-dim)] bg-[var(--ink)] rounded-sm p-4 mb-4 leading-relaxed">
              {s.content_text}
            </p>
          )}
          {s.content_url && (
            <a href={s.content_url} target="_blank" rel="noopener noreferrer"
               className="text-[var(--gold)] text-[0.82rem] hover:underline mb-4 block">
              View Submission File →
            </a>
          )}

          {s.status !== 'reviewed' && (
            <div className="flex flex-col gap-3 mt-4 border-t border-[rgba(245,240,232,0.07)] pt-4">
              <div className="flex gap-3">
                <input type="number" min="0" max="100" placeholder="Grade /100"
                       value={feedbacks[s.id]?.grade ?? ''}
                       onChange={(e) => setFeedbacks((prev) => ({ ...prev, [s.id]: { ...prev[s.id], grade: e.target.value } }))}
                       className={`${inputCls} w-32`} />
              </div>
              <textarea rows={3} placeholder="Write your feedback…"
                        value={feedbacks[s.id]?.feedback ?? ''}
                        onChange={(e) => setFeedbacks((prev) => ({ ...prev, [s.id]: { ...prev[s.id], feedback: e.target.value } }))}
                        className={inputCls} />
              <button onClick={() => submitReview(s.id)}
                      className="self-start bg-[var(--gold)] text-[var(--ink)] px-6 py-2 rounded-sm text-[0.78rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all">
                Submit Review
              </button>
            </div>
          )}

          {s.status === 'reviewed' && s.feedback && (
            <div className="mt-3 border-t border-[rgba(245,240,232,0.07)] pt-3">
              <p className="text-[0.75rem] text-[var(--muted)] mb-1">Your feedback:</p>
              <p className="text-[0.85rem] text-[var(--cream-dim)]">{s.feedback}</p>
              {s.grade != null && <p className="text-[0.78rem] text-green-400 mt-1">Grade: {s.grade}/100</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}