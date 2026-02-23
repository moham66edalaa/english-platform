'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function PricingPreview() {
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
    <section className="pricing" id="pricing" ref={sectionRef}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="section-label reveal" style={{ justifyContent: 'center' }}>Simple, Transparent</div>
        <h2 className="section-headline reveal">Two plans. <em>Every course.</em></h2>
        <p className="reveal" style={{ color: 'var(--muted)', marginTop: '.75rem', fontSize: '.95rem' }}>
          Choose the plan that matches how seriously you want to learn.
        </p>
        <div className="pricing-grid reveal">
          <div className="plan-card">
            <div className="plan-name">Standard</div>
            <div className="plan-price">
              <sup>$</sup>49<span>/course</span>
            </div>
            <p className="plan-desc">Everything you need for structured self-paced learning.</p>
            <ul className="plan-features">
              <li>All course videos (HD)</li>
              <li>Downloadable PDF resources</li>
              <li>Section quizzes & assessments</li>
              <li>Progress tracking dashboard</li>
              <li>Certificate of completion</li>
              <li className="muted">Assignment submission</li>
              <li className="muted">Instructor feedback</li>
              <li className="muted">Live session access</li>
              <li className="muted">Private student group</li>
              <li className="muted">Personalised study plan</li>
            </ul>
            <Link href="#" className="btn-ghost" style={{ display: 'block', textAlign: 'center' }}>
              Enrol — Standard
            </Link>
          </div>
          <div className="plan-card featured">
            <div className="plan-badge">Most Popular</div>
            <div className="plan-name">Premium</div>
            <div className="plan-price">
              <sup>$</sup>99<span>/course</span>
            </div>
            <p className="plan-desc">The full experience with live coaching and personalised guidance.</p>
            <ul className="plan-features">
              <li>All Standard features</li>
              <li>Assignment submission</li>
              <li>Manual feedback by instructor</li>
              <li>Live session access</li>
              <li>Private student group</li>
              <li>Personalised study plan</li>
            </ul>
            <Link href="#" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
              Enrol — Premium
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}