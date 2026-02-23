// 📁 components/landing/MarqueeStrip.tsx
// No 'use client' needed — purely presentational, CSS animation handles motion.

const ITEMS = [
  'IELTS Preparation',
  'TOEFL Preparation',
  'Grammar Mastery',
  'Speaking Confidence',
  'Academic English',
  'CEFR Certification',
  'Live Instructor Sessions',
  'Personalised Feedback',
]

export default function MarqueeStrip() {
  // Duplicate items so the loop is seamless
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="border-t border-b border-[rgba(245,240,232,0.07)] py-4 overflow-hidden bg-[rgba(201,168,76,0.04)]">
      <div className="animate-marquee flex gap-12 items-center w-max">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-4 whitespace-nowrap">
            <span className="text-[0.7rem] tracking-[0.15em] uppercase text-[var(--gold-dim)]">
              {item}
            </span>
            <span className="text-[var(--gold-dim)] text-[0.5rem]">◆</span>
          </div>
        ))}
      </div>
    </div>
  )
}