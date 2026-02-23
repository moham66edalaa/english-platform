// 📁 components/landing/CourseCategories.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { COURSES, COURSE_TABS, CourseTab, CoursePreview } from '@/constants/categories'

export default function CourseCategories() {
  const [activeTab, setActiveTab] = useState<CourseTab>('level')
  const headerRef = useReveal()

  return (
    <section id="courses" className="py-28 px-12 bg-[var(--ink-2)]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div ref={headerRef} className="reveal mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-[var(--gold)]" />
            <span className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
              Our Curriculum
            </span>
          </div>
          <h2
            className="font-light leading-[1.15]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
          >
            Every path to <em className="italic text-[var(--gold)]">English mastery</em>
          </h2>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-[rgba(245,240,232,0.1)] mb-10 overflow-x-auto">
          {COURSE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                'px-7 py-4 text-[0.78rem] tracking-widest uppercase border-b-2 whitespace-nowrap transition-all bg-transparent cursor-pointer',
                activeTab === tab.key
                  ? 'text-[var(--gold)] border-[var(--gold)]'
                  : 'text-[var(--muted)] border-transparent hover:text-[var(--cream)]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES[activeTab].map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="inline-block border border-[rgba(245,240,232,0.15)] text-[var(--cream-dim)] px-8 py-3 rounded-sm text-[0.82rem] tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
          >
            View All Courses →
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Sub-component: individual course card ── */
function CourseCard({ course }: { course: CoursePreview }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block bg-[var(--ink)] border border-[rgba(245,240,232,0.07)] rounded-sm overflow-hidden hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="h-40 bg-[var(--ink-3)] flex items-center justify-center relative overflow-hidden">
        <span
          className="font-semibold relative z-10"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '4rem',
            background: 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {course.badge}
        </span>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(13,15,20,0.8)]" />
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-[0.65rem] tracking-[0.15em] uppercase text-[var(--gold)] mb-2">
          {course.tag}
        </p>
        <h3
          className="text-[1.2rem] font-semibold leading-snug mb-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {course.title}
        </h3>
        <p className="text-[0.82rem] text-[var(--muted)] leading-relaxed mb-4">
          {course.desc}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[rgba(245,240,232,0.07)]">
          <span
            className="text-[1.25rem] font-semibold text-[var(--gold)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {course.price}
          </span>
          <span className="flex items-center gap-1.5 text-[0.7rem] tracking-widest uppercase text-[var(--cream-dim)] group-hover:text-[var(--gold)] transition-colors">
            View Course
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}