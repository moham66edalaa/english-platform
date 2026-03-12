// app/(teacher)/teacher/page.tsx

import { createClient } from '@/lib/supabase/server'
import { requireUser }  from '@/lib/auth/helpers'
import Link             from 'next/link'

export const metadata = { title: 'Teacher Dashboard — Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

export default async function TeacherDashboardPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  const [
    { count: myGroupCount },
    { data: myGroups },
    { count: sessionCount },
    { count: submissionCount },
    { data: recentSubmissions },
  ] = await Promise.all([
    supabase
      .from('groups')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', user.id),
    supabase
      .from('groups')
      .select('id, group_members(count)')
      .eq('teacher_id', user.id),
    supabase
      .from('scheduled_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', user.id)
      .eq('is_active', true),
    supabase
      .from('assignment_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'submitted'),
    supabase
      .from('assignment_submissions')
      .select('*, users(full_name, email), assignments(title, courses(title))')
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false })
      .limit(8),
  ])

  const myStudentCount = (myGroups ?? []).reduce(
    (sum: number, g: any) => sum + (g.group_members?.[0]?.count ?? 0),
    0
  )

  const stats = [
    { label: 'My Students',        value: myStudentCount,        href: '/teacher/students',     icon: '◉' },
    { label: 'My Groups',          value: myGroupCount ?? 0,     href: '/teacher/groups',       icon: '◎' },
    { label: 'Upcoming Sessions',  value: sessionCount ?? 0,     href: '/teacher/live-sessions', icon: '▶' },
    { label: 'Pending Reviews',    value: submissionCount ?? 0,  href: '/teacher/assignments',  icon: '◈' },
  ]

  const actions = [
    { label: 'Courses',       href: '/teacher/courses',       icon: '▣' },
    { label: 'Assignments',   href: '/teacher/assignments',   icon: '◈' },
    { label: 'Live Sessions', href: '/teacher/live-sessions', icon: '▶' },
    { label: 'My Students',   href: '/teacher/students',      icon: '◉' },
    { label: 'My Groups',     href: '/teacher/groups',        icon: '◎' },
    { label: 'Attendance',    href: '/teacher/attendance',    icon: '◌' },
    { label: 'Announcements', href: '/teacher/announcements', icon: '⬡' },
  ]

  return (
    <>
      <style>{`
        .stat-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; padding:28px 28px 24px; text-decoration:none; display:block; transition:border-color 0.2s, background 0.2s; }
        .stat-card:hover { background-color:#161613; border-color:rgba(76,168,201,0.3); }
        .action-btn { display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(76,168,201,0.25); border-radius:8px; padding:10px 18px; font-size:0.76rem; letter-spacing:0.06em; color:${blue}; text-decoration:none; transition:background 0.15s, border-color 0.15s; }
        .action-btn:hover { background-color:rgba(76,168,201,0.07); border-color:rgba(76,168,201,0.5); }
        .sub-row { display:grid; grid-template-columns:2fr 2fr 1fr; padding:14px 24px; transition:background 0.15s; }
        .sub-row:hover { background-color:rgba(245,240,232,0.02); }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: blue, marginBottom: '8px' }}>
            Teacher Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
            Overview
          </h1>
          {user.full_name && (
            <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
              Welcome back, {user.full_name.replace(/^Demo\s*/i, '')}
            </p>
          )}
        </div>

        {/* Stat cards — 4-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {stats.map(({ label, value, href, icon }) => (
            <Link key={label} href={href} className="stat-card">
              <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(76,168,201,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: blue, fontSize: '0.9rem', marginBottom: '16px' }}>
                {icon}
              </div>
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.6rem', lineHeight: 1, color: blue, marginBottom: '8px' }}>
                {(value as number).toLocaleString()}
              </div>
              <div style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.75rem', color: '#6A6560', letterSpacing: '0.04em' }}>
                {label}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '44px' }}>
          {actions.map(({ label, href, icon }) => (
            <Link key={href} href={href} className="action-btn" style={{ fontFamily: sans, fontWeight: 500 }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Pending reviews table */}
        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.4rem', color: '#EAE4D2', marginBottom: '16px' }}>
          Pending Reviews
        </h2>

        <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            {['Student', 'Assignment', 'Status'].map(h => (
              <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54' }}>
                {h}
              </span>
            ))}
          </div>

          {(recentSubmissions ?? []).length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
              No pending submissions.
            </div>
          ) : (
            (recentSubmissions ?? []).map((s: any, i: number) => (
              <div
                key={s.id}
                className="sub-row"
                style={{ borderBottom: i < (recentSubmissions?.length ?? 0) - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}
              >
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
                  {s.users?.full_name ?? s.users?.email ?? '—'}
                </span>
                <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
                  {s.assignments?.title ?? '—'}
                </span>
                <span>
                  <span style={{
                    fontFamily: sans, fontWeight: 600,
                    fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                    padding: '3px 9px', borderRadius: '4px',
                    backgroundColor: 'rgba(234,179,8,0.1)',
                    border: '1px solid rgba(234,179,8,0.3)',
                    color: '#eab308',
                  }}>
                    Pending
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
