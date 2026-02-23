'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const FEATURES = [
  '30 multiple-choice questions',
  'Instant automated grading',
  'CEFR level assigned: A1 through C1',
  'Course recommendation + direct enrolment link',
]

export default function PlacementTestCTA() {
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
    <section className="placement" id="placement" ref={sectionRef}>
      <div className="container">
        <div className="placement-inner">
          <div>
            <div className="section-label reveal">Free · Takes 15 Minutes</div>
            <h2 className="section-headline reveal" style={{ marginBottom: '1.25rem' }}>
              Don't guess your level.<br />
              <em>Know it.</em>
            </h2>
            <p className="reveal" style={{ color: 'var(--cream-dim)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '1rem', maxWidth: '440px' }}>
              Our diagnostic test maps your grammar, vocabulary, and reading 
              comprehension against the CEFR scale — then sends you straight 
              to your ideal starting point.
            </p>
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '2.5rem' }}>
              {FEATURES.map((feature) => (
                <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.9rem' }}>
                  <span style={{ color: 'var(--gold)' }}>✦</span>
                  <span style={{ color: 'var(--cream-dim)' }}>{feature}</span>
                </div>
              ))}
            </div>
            <Link href="/placement-test" className="btn-primary reveal" style={{ display: 'inline-block' }}>
              Begin Placement Test →
            </Link>
          </div>
          <div className="placement-visual reveal">
            <div className="level-card">
              <div className="level-badge">A1</div>
              <div className="level-name">Beginner</div>
            </div>
            <div className="level-card">
              <div className="level-badge">A2</div>
              <div className="level-name">Elementary</div>
            </div>
            <div className="level-card highlight">
              <div className="level-badge">B1</div>
              <div className="level-name">Intermediate</div>
            </div>
            <div className="level-card">
              <div className="level-badge">B2</div>
              <div className="level-name">Upper-Intermediate</div>
            </div>
            <div className="level-card" style={{ gridColumn: 'span 2' }}>
              <div className="level-badge">C1</div>
              <div className="level-name">Advanced</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}