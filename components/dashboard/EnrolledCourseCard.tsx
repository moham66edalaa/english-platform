// 📁 components/dashboard/EnrolledCourseCard.tsx

import Link from 'next/link'
import ProgressRing from './ProgressRing'

interface Enrollment {
  id:      string
  courses: { slug: string; title: string; cefr_level: string | null; category: string }
  plans:   { name: string }
}

interface Props {
  enrollment: Enrollment
  progress:   number   // 0-100
}

export default function EnrolledCourseCard({ enrollment, progress }: Props) {
  const { courses: course, plans: plan } = enrollment

  return (
    <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-5 hover:border-[rgba(201,168,76,0.2)] transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[0.62rem] tracking-widest uppercase text-[var(--gold)] mb-1 capitalize">
            {course.category} {course.cefr_level ? `· ${course.cefr_level}` : ''}
          </p>
          <h3 className="font-semibold text-[1rem] leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {course.title}
          </h3>
        </div>
        <ProgressRing percent={progress} size={48} />
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-[0.62rem] tracking-widest uppercase px-2 py-0.5 rounded-sm border ${
          plan.name === 'premium'
            ? 'bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.3)] text-[var(--gold)]'
            : 'border-[rgba(245,240,232,0.1)] text-[var(--muted)]'
        }`}>
          {plan.name}
        </span>
        <Link href={`/learn/${course.slug}`}
              className="text-[0.75rem] tracking-widest uppercase text-[var(--gold)] hover:underline">
          Continue →
        </Link>
      </div>
    </div>
  )
}