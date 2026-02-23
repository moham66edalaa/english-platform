// 📁 components/landing/PricingPreview.tsx
'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

/* ── Feature list data ── */
const STANDARD_FEATURES = [
  { text: 'All course videos (HD)',          included: true  },
  { text: 'Downloadable PDF resources',      included: true  },
  { text: 'Section quizzes & assessments',   included: true  },
  { text: 'Progress tracking dashboard',     included: true  },
  { text: 'Certificate of completion',       included: true  },
  { text: 'Assignment submission',           included: false },
  { text: 'Instructor feedback',             included: false },
  { text: 'Live session access',             included: false },
  { text: 'Private student group',           included: false },
  { text: 'Personalised study plan',         included: false },
]

const PREMIUM_FEATURES = [
  { text: 'All Standard features',           included: true },
  { text: 'Assignment submission',           included: true },
  { text: 'Manual feedback by instructor',   included: true },
  { text: 'Live session access',             included: true },
  { text: 'Private student group',           included: true },
  { text: 'Personalised study plan',         included: true },
]

/* ── Icon helpers ── */
function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0">
      <circle cx="8" cy="8" r="7.5" stroke="#c9a84c" strokeOpacity="0.4" />
      <path d="M5 8l2 2 4-4" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CrossIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0 opacity-30">
      <circle cx="8" cy="8" r="7.5" stroke="#6b7280" strokeOpacity="0.6" />
      <path d="M5.5 10.5l5-5M10.5 10.5l-5-5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function PricingPreview() {
  const headerRef = useReveal()
  const gridRef   = useReveal(200)

  return (
    <section id="pricing" className="py-28 px-12">
      <div className="max-w-[1200px] mx-auto text-center">

        {/* Header */}
        <div ref={headerRef} className="reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-6 h-px bg-[var(--gold)]" />
            <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
              Simple, Transparent
            </span>
            <span className="w-6 h-px bg-[var(--gold)]" />
          </div>
          <h2
            className="font-light leading-[1.15] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
          >
            Two plans. <em className="italic text-[var(--gold)]">Every course.</em>
          </h2>
          <p className="text-[var(--muted)] text-[0.95rem]">
            Choose the plan that matches how seriously you want to learn.
          </p>
        </div>

        {/* Plan cards */}
        <div ref={gridRef} className="reveal grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto mt-12">

          {/* Standard */}
          <div className="border border-[rgba(245,240,232,0.1)] rounded-sm p-10 text-left hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-[1.75rem] font-semibold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Standard</h3>
            <div className="text-[3rem] font-light text-[var(--gold)] leading-none my-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <sup className="text-[1.25rem] align-top mt-2">$</sup>49
              <span className="text-[1rem] text-[var(--muted)]" style={{ fontFamily: 'DM Sans, sans-serif' }}>/course</span>
            </div>
            <p className="text-[0.85rem] text-[var(--muted)] leading-relaxed mb-6">
              Everything you need for structured self-paced learning.
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {STANDARD_FEATURES.map((f) => (
                <li key={f.text} className={`flex items-center gap-3 text-[0.85rem] ${f.included ? 'text-[var(--cream-dim)]' : 'text-[var(--muted)] opacity-50'}`}>
                  {f.included ? <CheckIcon /> : <CrossIcon />}
                  {f.text}
                </li>
              ))}
            </ul>
            <Link
              href="/courses"
              className="block text-center border border-[rgba(245,240,232,0.2)] text-[var(--cream)] py-3 rounded-sm text-[0.82rem] tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
            >
              Enrol — Standard
            </Link>
          </div>

          {/* Premium */}
          <div className="relative border border-[rgba(201,168,76,0.5)] rounded-sm p-10 text-left hover:-translate-y-1 transition-transform duration-300 bg-[linear-gradient(160deg,rgba(201,168,76,0.06),transparent)]">
            {/* Gold top bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-sm"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)' }}
            />
            <span className="inline-block bg-[var(--gold)] text-[var(--ink)] text-[0.65rem] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-sm mb-6">
              Most Popular
            </span>
            <h3 className="text-[1.75rem] font-semibold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Premium</h3>
            <div className="text-[3rem] font-light text-[var(--gold)] leading-none my-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <sup className="text-[1.25rem] align-top mt-2">$</sup>99
              <span className="text-[1rem] text-[var(--muted)]" style={{ fontFamily: 'DM Sans, sans-serif' }}>/course</span>
            </div>
            <p className="text-[0.85rem] text-[var(--muted)] leading-relaxed mb-6">
              The full experience with live coaching and personalised guidance.
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-[0.85rem] text-[var(--cream-dim)]">
                  <CheckIcon />
                  {f.text}
                </li>
              ))}
            </ul>
            <Link
              href="/courses"
              className="block text-center bg-[var(--gold)] text-[var(--ink)] py-3 rounded-sm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all"
            >
              Enrol — Premium
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}