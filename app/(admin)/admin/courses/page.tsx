// 📁 app/(admin)/admin/courses/page.tsx

import { createClient } from '@/lib/supabase/server'
import Link             from 'next/link'

export const metadata = { title: 'Courses — Admin' }

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*, plans(*)')
    .order('sort_order')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-light text-[2rem]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Courses
        </h1>
        <Link href="/admin/courses/new"
              className="bg-[var(--gold)] text-[var(--ink)] px-6 py-2.5 rounded-sm text-[0.78rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all">
          + New Course
        </Link>
      </div>

      <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm overflow-hidden">
        <table className="w-full text-[0.82rem]">
          <thead>
            <tr className="border-b border-[rgba(245,240,232,0.07)] text-left">
              {['Title', 'Category', 'Level', 'Status', 'Plans', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-3 text-[var(--muted)] font-medium tracking-widest uppercase text-[0.7rem]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(courses ?? []).map((c: {
              id: string; slug: string; title: string; category: string;
              cefr_level: string | null; is_published: boolean;
              plans: { name: string }[]
            }) => (
              <tr key={c.id} className="border-b border-[rgba(245,240,232,0.04)] hover:bg-[rgba(245,240,232,0.02)]">
                <td className="px-5 py-3 text-[var(--cream)] font-medium">{c.title}</td>
                <td className="px-5 py-3 text-[var(--cream-dim)] capitalize">{c.category}</td>
                <td className="px-5 py-3 text-[var(--cream-dim)]">{c.cefr_level ?? '—'}</td>
                <td className="px-5 py-3">
                  <span className={`text-[0.65rem] tracking-widest uppercase px-2 py-1 rounded-sm border ${
                    c.is_published
                      ? 'bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.3)] text-green-400'
                      : 'border-[rgba(245,240,232,0.1)] text-[var(--muted)]'
                  }`}>
                    {c.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3 text-[var(--cream-dim)]">
                  {(c.plans ?? []).map((p) => p.name).join(', ') || '—'}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/courses/${c.id}`}
                          className="text-[var(--gold)] text-[0.75rem] tracking-widest uppercase hover:underline">
                      Edit
                    </Link>
                    <Link href={`/admin/courses/${c.id}/sections`}
                          className="text-[var(--cream-dim)] text-[0.75rem] tracking-widest uppercase hover:text-[var(--cream)]">
                      Sections
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}