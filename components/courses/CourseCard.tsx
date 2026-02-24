// 📁 components/courses/CourseCard.tsx
import Link from 'next/link'
import type { CourseRow, PlanRow } from '@/types'

interface Props { course: CourseRow & { plans?: PlanRow[] } }

export default function CourseCard({ course }: Props) {
  const minPrice = course.plans?.length
    ? Math.min(...course.plans.map((p) => p.price_usd))
    : null

  const badge =
    course.cefr_level ??
    (course.skill_type === 'grammar' ? 'G' : course.skill_type === 'speaking' ? 'S' : null) ??
    (course.exam_type ?? course.academic_year?.slice(0, 2).toUpperCase() ?? '?')

  const tagLabel =
    course.category === 'level'    ? `Level · ${course.cefr_level}` :
    course.category === 'skill'    ? 'Skill Course' :
    course.category === 'academic' ? 'Academic'     : 'Exam Prep'

  return (
    <Link
      href={`/courses/${course.slug}`}
      style={{
        display:        'block',
        background:     '#1a1e28',
        border:         '1px solid rgba(245,240,232,0.07)',
        borderRadius:   4,
        overflow:       'hidden',
        textDecoration: 'none',
        transition:     'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
        e.currentTarget.style.transform   = 'translateY(-5px)'
        e.currentTarget.style.boxShadow   = '0 20px 60px rgba(0,0,0,0.4)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(245,240,232,0.07)'
        e.currentTarget.style.transform   = 'translateY(0)'
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height:         160,
        background:     '#252c3a',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        position:       'relative',
        overflow:       'hidden',
      }}>
        <span style={{
          fontFamily:           "'Cormorant Garamond', serif",
          fontSize:             '3.5rem',
          fontWeight:           700,
          background:           'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip:       'text',
          position:             'relative',
          zIndex:               1,
        }}>
          {badge}
        </span>
        <div style={{
          position:   'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(26,30,40,0.9) 100%)',
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem 1.25rem 1rem' }}>
        <p style={{
          fontSize: '0.62rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#c9a84c',
          marginBottom: '0.35rem', margin: '0 0 0.35rem 0',
        }}>
          {tagLabel}
        </p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize:   '1.2rem',
          fontWeight: 600,
          color:      '#f5f0e8',
          lineHeight: 1.3,
          margin:     '0 0 0.5rem 0',
        }}>
          {course.title}
        </h3>
        {course.description && (
          <p style={{
            fontSize:   '0.82rem',
            color:      '#6b7280',
            lineHeight: 1.6,
            margin:     '0 0 1rem 0',
            display:    '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow:   'hidden',
          }}>
            {course.description}
          </p>
        )}

        {/* Footer */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          paddingTop:     '0.875rem',
          borderTop:      '1px solid rgba(245,240,232,0.07)',
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize:   '1.2rem',
            fontWeight: 600,
            color:      '#c9a84c',
          }}>
            {minPrice != null ? `$${minPrice}` : 'Free'}
          </span>
          <span style={{
            fontSize:      '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         '#b8b0a0',
            display:       'flex',
            alignItems:    'center',
            gap:           4,
          }}>
            View Course
            <svg viewBox="0 0 12 12" fill="none" width="11" height="11">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
