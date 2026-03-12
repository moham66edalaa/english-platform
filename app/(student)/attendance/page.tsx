// app/(student)/attendance/page.tsx
import { requireUser } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Attendance — Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'DM Sans', sans-serif"
const teal  = '#4CC9A8'

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  present:  { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  text: '#22c55e', label: 'Present'  },
  absent:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#ef4444', label: 'Absent'   },
  late:     { bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.3)',  text: '#eab308', label: 'Late'     },
  excused:  { bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)', text: '#6b7280', label: 'Excused' },
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: string | null }) {
  const key = (status ?? '').toLowerCase()
  const color = STATUS_COLORS[key] ?? { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)', text: '#6b7280', label: status ?? '—' }
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: sans,
      fontSize: '0.65rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: color.text,
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: 6,
      padding: '3px 10px',
    }}>
      {color.label}
    </span>
  )
}

export default async function AttendancePage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: records } = await supabase
    .from('attendance')
    .select('*, groups(name)')
    .eq('user_id', user.id)
    .order('session_date', { ascending: false })
    .limit(50)

  const all = records ?? []
  const total   = all.length
  const present = all.filter((r: any) => r.status === 'present').length
  const late    = all.filter((r: any) => r.status === 'late').length
  const absent  = all.filter((r: any) => r.status === 'absent').length
  // Count present + late as attended for rate calculation
  const attended = present + late
  const rate = total > 0 ? Math.round((attended / total) * 100) : 0

  return (
    <div style={{ maxWidth: 1000 }}>
      <style>{`
        .att-table tbody tr:hover td {
          background: rgba(76,201,168,0.04) !important;
        }
        .att-table th, .att-table td {
          padding: 13px 18px;
          text-align: left;
          border-bottom: 1px solid rgba(245,240,232,0.05);
        }
        .att-table th {
          background: rgba(17,17,16,0.6);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
          font-weight: 600;
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
          My Attendance
        </h1>
        <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#6b7280' }}>
          Track your presence across all group sessions.
        </p>
      </div>

      {total === 0 ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(26,30,40,0.8), rgba(13,15,20,0.9))',
          border: '1px solid rgba(245,240,232,0.07)',
          borderRadius: 16,
          padding: '72px 40px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(76,201,168,0.08)',
            border: '1px solid rgba(76,201,168,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '1.6rem',
          }}>
            📋
          </div>
          <p style={{
            fontFamily: serif,
            fontSize: '1.3rem',
            color: '#EAE4D2',
            marginBottom: 8,
          }}>
            No attendance records yet
          </p>
          <p style={{
            fontFamily: sans,
            fontSize: '0.85rem',
            color: '#6b7280',
            maxWidth: 380,
            margin: '0 auto',
          }}>
            Your attendance will be recorded once sessions begin.
          </p>
        </div>
      ) : (
        <>
          {/* Stats bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 14,
            marginBottom: 36,
          }}>
            {/* Total */}
            <div style={{
              background: 'rgba(17,17,16,0.85)',
              border: '1px solid rgba(245,240,232,0.07)',
              borderRadius: 12,
              padding: '20px 22px',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: sans,
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#6b7280',
                marginBottom: 8,
              }}>
                Total Sessions
              </p>
              <p style={{
                fontFamily: serif,
                fontSize: '2.2rem',
                fontWeight: 400,
                color: '#EAE4D2',
                lineHeight: 1,
              }}>
                {total}
              </p>
            </div>

            {/* Present */}
            <div style={{
              background: 'rgba(17,17,16,0.85)',
              border: '1px solid rgba(34,197,94,0.15)',
              borderRadius: 12,
              padding: '20px 22px',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: sans,
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#6b7280',
                marginBottom: 8,
              }}>
                Present
              </p>
              <p style={{
                fontFamily: serif,
                fontSize: '2.2rem',
                fontWeight: 400,
                color: '#22c55e',
                lineHeight: 1,
              }}>
                {present}
              </p>
            </div>

            {/* Absent */}
            <div style={{
              background: 'rgba(17,17,16,0.85)',
              border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: 12,
              padding: '20px 22px',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: sans,
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#6b7280',
                marginBottom: 8,
              }}>
                Absent
              </p>
              <p style={{
                fontFamily: serif,
                fontSize: '2.2rem',
                fontWeight: 400,
                color: '#ef4444',
                lineHeight: 1,
              }}>
                {absent}
              </p>
            </div>

            {/* Attendance Rate */}
            <div style={{
              background: 'rgba(17,17,16,0.85)',
              border: `1px solid ${rate >= 75 ? 'rgba(76,201,168,0.25)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: 12,
              padding: '20px 22px',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: sans,
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#6b7280',
                marginBottom: 8,
              }}>
                Attendance Rate
              </p>
              <p style={{
                fontFamily: serif,
                fontSize: '2.2rem',
                fontWeight: 400,
                color: rate >= 75 ? teal : '#ef4444',
                lineHeight: 1,
              }}>
                {rate}%
              </p>
            </div>
          </div>

          {/* Records table */}
          <div style={{
            background: 'rgba(17,17,16,0.85)',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <table className="att-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ fontFamily: sans }}>Date</th>
                  <th style={{ fontFamily: sans }}>Group</th>
                  <th style={{ fontFamily: sans }}>Status</th>
                  <th style={{ fontFamily: sans }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {all.map((record: any) => (
                  <tr key={record.id}>
                    <td style={{
                      fontFamily: sans,
                      fontSize: '0.85rem',
                      color: '#9ca3af',
                      whiteSpace: 'nowrap',
                    }}>
                      {formatDate(record.session_date)}
                    </td>
                    <td style={{
                      fontFamily: serif,
                      fontSize: '0.95rem',
                      color: '#EAE4D2',
                    }}>
                      {record.groups?.name ?? '—'}
                    </td>
                    <td>
                      <StatusBadge status={record.status} />
                    </td>
                    <td style={{
                      fontFamily: sans,
                      fontSize: '0.82rem',
                      color: '#6b7280',
                      maxWidth: 300,
                    }}>
                      {record.notes ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
