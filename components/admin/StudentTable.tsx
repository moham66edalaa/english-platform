// 📁 components/admin/StudentTable.tsx

import { formatDate } from '@/lib/utils'

interface Student {
  id:         string
  full_name:  string | null
  email:      string
  cefr_level: string | null
  created_at: string
  enrollments: { count: number }[]
}

export default function StudentTable({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return <p className="text-[var(--muted)] text-[0.88rem]">No students yet.</p>
  }

  return (
    <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm overflow-hidden">
      <table className="w-full text-[0.82rem]">
        <thead>
          <tr className="border-b border-[rgba(245,240,232,0.07)] text-left">
            {['Name', 'Email', 'Level', 'Enrolments', 'Joined'].map((h) => (
              <th key={h} className="px-5 py-3 text-[var(--muted)] font-medium tracking-widest uppercase text-[0.7rem]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b border-[rgba(245,240,232,0.04)] hover:bg-[rgba(245,240,232,0.02)]">
              <td className="px-5 py-3 text-[var(--cream)]">{s.full_name ?? '—'}</td>
              <td className="px-5 py-3 text-[var(--cream-dim)]">{s.email}</td>
              <td className="px-5 py-3">
                {s.cefr_level
                  ? <span className="text-[0.65rem] tracking-widest uppercase text-[var(--gold)] border border-[rgba(201,168,76,0.3)] px-2 py-0.5 rounded-sm">{s.cefr_level}</span>
                  : <span className="text-[var(--muted)]">—</span>
                }
              </td>
              <td className="px-5 py-3 text-[var(--cream-dim)]">{s.enrollments?.[0]?.count ?? 0}</td>
              <td className="px-5 py-3 text-[var(--muted)]">{formatDate(s.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}