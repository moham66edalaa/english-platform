'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type TabKey = 'level' | 'skill' | 'academic' | 'exam'

const COURSES_DATA = {
  level: [
    { title: 'A1 — Beginner', desc: 'Build your first English foundations: alphabet, basic vocabulary, simple sentences.', tag: 'Level Course', price: '$49', level: 'A1' },
    { title: 'A2 — Elementary', desc: 'Communicate in everyday situations, describe your background and surroundings.', tag: 'Level Course', price: '$49', level: 'A2' },
    { title: 'B1 — Intermediate', desc: 'Handle most situations while travelling and produce simple connected text.', tag: 'Level Course', price: '$59', level: 'B1' },
    { title: 'B2 — Upper-Intermediate', desc: 'Interact with fluency with native speakers on a wide range of topics.', tag: 'Level Course', price: '$69', level: 'B2' },
    { title: 'C1 — Advanced', desc: 'Express ideas fluently and spontaneously without much obvious searching.', tag: 'Level Course', price: '$79', level: 'C1' },
  ],
  skill: [
    { title: 'Grammar Mastery', desc: 'Zero in on the rules of English — from articles and tenses to complex clause structures.', tag: 'Skill Course', price: '$59', level: 'All' },
    { title: 'Speaking Confidence', desc: 'Develop fluency, pronunciation, and the ability to think in English — not translate.', tag: 'Skill Course', price: '$59', level: 'All' },
  ],
  academic: [
    { title: '1st Secondary English', desc: 'Full curriculum aligned with national standards for first-year secondary students.', tag: 'Academic', price: '$49', level: 'B1' },
    { title: '2nd Secondary English', desc: 'Comprehensive second-year coverage including advanced grammar and essay writing.', tag: 'Academic', price: '$49', level: 'B1' },
    { title: '3rd Secondary English', desc: 'Exam-focused preparation for final secondary English with past-paper practice.', tag: 'Academic', price: '$49', level: 'B2' },
  ],
  exam: [
    { title: 'IELTS Preparation', desc: 'Band 6–8 target. Full reading, writing, listening, and speaking modules with timed practice.', tag: 'Exam Prep', price: '$89', level: 'B2–C1' },
    { title: 'TOEFL Preparation', desc: 'Comprehensive iBT practice — integrated tasks, academic reading, and lecture summaries.', tag: 'Exam Prep', price: '$89', level: 'B2–C1' },
  ],
}

export default function CourseCategories() {
  const [activeTab, setActiveTab] = useState<TabKey>('level')
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
    <section className="courses" id="courses" ref={sectionRef}>
      <div className="container">
        <div className="section-label reveal">Our Curriculum</div>
        <h2 className="section-headline reveal" style={{ marginBottom: '2.5rem' }}>
          Every path to <em>English mastery</em>
        </h2>
        <div className="tab-nav">
          {(['level', 'skill', 'academic', 'exam'] as const).map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'level' ? 'By Level' : tab === 'skill' ? 'By Skill' : tab === 'academic' ? 'Academic' : 'Exam Prep'}
            </button>
          ))}
        </div>
        <div className="course-grid">
          {COURSES_DATA[activeTab].map((course) => (
            <div key={course.title} className="course-card">
              <div className="course-thumb">
                <div className="course-thumb-inner">{course.level}</div>
              </div>
              <div className="course-body">
                <div className="course-tag">{course.tag}</div>
                <div className="course-title">{course.title}</div>
                <p className="course-desc">{course.desc}</p>
                <div className="course-footer">
                  <div className="course-price">{course.price}</div>
                  <Link href="#" className="course-link">
                    View Course
                    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}