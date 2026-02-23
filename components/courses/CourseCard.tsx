// 📁 components/courses/CourseCard.tsx

import Link from 'next/link'
import type { CourseRow, PlanRow } from '@/types'

interface Props {
  course: CourseRow & { plans?: PlanRow[] }
}

export default function CourseCard({ course }: Props) {
  const minPrice = course.plans?.length
    ? Math.min(...course.plans.map((p) => p.price_usd))
    : null

  const badge =
    course.cefr_level ??
    (course.skill_type === 'grammar' ? 'G' : course.skill_type === 'speaking' ? 'S' : null) ??
    (course.exam_type ?? course.academic_year?.slice(0, 2).toUpperCase() ?? '?')

  return (
    <Link href={`/courses/${course.slug}`}
          className="group block bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm overflow-hidden hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300">
      {/* Thumbnail */}
      <div className="h-36 bg-[var(--ink-3)] flex items-center justify-center relative overflow-hidden">
        <span className="font-semibold relative z-10"
              style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '3.5rem',
                background: 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
          {badge}
        </span>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(13,15,20,0.8)]" />
      </div>

      <div className="p-5">
        <p className="text-[0.62rem] tracking-[0.15em] uppercase text-[var(--gold)] mb-1.5 capitalize">
          {course.category === 'level' ? `Level ${course.cefr_level}` : course.category}
        </p>
        <h3 className="font-semibold leading-snug mb-2 text-[1.1rem]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {course.title}
        </h3>
        {course.description && (
          <p className="text-[0.78rem] text-[var(--muted)] leading-relaxed mb-3 line-clamp-2">
            {course.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(245,240,232,0.07)]">
          <span className="font-semibold text-[1.15rem] text-[var(--gold)]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {minPrice != null ? `From $${minPrice}` : 'Free'}
          </span>
          <span className="text-[0.68rem] tracking-widest uppercase text-[var(--cream-dim)] group-hover:text-[var(--gold)] transition-colors flex items-center gap-1">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}