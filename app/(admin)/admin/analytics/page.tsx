// 📁 app/(admin)/admin/analytics/page.tsx

import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Analytics — Admin' }

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [
    { count: totalStudents },
    { count: totalEnrollments },
    { count: completedLessons },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('completed', true),
    supabase.from('payments').select('amount_usd').eq('status', 'completed'),
  ])

  const totalRevenue = (revenueData ?? []).reduce(
    (sum: number, p: { amount_usd: number }) => sum + p.amount_usd, 0
  )

  const stats = [
    { label: 'Total Students',      value: totalStudents ?? 0,    suffix: '' },
    { label: 'Total Enrolments',    value: totalEnrollments ?? 0, suffix: '' },
    { label: 'Lessons Completed',   value: completedLessons ?? 0, suffix: '' },
    { label: 'Total Revenue',       value: totalRevenue.toFixed(2), suffix: '$', prefix: true },
  ]

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Analytics
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-6">
            <div className="font-light text-[2.25rem] text-[var(--gold)]"
                 style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {s.prefix ? `$${s.value}` : s.value}{s.suffix}
            </div>
            <div className="text-[0.78rem] text-[var(--muted)] tracking-wide mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-8 text-center text-[var(--muted)] text-[0.88rem]">
        Detailed charts coming soon — integrate with your preferred analytics library (Recharts, Chart.js).
      </div>
    </div>
  )
}