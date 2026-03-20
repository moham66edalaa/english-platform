// app/(student)/results/page.tsx
import { requireUser } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Results — Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'DM Sans', sans-serif"
const teal  = '#4CC9A8'

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function ScoreBadge({ score, passing = 70 }: { score: number | null; passing?: number }) {
  if (score === null || score === undefined) return <span style={{ color: '#6b7280', fontFamily: sans, fontSize: '0.85rem' }}>—</span>
  const passed = score >= passing
  return (
    <span style={{
      fontFamily: sans,
      fontSize: '0.85rem',
      fontWeight: 700,
      color: passed ? teal : '#ef4444',
    }}>
      {score}%
    </span>
  )
}

function PassBadge({ passed }: { passed: boolean | null }) {
  if (passed === null || passed === undefined) return <span style={{ color: '#6b7280' }}>—</span>
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: passed ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      border: `1px solid ${passed ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
      fontSize: '0.75rem',
      color: passed ? '#22c55e' : '#ef4444',
    }}>
      {passed ? '✓' : '✕'}
    </span>
  )
}

export default async function ResultsPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: quizAttempts } = await supabase
    .from('quiz_attempts')
    .select('*, quizzes(title, sections(courses(title)))')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  const { data: placementResults } = await supabase
    .from('placement_test_results')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })

  const latestPlacement: any = (placementResults ?? [])[0] ?? null

  return (
    <div style={{ maxWidth: 1000 }}>
      <style>{`
        .results-table tbody tr:hover td {
          background: rgba(76,201,168,0.04) !important;
        }
        .results-table th, .results-table td {
          padding: 13px 18px;
          text-align: left;
          border-bottom: 1px solid rgba(245,240,232,0.05);
        }
        .results-table th {
          background: rgba(17,17,16,0.6);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
          font-weight: 600;
        }
        .section-divider { margin: 52px 0 28px; }
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
          My Results
        </h1>
        <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#6b7280' }}>
          Your placement test scores and quiz performance.
        </p>
      </div>

      {/* ── Section 1: Placement Test ── */}
      <div>
        <h2 style={{
          fontFamily: serif,
          fontWeight: 400,
          fontSize: '1.5rem',
          color: '#EAE4D2',
          marginBottom: 20,
        }}>
          Placement Test Results
        </h2>

        {!latestPlacement ? (
          <div style={{
            background: 'rgba(17,17,16,0.85)',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: 14,
            padding: '40px 32px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: serif,
              fontSize: '1.1rem',
              color: '#9ca3af',
              marginBottom: 16,
            }}>
              You haven't taken the placement test yet.
            </p>
            <Link
              href="/test"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 28px',
                background: 'linear-gradient(135deg, #4CC9A8, #80e8cc)',
                color: '#0d0f14',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Take Placement Test →
            </Link>
          </div>
        ) : (
          <div style={{
            background: 'rgba(17,17,16,0.85)',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: 14,
            padding: '28px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 24,
          }}>
            {/* Assigned Level */}
            <div>
              <p style={{
                fontFamily: sans,
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6b7280',
                marginBottom: 8,
              }}>
                Assigned Level
              </p>
              <p style={{
                fontFamily: serif,
                fontSize: '2rem',
                fontWeight: 500,
                color: teal,
                lineHeight: 1,
              }}>
                {latestPlacement.assigned_level ?? '—'}
              </p>
            </div>

            {/* Score */}
            <div>
              <p style={{
                fontFamily: sans,
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6b7280',
                marginBottom: 8,
              }}>
                Score
              </p>
              <p style={{
                fontFamily: serif,
                fontSize: '2rem',
                fontWeight: 500,
                color: '#EAE4D2',
                lineHeight: 1,
              }}>
                {latestPlacement.score !== null && latestPlacement.score !== undefined
                  ? `${latestPlacement.score}%`
                  : '—'}
              </p>
            </div>

            {/* Date */}
            <div>
              <p style={{
                fontFamily: sans,
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6b7280',
                marginBottom: 8,
              }}>
                Date Taken
              </p>
              <p style={{
                fontFamily: sans,
                fontSize: '0.92rem',
                color: '#9ca3af',
              }}>
                {formatDate(latestPlacement.taken_at)}
              </p>
            </div>

            {/* All attempts count */}
            {(placementResults ?? []).length > 1 && (
              <div>
                <p style={{
                  fontFamily: sans,
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  marginBottom: 8,
                }}>
                  Total Attempts
                </p>
                <p style={{
                  fontFamily: serif,
                  fontSize: '2rem',
                  fontWeight: 500,
                  color: '#EAE4D2',
                  lineHeight: 1,
                }}>
                  {(placementResults ?? []).length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Section 2: Quiz Results ── */}
      <div className="section-divider">
        <h2 style={{
          fontFamily: serif,
          fontWeight: 400,
          fontSize: '1.5rem',
          color: '#EAE4D2',
          marginBottom: 20,
        }}>
          Quiz Results
        </h2>

        {(quizAttempts ?? []).length === 0 ? (
          <div style={{
            background: 'rgba(17,17,16,0.85)',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: 14,
            padding: '48px 32px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: serif,
              fontSize: '1.1rem',
              color: '#9ca3af',
              marginBottom: 6,
            }}>
              No quiz attempts yet
            </p>
            <p style={{
              fontFamily: sans,
              fontSize: '0.82rem',
              color: '#6b7280',
            }}>
              Complete quizzes in your enrolled courses to see results here.
            </p>
          </div>
        ) : (
          <div style={{
            background: 'rgba(17,17,16,0.85)',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <table className="results-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ fontFamily: sans }}>Quiz</th>
                  <th style={{ fontFamily: sans }}>Course</th>
                  <th style={{ fontFamily: sans }}>Score</th>
                  <th style={{ fontFamily: sans }}>Passed</th>
                  <th style={{ fontFamily: sans }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {(quizAttempts ?? []).map((attempt: any) => {
                  const quizTitle = attempt.quizzes?.title ?? '—'
                  const courseTitle = attempt.quizzes?.sections?.courses?.title ?? '—'
                  const score = attempt.score !== null && attempt.score !== undefined ? Math.round(attempt.score) : null
                  const passed = attempt.passed ?? (score !== null ? score >= 70 : null)
                  const date = formatDate(attempt.completed_at ?? attempt.created_at)

                  return (
                    <tr key={attempt.id}>
                      <td style={{
                        fontFamily: serif,
                        fontSize: '0.95rem',
                        color: '#EAE4D2',
                      }}>
                        {quizTitle}
                      </td>
                      <td style={{
                        fontFamily: sans,
                        fontSize: '0.82rem',
                        color: '#9ca3af',
                      }}>
                        {courseTitle}
                      </td>
                      <td>
                        <ScoreBadge score={score} />
                      </td>
                      <td>
                        <PassBadge passed={passed} />
                      </td>
                      <td style={{
                        fontFamily: sans,
                        fontSize: '0.82rem',
                        color: '#6b7280',
                      }}>
                        {date}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
