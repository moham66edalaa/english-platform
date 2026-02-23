'use client'

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
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="marquee-strip">
      <div className="marquee-inner">
        {doubled.map((item, i) => (
          <div key={i} className="marquee-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}