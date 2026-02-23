// 📁 components/landing/Testimonials.tsx
'use client'

import { useReveal } from '@/hooks/useReveal'

const TESTIMONIALS = [
  {
    quote:    'I started as an A2 and within six months I passed my IELTS with a 7.5. The structured lessons and live sessions made all the difference.',
    name:     'Sara A.',
    detail:   'IELTS 7.5 · Cairo, Egypt',
    initials: 'SA',
    progress: 'B2 → C1',
  },
  {
    quote:    'The placement test was incredibly accurate. It saved me from wasting time on beginner material and put me straight into B1 where I needed to be.',
    name:     'Khaled M.',
    detail:   'Grammar Course · Alexandria',
    initials: 'KM',
    progress: 'B1 → B2',
  },
  {
    quote:    "The instructor's feedback on my assignments was detailed and genuinely helpful. I felt like I had a private tutor at a fraction of the cost.",
    name:     'Nour R.',
    detail:   'Premium Plan · Giza',
    initials: 'NR',
    progress: 'A2 → B1',
  },
]

export default function Testimonials() {
  const headerRef = useReveal()

  return (
    <section id="about" className="py-28 px-12 bg-[var(--ink-2)] relative overflow-hidden">
      {/* Giant decorative opening quote */}
      <div
        className="absolute top-[-5rem] left-[-2rem] font-bold leading-[0.8] pointer-events-none select-none"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize:   '40rem',
          color:      'rgba(201,168,76,0.03)',
        }}
        aria-hidden
      >
        "
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="reveal mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-[var(--gold)]" />
            <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
              Student Stories
            </span>
          </div>
          <h2
            className="font-light leading-[1.15]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
          >
            Real students. <em className="italic text-[var(--gold)]">Real progress.</em>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Sub-component ── */
function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof TESTIMONIALS)[0]
  index: number
}) {
  const ref = useReveal(index * 120)
  return (
    <div
      ref={ref}
      className="reveal bg-[var(--ink)] border border-[rgba(245,240,232,0.07)] rounded-sm p-8 hover:border-[rgba(201,168,76,0.2)] transition-colors duration-300"
    >
      <div className="text-[var(--gold)] tracking-widest text-[0.85rem] mb-4">★★★★★</div>
      <p
        className="text-[1.1rem] leading-[1.65] italic text-[var(--cream-dim)] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        "{testimonial.quote}"
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[0.75rem] font-bold text-[var(--ink)]"
          style={{ background: 'linear-gradient(135deg, #7a6230, #c9a84c)' }}
        >
          {testimonial.initials}
        </div>
        <div>
          <div className="text-[0.85rem] font-medium flex items-center gap-2 flex-wrap">
            {testimonial.name}
            <span className="inline-block bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] text-[var(--gold)] text-[0.6rem] tracking-widest uppercase px-2 py-0.5 rounded-sm">
              {testimonial.progress}
            </span>
          </div>
          <div className="text-[0.75rem] text-[var(--muted)]">{testimonial.detail}</div>
        </div>
      </div>
    </div>
  )
}