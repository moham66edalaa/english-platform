// app/(owner)/owner/page.tsx

import { createClient } from '@/lib/supabase/server'
import Link             from 'next/link'

export const metadata = { title: 'Owner Dashboard — Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function OwnerDashboardPage() {
  const supabase = await createClient()

  const [
    { count: courseCount },
    { count: studentCount },
    { count: enrollmentCount },
    { count: teacherCount },
    { count: groupCount },
    { data: recentEnrollments },
    { data: upcomingSessions },
    { data: recentAnnouncements },
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('groups').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('enrollments')
      .select('*, users(full_name, email), courses(title), plans(name)')
      .order('enrolled_at', { ascending: false })
      .limit(8),
    supabase
      .from('scheduled_sessions')
      .select('*, users(full_name), groups(name)')
      .eq('is_active', true)
      .order('start_time', { ascending: true })
      .limit(3),
    supabase
      .from('announcements')
      .select('*, users(full_name)')
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const stats = [
    { label: 'Total Courses',    value: courseCount    ?? 0, href: '/owner/courses',  icon: '▣' },
    { label: 'Total Students',   value: studentCount   ?? 0, href: '/owner/students', icon: '◉' },
    { label: 'Total Enrolments', value: enrollmentCount ?? 0, href: '/owner/students', icon: '◈' },
    { label: 'Total Teachers',   value: teacherCount   ?? 0, href: '/owner/teachers', icon: '◯' },
    { label: 'Active Groups',    value: groupCount     ?? 0, href: '/owner/groups',   icon: '▦' },
  ]

  const actions = [
    { label: 'New Course',     href: '/owner/courses/new',    icon: '+' },
    { label: 'Placement Test', href: '/owner/placement-test', icon: '✎' },
    { label: 'Assignments',    href: '/owner/assignments',    icon: '◈' },
    { label: 'Live Sessions',  href: '/owner/live-sessions',  icon: '◎' },
    { label: 'Analytics',      href: '/owner/analytics',      icon: '◆' },
  ]

  return (
    <>
      <style>{`
        .stat-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; padding:28px 28px 24px; text-decoration:none; display:block; transition:border-color 0.2s, background 0.2s; }
        .stat-card:hover { background-color:#161613; border-color:rgba(201,168,76,0.3); }
        .action-btn { display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(201,168,76,0.25); border-radius:8px; padding:10px 18px; font-size:0.76rem; letter-spacing:0.06em; color:#C9A84C; text-decoration:none; transition:background 0.15s, border-color 0.15s; }
        .action-btn:hover { background-color:rgba(201,168,76,0.07); border-color:rgba(201,168,76,0.5); }
        .enrol-row { display:grid; grid-template-columns:2fr 2fr 1fr; padding:14px 24px; transition:background 0.15s; }
        .enrol-row:hover { background-color:rgba(245,240,232,0.02); }
        .session-row { display:grid; grid-template-columns:2fr 1fr 1fr; padding:14px 24px; transition:background 0.15s; }
        .session-row:hover { background-color:rgba(245,240,232,0.02); }
        .announce-row { padding:16px 24px; transition:background 0.15s; }
        .announce-row:hover { background-color:rgba(245,240,232,0.02); }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6F35', marginBottom: '8px' }}>
            Owner Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2' }}>
            Overview
          </h1>
        </div>

        {/* Stat cards — responsive auto-fill grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {stats.map(({ label, value, href, icon }) => (
            <Link key={label} href={href} className="stat-card">
              <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '0.9rem', marginBottom: '16px' }}>
                {icon}
              </div>
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: '3rem', lineHeight: 1, color: gold, marginBottom: '8px' }}>
                {value.toLocaleString()}
              </div>
              <div style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.78rem', color: '#6A6560', letterSpacing: '0.04em' }}>
                {label}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {actions.map(({ label, href, icon }) => (
            <Link key={href} href={href} className="action-btn" style={{ fontFamily: sans, fontWeight: 500 }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Upcoming Sessions + Recent Announcements — 2-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>

          {/* Upcoming Sessions */}
          <div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.4rem', color: '#EAE4D2', marginBottom: '16px' }}>
              Upcoming Sessions
            </h2>
            <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
                {['Teacher', 'Group', 'Starts'].map(h => (
                  <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                    {h}
                  </span>
                ))}
              </div>

              {(upcomingSessions ?? []).length === 0 ? (
                <div style={{ padding: '32px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
                  No upcoming sessions.
                </div>
              ) : (
                (upcomingSessions ?? []).map((s: any, i: number) => {
                  const startDate = s.start_time
                    ? new Date(s.start_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                    : '—'
                  const startTime = s.start_time
                    ? new Date(s.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                    : ''
                  return (
                    <div
                      key={s.id}
                      className="session-row"
                      style={{ borderBottom: i < (upcomingSessions?.length ?? 0) - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
                    >
                      <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                        {s.users?.full_name ?? '—'}
                      </span>
                      <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                        {s.groups?.name ?? '—'}
                      </span>
                      <span style={{ fontFamily: sans, fontSize: '0.76rem', color: '#5E5A54' }}>
                        {startDate}{startTime ? `, ${startTime}` : ''}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Recent Announcements */}
          <div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.4rem', color: '#EAE4D2', marginBottom: '16px' }}>
              Recent Announcements
            </h2>
            <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>

              {(recentAnnouncements ?? []).length === 0 ? (
                <div style={{ padding: '32px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
                  No announcements yet.
                </div>
              ) : (
                (recentAnnouncements ?? []).map((a: any, i: number) => {
                  const postedDate = a.created_at
                    ? new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'
                  return (
                    <div
                      key={a.id}
                      className="announce-row"
                      style={{ borderBottom: i < (recentAnnouncements?.length ?? 0) - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
                    >
                      <div style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {a.title ?? a.message ?? '(no title)'}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontFamily: sans, fontSize: '0.7rem', color: '#5E5A54' }}>
                          {a.users?.full_name ?? 'Unknown'}
                        </span>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#3E3A36', flexShrink: 0, display: 'inline-block' }} />
                        <span style={{ fontFamily: sans, fontSize: '0.7rem', color: '#5E5A54' }}>
                          {postedDate}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Recent Enrolments */}
        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.4rem', color: '#EAE4D2', marginBottom: '16px' }}>
          Recent Enrolments
        </h2>

        <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            {['Student', 'Course', 'Plan'].map(h => (
              <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                {h}
              </span>
            ))}
          </div>

          {(recentEnrollments ?? []).length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
              No enrolments yet.
            </div>
          ) : (
            (recentEnrollments ?? []).map((e: any, i: number) => (
              <div
                key={e.id}
                className="enrol-row"
                style={{ borderBottom: i < (recentEnrollments?.length ?? 0) - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
              >
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                  {e.users?.full_name ?? e.users?.email ?? '—'}
                </span>
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                  {e.courses?.title ?? '—'}
                </span>
                <span>
                  <span style={{
                    fontFamily: sans, fontWeight: 600,
                    fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                    padding: '3px 9px', borderRadius: '4px',
                    backgroundColor: e.plans?.name === 'premium' ? 'rgba(201,168,76,0.1)' : 'rgba(245,240,232,0.05)',
                    border: `1px solid ${e.plans?.name === 'premium' ? 'rgba(201,168,76,0.3)' : 'rgba(245,240,232,0.1)'}`,
                    color: e.plans?.name === 'premium' ? gold : '#6A6560',
                  }}>
                    {e.plans?.name ?? '—'}
                  </span>
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  )
}
