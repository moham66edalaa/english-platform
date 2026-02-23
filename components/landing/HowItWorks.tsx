'use client'

import { useEffect, useRef } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Take the Placement Test',
    desc: '30 MCQ questions auto-graded to find your exact CEFR level in under 15 minutes.',
  },
  {
    num: '02',
    title: 'Get Your Course Match',
    desc: 'Automatically redirected to the course built precisely for your current level and goals.',
  },
  {
    num: '03',
    title: 'Learn at Your Pace',
    desc: 'Video lessons, PDFs, quizzes, and live sessions structured across clear learning sections.',
  },
  {
    num: '04',
    title: 'Earn Your Certificate',
    desc: 'Complete your course, receive a verified certificate of completion to share anywhere.',
  },
]

export default function HowItWorks() {
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
    <section className="how" ref={sectionRef}>
      <div className="container">
        <div className="section-label reveal">How It Works</div>
        <h2 className="section-headline reveal">
          Four steps to <em>fluency</em>
        </h2>
        <div className="steps">
          {STEPS.map((step, index) => (
            <div key={step.num} className="step reveal">
              <div className="step-num">{step.num}</div>
              <div className="step-title">{step.title}</div>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}