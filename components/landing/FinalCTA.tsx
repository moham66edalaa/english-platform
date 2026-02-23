// 📁 components/landing/FinalCTA.tsx
'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

export default function FinalCTA() {
  const ref = useReveal()

  return (
    <section className="py-40 px-12 text-center relative overflow-hidden">
      {/* Radial glow rising from the bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.1), transparent)',
        }}
      />

      <div ref={ref} className="reveal relative z-10">
        <h2
          className="font-light leading-[1.1] max-w-[700px] mx-auto mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
        >
          Your fluency starts with one{' '}
          <em className="italic text-[var(--gold)]">honest</em> question: what&apos;s your level?
        </h2>
        <p className="text-[1rem] text-[var(--muted)] max-w-[480px] mx-auto mb-12 leading-[1.7]">
          Take the free placement test. Get your CEFR level. Start the course built for exactly
          where you are.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/placement-test"
            className="inline-block bg-[var(--gold)] text-[var(--ink)] px-10 py-4 rounded-sm text-[0.95rem] font-semibold tracking-wide uppercase hover:bg-[var(--gold-light)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)] transition-all"
          >
            Take the Free Placement Test →
          </Link>
          <Link
            href="/courses"
            className="inline-block border border-[rgba(245,240,232,0.2)] text-[var(--cream)] px-10 py-4 rounded-sm text-[0.95rem] font-medium tracking-wide uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </section>
  )
}