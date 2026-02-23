// 📁 app/(admin)/admin/page.tsx

import { createClient } from '@/lib/supabase/server'
import Link             from 'next/link'

export const metadata = { title: 'Admin Dashboard — Eloquence' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: courseCount },
    { count: studentCount },
    { count: enrollmentCount },
    { data: recentEnrollments },
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*, users(full_name, email), courses(title), plans(name)')
      .order('enrolled_at', { ascending: false }).limit(8),
  ])

  const stats = [
    { label: 'Total Courses',     value: courseCount ?? 0,     href: '/admin/courses'  },
    { label: 'Total Students',    value: studentCount ?? 0,    href: '/admin/students' },
    { label: 'Total Enrolments',  value: enrollmentCount ?? 0, href: '/admin/students' },
  ]

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Admin Overview
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
                className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-6 hover:border-[rgba(201,168,76,0.3)] transition-colors group">
            <div className="font-light text-[2.5rem] text-[var(--gold)] group-hover:scale-105 transition-transform origin-left"
                 style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {s.value}
            </div>
            <div className="text-[0.78rem] text-[var(--muted)] tracking-wide mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {[
          { label: 'New Course',         href: '/admin/courses/new' },
          { label: 'Manage Placement',   href: '/admin/placement-test' },
          { label: 'View Assignments',   href: '/admin/assignments' },
          { label: 'Live Sessions',      href: '/admin/live-sessions' },
        ].map((a) => (
          <Link key={a.href} href={a.href}
                className="border border-[rgba(201,168,76,0.3)] text-[var(--gold)] px-5 py-2.5 rounded-sm text-[0.78rem] tracking-widest uppercase hover:bg-[rgba(201,168,76,0.08)] transition-all">
            {a.label}
          </Link>
        ))}
      </div>

      {/* Recent enrolments */}
      <h2 className="text-[1.25rem] font-semibold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Recent Enrolments
      </h2>
      <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm overflow-hidden">
        <table className="w-full text-[0.82rem]">
          <thead>
            <tr className="border-b border-[rgba(245,240,232,0.07)] text-[var(--muted)] text-left">
              <th className="px-5 py-3 font-medium tracking-widest uppercase text-[0.7rem]">Student</th>
              <th className="px-5 py-3 font-medium tracking-widest uppercase text-[0.7rem]">Course</th>
              <th className="px-5 py-3 font-medium tracking-widest uppercase text-[0.7rem]">Plan</th>
            </tr>
          </thead>
          <tbody>
            {(recentEnrollments ?? []).map((e: {
              id: string
              users: { full_name: string | null; email: string }
              courses: { title: string }
              plans: { name: string }
            }) => (
              <tr key={e.id} className="border-b border-[rgba(245,240,232,0.04)] hover:bg-[rgba(245,240,232,0.02)]">
                <td className="px-5 py-3 text-[var(--cream)]">
                  {e.users?.full_name ?? e.users?.email}
                </td>
                <td className="px-5 py-3 text-[var(--cream-dim)]">{e.courses?.title}</td>
                <td className="px-5 py-3">
                  <span className={`text-[0.65rem] tracking-widest uppercase px-2 py-1 rounded-sm border ${
                    e.plans?.name === 'premium'
                      ? 'bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.3)] text-[var(--gold)]'
                      : 'border-[rgba(245,240,232,0.1)] text-[var(--muted)]'
                  }`}>
                    {e.plans?.name}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}