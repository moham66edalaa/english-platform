// 📁 components/landing/FAQ.tsx
'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

const FAQS = [
  {
    q: 'How does the placement test work?',
    a: 'The test contains 30 multiple-choice questions covering grammar, vocabulary, and reading comprehension. It\'s auto-graded instantly and assigns you a CEFR level (A1–C1). You\'ll then be redirected to the course that matches your level. The test is completely free and takes around 15 minutes.',
  },
  {
    q: 'What is the difference between Standard and Premium?',
    a: 'The Standard plan gives you full access to all course videos, downloadable PDFs, section quizzes, progress tracking, and a certificate of completion. The Premium plan adds everything in Standard plus assignment submission with instructor feedback, access to live sessions, a private student group, and a personalised study plan.',
  },
  {
    q: 'Do I get lifetime access to the course?',
    a: 'Yes — once you enrol, you have lifetime access to all course materials including future updates. There are no subscription fees or expiry dates.',
  },
  {
    q: 'Can I take more than one course at a time?',
    a: 'Absolutely. You can enrol in as many courses as you like — for example, a level-based course alongside an exam preparation course. Your progress is tracked separately for each.',
  },
  {
    q: 'What if I\'m not happy with my level assignment?',
    a: 'Your placement result is a starting recommendation, not a lock. If you feel the assigned level is too easy or too advanced after starting a course, you can always enrol in a different level. Contact us and we\'ll help you find the right fit.',
  },
  {
    q: 'Are the live sessions recorded?',
    a: 'Premium students can attend live sessions in real time. Sessions are typically recorded and made available in your course area within 24 hours so you never miss a class.',
  },
  {
    q: 'Which exam preparation courses are available?',
    a: 'We currently offer full preparation courses for IELTS and TOEFL. Both courses include reading, writing, listening, and speaking practice with timed mock tests and instructor feedback on Premium.',
  },
  {
    q: 'Is there a certificate after completing a course?',
    a: 'Yes. Every student — on Standard or Premium — receives a digital certificate of completion that you can download and share on LinkedIn or your CV.',
  },
]

export default function FAQ() {
  const headerRef = useReveal()

  return (
    <section className="py-28 px-12 bg-[var(--ink-2)]">
      <div className="max-w-[800px] mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-6 h-px bg-[var(--gold)]" />
            <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
              FAQ
            </span>
            <span className="w-6 h-px bg-[var(--gold)]" />
          </div>
          <h2
            className="font-light leading-[1.15]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
          >
            Common <em className="italic text-[var(--gold)]">questions</em>
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col divide-y divide-[rgba(245,240,232,0.07)]">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false)
  const ref = useReveal(index * 60)

  return (
    <div ref={ref} className="reveal">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left bg-transparent border-none cursor-pointer group"
        aria-expanded={open}
      >
        <span
          className="text-[1rem] font-medium text-[var(--cream)] group-hover:text-[var(--gold)] transition-colors leading-snug"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}
        >
          {faq.q}
        </span>

        {/* +/− icon */}
        <span className="flex-shrink-0 w-6 h-6 rounded-sm border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[var(--gold)] transition-all duration-300 group-hover:bg-[rgba(201,168,76,0.08)]">
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className={`w-3 h-3 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          >
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* Answer — CSS-driven expand */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '300px' : '0px', opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-[0.88rem] text-[var(--muted)] leading-[1.8] pr-10">
          {faq.a}
        </p>
      </div>
    </div>
  )
}