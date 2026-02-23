// 📁 components/landing/HowItWorks.tsx
'use client'

import { useReveal } from '@/hooks/useReveal'

const STEPS = [
  {
    num:   '01',
    title: 'Take the Placement Test',
    desc:  '30 MCQ questions auto-graded to find your exact CEFR level in under 15 minutes.',
  },
  {
    num:   '02',
    title: 'Get Your Course Match',
    desc:  'Automatically redirected to the course built precisely for your current level and goals.',
  },
  {
    num:   '03',
    title: 'Learn at Your Pace',
    desc:  'Video lessons, PDFs, quizzes, and live sessions structured across clear learning sections.',
  },
  {
    num:   '04',
    title: 'Earn Your Certificate',
    desc:  'Complete your course and receive a verified certificate of completion to share anywhere.',
  },
]

export default function HowItWorks() {
  const headerRef = useReveal()

  return (
    <section className="py-28 px-12 bg-[var(--ink-2)]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-[var(--gold)]" />
            <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
              How It Works
            </span>
          </div>
          <h2
            className="font-light leading-[1.15]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
          >
            Four steps to <em className="italic text-[var(--gold)]">fluency</em>
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Decorative connector line — desktop only */}
          <div
            className="hidden lg:block absolute top-6 h-px pointer-events-none"
            style={{
              left: '15%', right: '15%',
              background: 'linear-gradient(90deg, transparent, var(--gold-dim), transparent)',
            }}
          />

          {STEPS.map((step, i) => (
            <Step key={step.num} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Step({ step, index }: { step: (typeof STEPS)[0]; index: number }) {
  const ref = useReveal(index * 120)
  return (
    <div ref={ref} className="reveal text-center relative z-10">
      <div className="w-12 h-12 rounded-full border border-[rgba(201,168,76,0.4)] bg-[var(--ink)] flex items-center justify-center mx-auto mb-5 text-[var(--gold)] font-semibold"
           style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem' }}>
        {step.num}
      </div>
      <h3 className="font-semibold mb-2 text-[1.2rem]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {step.title}
      </h3>
      <p className="text-[0.82rem] text-[var(--muted)] leading-relaxed">{step.desc}</p>
    </div>
  )
}