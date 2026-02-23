// 📁 components/dashboard/ContinueWatching.tsx

import Link from 'next/link'

interface Props {
  enrollments: { courses: { slug: string; title: string }; id: string }[]
  progress:    { lesson_id: string; completed: boolean }[]
}

export default function ContinueWatching({ enrollments, progress }: Props) {
  const incomplete = progress.filter((p) => !p.completed)
  if (incomplete.length === 0 || enrollments.length === 0) return null

  const course = enrollments[0].courses

  return (
    <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.2)] rounded-sm p-5 mb-8 flex items-center justify-between gap-6">
      <div>
        <p className="text-[0.65rem] tracking-widest uppercase text-[var(--gold)] mb-1">Continue Watching</p>
        <p className="font-medium text-[0.95rem]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {course.title}
        </p>
      </div>
      <Link href={`/learn/${course.slug}`}
            className="flex-shrink-0 bg-[var(--gold)] text-[var(--ink)] px-5 py-2.5 rounded-sm text-[0.78rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all">
        Resume →
      </Link>
    </div>
  )
}