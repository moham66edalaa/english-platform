// 📁 app/(student)/assignments/page.tsx

import { requireUser }  from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { formatDate }   from '@/lib/utils'
import Link             from 'next/link'

export const metadata = { title: 'Assignments — Eloquence' }

export default async function AssignmentsPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  // Get enrolled courses with premium plan (assignments are premium-only)
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, plans!inner(has_assignments)')
    .eq('user_id', user.id)
    .eq('plans.has_assignments', true)

  const courseIds = (enrollments ?? []).map((e: { course_id: string }) => e.course_id)

  const { data: assignments } = await supabase
    .from('assignments')
    .select('*, courses(title)')
    .in('course_id', courseIds)
    .order('created_at', { ascending: false })

  const { data: submissions } = await supabase
    .from('assignment_submissions')
    .select('assignment_id, status, grade, feedback')
    .eq('user_id', user.id)

  const submissionMap = (submissions ?? []).reduce(
    (acc: Record<string, typeof submissions[0]>, s: typeof submissions[0]) => {
      acc[s.assignment_id] = s
      return acc
    }, {}
  )

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Assignments
      </h1>

      {(assignments ?? []).length === 0 ? (
        <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-12 text-center">
          <p className="text-[var(--muted)]">No assignments yet — or upgrade to Premium to unlock them.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {(assignments ?? []).map((a: { id: string; title: string; description: string | null; due_date: string | null; courses: { title: string } }) => {
            const sub = submissionMap[a.id]
            return (
              <div key={a.id}
                   className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-6 flex items-start justify-between gap-6 hover:border-[rgba(201,168,76,0.2)] transition-colors">
                <div>
                  <p className="text-[0.7rem] tracking-widest uppercase text-[var(--gold)] mb-1">
                    {a.courses?.title}
                  </p>
                  <h3 className="font-semibold text-[1.1rem] mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {a.title}
                  </h3>
                  {a.description && (
                    <p className="text-[0.82rem] text-[var(--muted)] mb-2">{a.description}</p>
                  )}
                  {a.due_date && (
                    <p className="text-[0.75rem] text-[var(--muted)]">Due: {formatDate(a.due_date)}</p>
                  )}
                  {sub?.feedback && (
                    <p className="text-[0.82rem] text-[var(--cream-dim)] mt-2 border-l-2 border-[var(--gold)] pl-3">
                      Feedback: {sub.feedback}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  {sub ? (
                    <span className={`text-[0.65rem] tracking-widest uppercase px-3 py-1 rounded-sm border ${
                      sub.status === 'reviewed'
                        ? 'bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)] text-green-400'
                        : 'bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.3)] text-[var(--gold)]'
                    }`}>
                      {sub.status === 'reviewed' ? `Reviewed · ${sub.grade ?? '–'}/100` : 'Submitted'}
                    </span>
                  ) : (
                    <Link href={`/assignments?submit=${a.id}`}
                          className="bg-[var(--gold)] text-[var(--ink)] px-5 py-2 rounded-sm text-[0.75rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all whitespace-nowrap">
                      Submit
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}