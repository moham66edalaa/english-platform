// 📁 components/landing/Features.tsx
'use client'

import { useReveal } from '@/hooks/useReveal'

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Structured CEFR Paths',
    desc:  'Every course is mapped to an exact CEFR level — A1 through C1 — so you always know where you are and where you\'re going.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" stroke="#c9a84c" strokeWidth="1.5" />
        <path d="M12 6v6l4 2" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Learn at Your Own Pace',
    desc:  'HD video lessons, downloadable PDFs, and section quizzes — all available on demand, 24 hours a day.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="#c9a84c" strokeWidth="1.5" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Live Instructor Sessions',
    desc:  'Premium students join live group sessions with the instructor — ask questions, get corrections, and accelerate your progress.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M9 11l3 3L22 4" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Assignment & Feedback',
    desc:  'Submit written assignments and receive detailed, personalised feedback from the instructor — not automated responses.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
          stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Placement Test',
    desc:  '30 MCQ questions across grammar, vocabulary, and reading. Auto-graded in seconds to find your exact CEFR level.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="8" r="6" stroke="#c9a84c" strokeWidth="1.5" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Verified Certificates',
    desc:  'Complete a course and earn a certificate you can download, share on LinkedIn, or add to your CV.',
  },
]

export default function Features() {
  const headerRef = useReveal()

  return (
    <section className="py-28 px-12 bg-[var(--ink)]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-6 h-px bg-[var(--gold)]" />
            <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
              Why Eloquence
            </span>
            <span className="w-6 h-px bg-[var(--gold)]" />
          </div>
          <h2
            className="font-light leading-[1.15] max-w-[560px] mx-auto"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
          >
            Everything you need to{' '}
            <em className="italic text-[var(--gold)]">master English</em>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0]
  index: number
}) {
  const ref = useReveal(index * 80)

  return (
    <div
      ref={ref}
      className="reveal group bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm p-7 hover:border-[rgba(201,168,76,0.25)] hover:-translate-y-1 transition-all duration-300"
    >
      {/* Icon container */}
      <div className="w-11 h-11 rounded-sm bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center mb-5 group-hover:bg-[rgba(201,168,76,0.14)] transition-colors">
        {feature.icon}
      </div>

      <h3
        className="text-[1.15rem] font-semibold mb-2 text-[var(--cream)]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {feature.title}
      </h3>
      <p className="text-[0.83rem] text-[var(--muted)] leading-[1.7]">
        {feature.desc}
      </p>
    </div>
  )
}