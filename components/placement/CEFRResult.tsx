// components/placement/CEFRResult.tsx
'use client'

import Link from 'next/link'

const LEVELS = [
  { code: 'A1', label: 'Beginner' },
  { code: 'A2', label: 'Elementary' },
  { code: 'B1', label: 'Intermediate' },
  { code: 'B2', label: 'Upper-Intermediate' },
  { code: 'C1', label: 'Advanced' },
]

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

interface CEFRResultProps {
  result?: {
    assigned_level: string
    correct_answers: number
    total_questions: number
    score_by_level: Record<string, number>
  } | null
  recommendedCourse?: {
    title: string
    description: string
    slug: string
  } | null
  cefrLabels?: Record<string, string>
  activeLevel?: string
}

export default function CEFRResult({
  result,
  recommendedCourse,
  cefrLabels,
  activeLevel,
}: CEFRResultProps) {

  /* ── RESULT VIEW ── */
  if (result) {
    const level      = result.assigned_level
    const levelLabel = cefrLabels?.[level] ?? LEVELS.find(l => l.code === level)?.label ?? level
    const pct        = Math.round((result.correct_answers / result.total_questions) * 100)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '680px', margin: '0 auto' }}>

        {/* ── Hero card ── */}
        <div style={{
          backgroundColor: '#13120E',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '20px',
          padding: '48px 40px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* top gold line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, #C9A84C, #E8CC80, #C9A84C, transparent)',
          }} />

          {/* label */}
          <p style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: gold, marginBottom: '16px' }}>
            Your CEFR Level
          </p>

          {/* big level */}
          <div style={{ fontFamily: serif, fontWeight: 300, fontSize: '7rem', lineHeight: 1, color: gold, marginBottom: '8px' }}>
            {level}
          </div>

          {/* level name */}
          <p style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.6rem', color: '#EAE4D2', marginBottom: '8px' }}>
            {levelLabel}
          </p>

          {/* score */}
          <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.85rem', color: '#7A7570' }}>
            {result.correct_answers} / {result.total_questions} correct &nbsp;·&nbsp; {pct}%
          </p>

          {/* circular-ish score ring using conic-gradient */}
          <div style={{
            margin: '28px auto 0',
            width: '90px', height: '90px',
            borderRadius: '50%',
            background: `conic-gradient(${gold} 0% ${pct}%, rgba(201,168,76,0.1) ${pct}% 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              backgroundColor: '#13120E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: sans, fontWeight: 600, fontSize: '1.1rem', color: gold,
            }}>
              {pct}%
            </div>
          </div>
        </div>

        {/* ── Score by Level ── */}
        <div style={{
          backgroundColor: '#111110',
          border: '1px solid rgba(245,240,232,0.06)',
          borderRadius: '20px',
          padding: '32px 36px',
        }}>
          <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '24px' }}>
            Score by Level
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {LEVELS.map(({ code, label }) => {
              const score = result.score_by_level?.[code] ?? 0
              const isAssigned = code === level
              return (
                <div key={code}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                    <span style={{
                      fontFamily: sans, fontWeight: isAssigned ? 500 : 300,
                      fontSize: '0.82rem',
                      color: isAssigned ? '#E0DAC8' : '#6A6560',
                    }}>
                      {code}
                      <span style={{ color: '#4A4642', margin: '0 6px' }}>—</span>
                      {label}
                      {isAssigned && (
                        <span style={{
                          marginLeft: '8px', fontSize: '0.55rem', fontWeight: 600,
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: gold, verticalAlign: 'middle',
                        }}>
                          ← Your level
                        </span>
                      )}
                    </span>
                    <span style={{ fontFamily: sans, fontWeight: 500, fontSize: '0.82rem', color: isAssigned ? gold : '#5E5A54' }}>
                      {score}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: '6px', borderRadius: '100px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '100px',
                      width: `${score}%`,
                      background: isAssigned
                        ? 'linear-gradient(90deg, #C9A84C, #E8CC80)'
                        : 'rgba(201,168,76,0.3)',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Recommended Course ── */}
        {recommendedCourse && (
          <div style={{
            backgroundColor: '#111110',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: '20px',
            padding: '32px 36px',
          }}>
            <p style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: gold, marginBottom: '10px' }}>
              Recommended for You
            </p>
            <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.5rem', color: '#EAE4D2', marginBottom: '8px' }}>
              {recommendedCourse.title}
            </h3>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.85rem', color: '#7A7570', lineHeight: 1.7, marginBottom: '24px' }}>
              {recommendedCourse.description}
            </p>
            <Link
              href={`/courses/${recommendedCourse.slug}`}
              style={{
                display: 'inline-block',
                backgroundColor: gold, color: '#0D0D0B',
                padding: '13px 32px', borderRadius: '10px',
                fontFamily: sans, fontWeight: 600,
                fontSize: '0.72rem', letterSpacing: '0.16em',
                textTransform: 'uppercase', textDecoration: 'none',
              }}
            >
              View Course →
            </Link>
          </div>
        )}

      </div>
    )
  }

  /* ── INTRO GRID (no result yet) ── */
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '10px',
      width: '100%',
      maxWidth: '640px',
      margin: '0 auto 36px',
    }}>
      {LEVELS.map(({ code, label }) => (
        <div
          key={code}
          style={{
            backgroundColor: activeLevel === code ? '#1e1c13' : '#161618',
            borderRadius: '14px',
            padding: '20px 12px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '130px',
            cursor: 'default',
          }}
        >
          <span style={{ fontFamily: serif, fontWeight: 400, fontSize: '2.4rem', lineHeight: 1, color: gold }}>
            {code}
          </span>
          <span style={{ fontFamily: sans, fontWeight: 500, fontSize: '0.56rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54', marginTop: '12px' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}