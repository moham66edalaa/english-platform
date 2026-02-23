'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null)

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

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="final-cta">
      <div className="reveal" ref={ref}>
        <h2 className="cta-headline">
          Your fluency starts with one <em>honest</em> question: what's your level?
        </h2>
        <p className="cta-sub">
          Take the free placement test. Get your CEFR level. Start the course built for exactly where you are.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/placement-test" className="btn-primary" style={{ fontSize: '.95rem', padding: '1rem 2.5rem' }}>
            Take the Free Placement Test →
          </Link>
          <Link href="/#courses" className="btn-ghost" style={{ fontSize: '.95rem', padding: '1rem 2.5rem' }}>
            Browse Courses
          </Link>
        </div>
      </div>
    </section>
  )
}