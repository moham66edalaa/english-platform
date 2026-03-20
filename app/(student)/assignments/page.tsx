import { requireUser } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Assignments — Eloquence' }

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

interface Submission {
  assignment_id: string
  status: string
  grade: number | null
  feedback: string | null
}

export default async function AssignmentsPage() {
  const user = await requireUser()
  const supabase = await createClient()

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

  const typedSubmissions = (submissions as Submission[]) ?? []

  const submissionMap = typedSubmissions.reduce(
    (acc: Record<string, Submission>, s: Submission) => {
      acc[s.assignment_id] = s
      return acc
    },
    {}
  )

  const list = assignments ?? []

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        .assignment-card:hover {
          border-color: rgba(76,201,168,0.3) !important;
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
          Assignments
        </h1>
        {list.length > 0 && (
          <p style={{
            fontFamily: sans,
            fontSize: '0.85rem',
            color: '#8A8278',
            marginTop: 8,
          }}>
            {list.length} assignment{list.length !== 1 ? 's' : ''} available
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <p style={{
            fontFamily: sans,
            fontSize: '0.92rem',
            color: '#8A8278',
          }}>
            No assignments yet — upgrade to Premium to unlock them.
          </p>
        </div>
      ) : (
        /* Assignment list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {list.map((a: any) => {
            const sub = submissionMap[a.id]
            return (
              <div
                key={a.id}
                className="assignment-card"
                style={{
                  background: '#111110',
                  border: '1px solid rgba(245,240,232,0.07)',
                  borderRadius: 16,
                  padding: 28,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 24,
                  transition: 'border-color 0.25s ease',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: sans,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: teal,
                    marginBottom: 8,
                  }}>
                    {a.courses?.title}
                  </p>

                  <h3 style={{
                    fontFamily: serif,
                    fontWeight: 600,
                    fontSize: '1.15rem',
                    color: '#EAE4D2',
                    margin: '0 0 6px',
                    lineHeight: 1.3,
                  }}>
                    {a.title}
                  </h3>

                  {a.description && (
                    <p style={{
                      fontFamily: sans,
                      fontSize: '0.82rem',
                      color: '#8A8278',
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}>
                      {a.description}
                    </p>
                  )}

                  {a.due_date && (
                    <p style={{
                      fontFamily: sans,
                      fontSize: '0.75rem',
                      color: '#5E5A54',
                    }}>
                      Due: {formatDate(a.due_date)}
                    </p>
                  )}

                  {sub?.feedback && (
                    <p style={{
                      fontFamily: sans,
                      fontSize: '0.82rem',
                      color: '#EAE4D2',
                      marginTop: 14,
                      borderLeft: `2px solid ${teal}`,
                      paddingLeft: 14,
                      lineHeight: 1.55,
                    }}>
                      Feedback: {sub.feedback}
                    </p>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 12,
                  flexShrink: 0,
                }}>
                  {sub ? (
                    <span style={{
                      fontFamily: sans,
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      padding: '5px 14px',
                      borderRadius: 6,
                      ...(sub.status === 'reviewed'
                        ? {
                            background: 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.3)',
                            color: '#4ade80',
                          }
                        : {
                            background: 'rgba(76,201,168,0.08)',
                            border: `1px solid rgba(76,201,168,0.3)`,
                            color: teal,
                          }),
                    }}>
                      {sub.status === 'reviewed' ? `Reviewed \u00B7 ${sub.grade ?? '\u2013'}/100` : 'Submitted'}
                    </span>
                  ) : (
                    <Link
                      href={`/assignments?submit=${a.id}`}
                      style={{
                        display: 'inline-block',
                        background: `linear-gradient(135deg, ${teal}, #3db893)`,
                        color: '#0d0f14',
                        fontFamily: sans,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        padding: '9px 22px',
                        borderRadius: 8,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
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
