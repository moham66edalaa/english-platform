'use client'

import { useEffect, useRef } from 'react'

const TESTIMONIALS = [
  {
    quote: "I started as an A2 and within six months I passed my IELTS with a 7.5. The structured lessons and live sessions made all the difference.",
    name: 'Sara A.',
    detail: 'IELTS 7.5 · Cairo, Egypt',
    initials: 'SA',
    pill: 'B2 → C1',
  },
  {
    quote: "The placement test was incredibly accurate. It saved me from wasting time on beginner material and put me straight into B1 where I actually needed to be.",
    name: 'Khaled M.',
    detail: 'Grammar Course · Alexandria',
    initials: 'KM',
    pill: 'B1 → B2',
  },
  {
    quote: "The instructor's feedback on my assignments was detailed and genuinely helpful. I felt like I had a private tutor at a fraction of the cost.",
    name: 'Nour R.',
    detail: 'Premium Plan · Giza',
    initials: 'NR',
    pill: 'A2 → B1',
  },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const elements = sectionRef.current?.querySelectorAll('.reveal')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="testimonials" id="about" ref={sectionRef}>
      <div className="container">
        <div className="section-label reveal">Student Stories</div>
        <h2 className="section-headline reveal">Real students. <em>Real progress.</em></h2>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testimonial-card reveal">
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.initials}</div>
                <div>
                  <div className="author-name">
                    {t.name} <span className="cefr-pill">{t.pill}</span>
                  </div>
                  <div className="author-detail">{t.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}