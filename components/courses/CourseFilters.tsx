// 📁 components/courses/CourseFilters.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { CEFR_LEVELS } from '@/constants/cefr'

const CATEGORIES = [
  { value: '',         label: 'All Courses' },
  { value: 'level',    label: 'By Level'    },
  { value: 'skill',    label: 'Skills'      },
  { value: 'academic', label: 'Academic'    },
  { value: 'exam',     label: 'Exam Prep'   },
]

interface Props {
  activeCategory?: string
  activeLevel?:    string
}

export default function CourseFilters({ activeCategory, activeLevel }: Props) {
  const router   = useRouter()
  const pathname = usePathname()

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams()
    if (key !== 'category' && activeCategory) params.set('category', activeCategory)
    if (key !== 'level'    && activeLevel)    params.set('level',    activeLevel)
    if (value) params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const activeBtn: React.CSSProperties = {
    background:   'rgba(201,168,76,0.1)',
    color:        '#c9a84c',
    border:       '1px solid rgba(201,168,76,0.2)',
    borderRadius: 3,
    padding:      '7px 12px',
    fontSize:     '0.82rem',
    textAlign:    'left',
    cursor:       'pointer',
    width:        '100%',
    letterSpacing:'0.01em',
  }

  const inactiveBtn: React.CSSProperties = {
    background:   'transparent',
    color:        '#b8b0a0',
    border:       '1px solid transparent',
    borderRadius: 3,
    padding:      '7px 12px',
    fontSize:     '0.82rem',
    textAlign:    'left',
    cursor:       'pointer',
    width:        '100%',
    letterSpacing:'0.01em',
    transition:   'color 0.15s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Category */}
      <div>
        <p style={{
          fontSize: '0.62rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#6b7280',
          marginBottom: '0.6rem', margin: '0 0 0.6rem 0',
        }}>
          Category
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {CATEGORIES.map((c) => {
            const isActive = (activeCategory ?? '') === c.value
            return (
              <button
                key={c.value}
                onClick={() => setFilter('category', c.value)}
                style={isActive ? activeBtn : inactiveBtn}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#f5f0e8' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#b8b0a0' }}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(245,240,232,0.07)' }} />

      {/* CEFR Level */}
      <div>
        <p style={{
          fontSize: '0.62rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#6b7280',
          margin: '0 0 0.6rem 0',
        }}>
          CEFR Level
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {['', ...CEFR_LEVELS].map((lvl) => {
            const isActive = (activeLevel ?? '') === lvl
            return (
              <button
                key={lvl}
                onClick={() => setFilter('level', lvl)}
                style={isActive ? activeBtn : inactiveBtn}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#f5f0e8' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#b8b0a0' }}
              >
                {lvl || 'All Levels'}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
