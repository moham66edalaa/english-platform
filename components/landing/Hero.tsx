'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']
const PROGRESS_ITEMS = [
  { label: 'Grammar', value: 78 },
  { label: 'Vocabulary', value: 65 },
  { label: 'Reading', value: 82 },
]
const STATS = [
  { num: '2,400+', label: 'Students Enrolled' },
  { num: '12', label: 'Expert Courses' },
  { num: '98%', label: 'Satisfaction Rate' },
]

export default function Hero() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      barsRef.current.forEach((bar) => {
        if (bar) bar.style.width = bar.dataset.w as string
      })
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-eyebrow">Master the English Language</div>
          <h1 className="hero-headline">
            Speak. Write.<br />
            <em>Thrive</em> in English.
          </h1>
          <p className="hero-sub">
            Structured learning paths from A1 to C1, personalised by your level. 
            Expert-led courses, live sessions, and a placement test that puts you 
            exactly where you need to be.
          </p>
          <div className="hero-actions">
            <Link href="/placement-test" className="btn-primary">
              Take Placement Test →
            </Link>
            <Link href="/#courses" className="btn-ghost">
              Browse Courses
            </Link>
          </div>
          <div className="hero-stats">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="stat-num">{stat.num}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-pill pill-1">
            <span className="dot"></span> Live session in 2 hours
          </div>
          <div className="hero-card">
            <div className="card-tag">Your Learning Journey</div>
            <div className="card-title">CEFR Level Assessment</div>
            <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              Answer 30 questions. We'll find your exact level and recommend the perfect course.
            </p>
            <div className="cefr-badges">
              {CEFR_LEVELS.map((level) => (
                <div key={level} className={`badge ${level === 'B1' ? 'active' : ''}`}>
                  {level}
                </div>
              ))}
            </div>
            <div className="progress-list">
              {PROGRESS_ITEMS.map((item, i) => (
                <div key={item.label} className="prog-item">
                  <label>
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </label>
                  <div className="prog-track">
                    <div
                      ref={(el) => { barsRef.current[i] = el }}
                      className="prog-fill"
                      data-w={`${item.value}%`}
                      style={{ width: 0 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="floating-pill pill-2">
            🏆 Certificate earned — B1 Complete
          </div>
        </div>
      </div>
    </section>
  )
}