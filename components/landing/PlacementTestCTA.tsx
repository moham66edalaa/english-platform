// 📁 components/landing/PlacementTestCTA.tsx
'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { CEFR_LEVELS, CEFR_LABELS } from '@/constants/cefr'

const FEATURES = [
  '30 multiple-choice questions',
  'Instant automated grading',
  'CEFR level assigned: A1 through C1',
  'Course recommendation + direct enrolment link',
]

export default function PlacementTestCTA() {
  const leftRef  = useReveal()
  const rightRef = useReveal(200)

  return (
    <section id="placement" className="py-28 px-12 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 600, height: 600, bottom: -300, left: -100,
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* ── Left: copy ── */}
        <div ref={leftRef} className="reveal">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-[var(--gold)]" />
            <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
              Free · Takes 15 Minutes
            </span>
          </div>
          <h2
            className="font-light leading-[1.15] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
          >
            Don&apos;t guess your level.{' '}
            <em className="italic text-[var(--gold)]">Know it.</em>
          </h2>
          <p className="text-[var(--cream-dim)] leading-[1.75] mb-8 text-[1rem] max-w-[440px]">
            Our diagnostic test maps your grammar, vocabulary, and reading comprehension against
            the CEFR scale — then sends you straight to your ideal starting point.
          </p>

          <ul className="flex flex-col gap-3 mb-10">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[0.9rem]">
                <span className="text-[var(--gold)]">✦</span>
                <span className="text-[var(--cream-dim)]">{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/placement-test"
            className="inline-block bg-[var(--gold)] text-[var(--ink)] px-9 py-3.5 rounded-sm text-[0.88rem] font-semibold tracking-wide uppercase hover:bg-[var(--gold-light)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)] transition-all"
          >
            Begin Placement Test →
          </Link>
        </div>

        {/* ── Right: CEFR grid ── */}
        <div ref={rightRef} className="reveal hidden lg:grid grid-cols-2 gap-4">
          {CEFR_LEVELS.map((level, i) => (
            <div
              key={level}
              className={[
                'border rounded-sm p-6 cursor-default transition-all duration-300 hover:-translate-y-1',
                // C1 spans full width; B1 is highlighted
                i === CEFR_LEVELS.length - 1 ? 'col-span-2' : '',
                level === 'B1'
                  ? 'border-[rgba(201,168,76,0.35)] bg-[linear-gradient(135deg,rgba(201,168,76,0.08),transparent)]'
                  : 'border-[rgba(245,240,232,0.06)] bg-[var(--ink-3)] hover:border-[rgba(201,168,76,0.4)]',
              ].join(' ')}
            >
              <div
                className="text-[2rem] font-bold text-[var(--gold)] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {level}
              </div>
              <div className="text-[0.75rem] text-[var(--muted)] tracking-wide">
                {CEFR_LABELS[level]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}