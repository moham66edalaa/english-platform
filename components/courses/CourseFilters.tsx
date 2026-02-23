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

  return (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <div>
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--muted)] mb-3">Category</p>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((c) => (
            <button key={c.value}
                    onClick={() => setFilter('category', c.value)}
                    className={[
                      'text-left px-3 py-2 rounded-sm text-[0.82rem] transition-all',
                      (activeCategory ?? '') === c.value
                        ? 'bg-[rgba(201,168,76,0.1)] text-[var(--gold)] border border-[rgba(201,168,76,0.2)]'
                        : 'text-[var(--cream-dim)] hover:text-[var(--cream)]',
                    ].join(' ')}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* CEFR Level */}
      <div>
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--muted)] mb-3">CEFR Level</p>
        <div className="flex flex-col gap-1">
          {['', ...CEFR_LEVELS].map((lvl) => (
            <button key={lvl}
                    onClick={() => setFilter('level', lvl)}
                    className={[
                      'text-left px-3 py-2 rounded-sm text-[0.82rem] transition-all',
                      (activeLevel ?? '') === lvl
                        ? 'bg-[rgba(201,168,76,0.1)] text-[var(--gold)] border border-[rgba(201,168,76,0.2)]'
                        : 'text-[var(--cream-dim)] hover:text-[var(--cream)]',
                    ].join(' ')}>
              {lvl || 'All Levels'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}