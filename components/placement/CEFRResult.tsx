// 📁 components/placement/CEFRResult.tsx

import Link from 'next/link'
import type { PlacementResultRow, CourseRow, PlanRow, CEFRLevel } from '@/types'

interface Props {
  result:            PlacementResultRow | null
  recommendedCourse: (CourseRow & { plans: PlanRow[] }) | null
  cefrLabels:        Record<CEFRLevel, string>
}

export default function CEFRResult({ result, recommendedCourse, cefrLabels }: Props) {
  if (!result) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--muted)]">No placement test result found.</p>
        <Link href="/placement-test" className="mt-4 inline-block text-[var(--gold)] hover:underline text-[0.88rem]">
          Take the test →
        </Link>
      </div>
    )
  }

  const level      = result.assigned_level as CEFRLevel
  const levelLabel = cefrLabels[level]
  const scoreByLevel = result.score_by_level as Record<CEFRLevel, number>

  return (
    <div>
      {/* Result hero */}
      <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.3)] rounded-sm p-10 text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px]"
             style={{ background: 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)' }} />
        <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--gold)] mb-4">Your CEFR Level</p>
        <div className="font-light text-[6rem] text-[var(--gold)] leading-none mb-2"
             style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {level}
        </div>
        <p className="text-[var(--cream)] font-medium text-[1.25rem]">{levelLabel}</p>
        <p className="text-[var(--muted)] text-[0.85rem] mt-2">
          {result.correct_answers} / {result.total_questions} correct
        </p>
      </div>

      {/* Band breakdown */}
      <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-6 mb-8">
        <h3 className="font-semibold text-[1.1rem] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Score by Level
        </h3>
        <div className="flex flex-col gap-3">
          {(Object.entries(scoreByLevel) as [CEFRLevel, number][]).map(([lvl, score]) => (
            <div key={lvl}>
              <div className="flex justify-between text-[0.8rem] mb-1">
                <span className="text-[var(--cream-dim)]">{lvl} — {cefrLabels[lvl]}</span>
                <span className="text-[var(--gold)]">{score}%</span>
              </div>
              <div className="h-2 bg-[var(--ink-3)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                     style={{ width: `${score}%`, background: 'linear-gradient(90deg,#c9a84c,#e8cc80)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended course */}
      {recommendedCourse && (
        <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.2)] rounded-sm p-6">
          <p className="text-[0.7rem] tracking-widest uppercase text-[var(--gold)] mb-2">Recommended for You</p>
          <h3 className="font-semibold text-[1.4rem] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {recommendedCourse.title}
          </h3>
          <p className="text-[var(--muted)] text-[0.85rem] mb-5">{recommendedCourse.description}</p>
          <Link href={`/courses/${recommendedCourse.slug}`}
                className="inline-block bg-[var(--gold)] text-[var(--ink)] px-8 py-3 rounded-sm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all">
            View Course →
          </Link>
        </div>
      )}
    </div>
  )
}