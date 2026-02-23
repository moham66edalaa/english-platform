// 📁 components/landing/Hero.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const CEFR_LEVELS  = ['A1', 'A2', 'B1', 'B2', 'C1']
const PROGRESS_ITEMS = [
  { label: 'Grammar',    value: 78 },
  { label: 'Vocabulary', value: 65 },
  { label: 'Reading',    value: 82 },
]
const STATS = [
  { num: '2,400+', label: 'Students Enrolled' },
  { num: '12',     label: 'Expert Courses'    },
  { num: '98%',    label: 'Satisfaction Rate' },
]

export default function Hero() {
  const barsRef = useRef<HTMLDivElement[]>([])

  // Animate progress bars after mount
  useEffect(() => {
    const t = setTimeout(() => {
      barsRef.current.forEach((bar) => {
        if (bar) bar.style.width = bar.dataset.w as string
      })
    }, 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden px-12 pt-32 pb-16">
      {/* Radial background glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 800, height: 800, top: -200, right: -200,
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: Copy ── */}
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 animate-fade-up-1">
            <span className="w-8 h-px bg-[var(--gold)]" />
            <span className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
              Master the English Language
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-light leading-[1.05] tracking-tight mb-7 animate-fade-up-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
            }}
          >
            Speak. Write.{' '}
            <em className="italic text-[var(--gold)] font-normal">Thrive</em> in English.
          </h1>

          {/* Subheading */}
          <p className="text-[1.05rem] font-light leading-[1.75] text-[var(--cream-dim)] max-w-[480px] mb-10 animate-fade-up-3">
            Structured learning paths from A1 to C1, personalised by your level. Expert-led
            courses, live sessions, and a placement test that puts you exactly where you need to be.
          </p>

          {/* CTAs */}
          <div className="flex items-center flex-wrap gap-5 animate-fade-up-4">
            <Link
              href="/placement-test"
              className="bg-[var(--gold)] text-[var(--ink)] px-9 py-3.5 rounded-sm text-[0.88rem] font-semibold tracking-wide uppercase hover:bg-[var(--gold-light)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,168,76,0.3)] transition-all"
            >
              Take Placement Test →
            </Link>
            <Link
              href="/#courses"
              className="border border-[rgba(245,240,232,0.2)] text-[var(--cream)] px-9 py-3.5 rounded-sm text-[0.88rem] font-medium tracking-wide uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
            >
              Browse Courses
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-10 mt-12 pt-12 border-t border-[rgba(245,240,232,0.08)] animate-fade-up-5">
            {STATS.map((s) => (
              <div key={s.label}>
                <div
                  className="text-[2.25rem] font-semibold text-[var(--gold)]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {s.num}
                </div>
                <div className="text-[0.78rem] text-[var(--muted)] tracking-wide mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Floating card ── */}
        <div className="hidden lg:block relative animate-fade-in-6">
          {/* Top pill */}
          <div className="absolute -top-4 right-8 animate-float z-10 bg-[var(--ink-3)] border border-[rgba(201,168,76,0.2)] rounded-full px-4 py-2.5 flex items-center gap-2 text-[0.75rem] text-[var(--cream)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#22c55e]" />
            Live session in 2 hours
          </div>

          {/* Card */}
          <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.2)] rounded-sm p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Gold top bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)' }}
            />

            <p className="text-[0.7rem] tracking-[0.15em] uppercase text-[var(--gold)] mb-4">
              Your Learning Journey
            </p>
            <h3
              className="text-[1.5rem] font-semibold mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              CEFR Level Assessment
            </h3>
            <p className="text-[0.82rem] text-[var(--muted)] leading-relaxed mb-5">
              Answer 30 questions. We'll find your exact level and recommend the perfect course.
            </p>

            {/* CEFR badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CEFR_LEVELS.map((level) => (
                <span
                  key={level}
                  className={[
                    'px-3 py-1 border rounded-sm text-[0.7rem] font-semibold tracking-widest cursor-default transition-all hover:bg-[var(--gold)] hover:text-[var(--ink)] hover:border-[var(--gold)]',
                    level === 'B1'
                      ? 'bg-[var(--gold)] text-[var(--ink)] border-[var(--gold)]'
                      : 'border-[rgba(201,168,76,0.3)] text-[var(--cream-dim)]',
                  ].join(' ')}
                >
                  {level}
                </span>
              ))}
            </div>

            {/* Progress bars */}
            <div className="flex flex-col gap-4">
              {PROGRESS_ITEMS.map((item, i) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[0.8rem] text-[var(--cream-dim)] mb-1.5">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-[3px] bg-[var(--ink-3)] rounded-sm overflow-hidden">
                    <div
                      ref={(el) => { if (el) barsRef.current[i] = el }}
                      data-w={`${item.value}%`}
                      className="h-full rounded-sm transition-[width] duration-1000 ease-out"
                      style={{
                        width: 0,
                        background: 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom pill */}
          <div className="absolute bottom-12 -left-8 animate-float-delay z-10 bg-[var(--ink-3)] border border-[rgba(201,168,76,0.2)] rounded-full px-4 py-2.5 flex items-center gap-2 text-[0.75rem] text-[var(--cream)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] whitespace-nowrap">
            🏆 Certificate earned — B1 Complete
          </div>
        </div>

      </div>
    </section>
  )
}