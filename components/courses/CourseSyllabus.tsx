// 📁 components/courses/CourseSyllabus.tsx
'use client'

import { useState } from 'react'
import { formatDuration } from '@/lib/utils'

interface Lesson {
  id: string; title: string; duration_sec: number | null; is_preview: boolean
}
interface Section {
  id: string; title: string; lessons: Lesson[]
}

export default function CourseSyllabus({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<string | null>(sections[0]?.id ?? null)

  return (
    <div className="flex flex-col gap-2">
      {sections.map((section) => (
        <div key={section.id} className="border border-[rgba(245,240,232,0.07)] rounded-sm overflow-hidden">
          <button
            onClick={() => setOpen(open === section.id ? null : section.id)}
            className="w-full flex items-center justify-between px-5 py-4 bg-[var(--ink-2)] hover:bg-[var(--ink-3)] transition-colors text-left"
          >
            <span className="font-medium text-[0.9rem]">{section.title}</span>
            <span className="text-[var(--muted)] text-[0.75rem] tracking-wide">
              {section.lessons.length} lessons {open === section.id ? '▲' : '▼'}
            </span>
          </button>
          {open === section.id && (
            <div className="border-t border-[rgba(245,240,232,0.07)]">
              {section.lessons.map((lesson) => (
                <div key={lesson.id}
                     className="flex items-center justify-between px-5 py-3 border-b border-[rgba(245,240,232,0.04)] last:border-0 hover:bg-[rgba(245,240,232,0.02)]">
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--muted)] text-[0.75rem]">▶</span>
                    <span className="text-[0.85rem] text-[var(--cream-dim)]">{lesson.title}</span>
                    {lesson.is_preview && (
                      <span className="text-[0.6rem] tracking-widest uppercase text-[var(--gold)] border border-[rgba(201,168,76,0.3)] px-1.5 py-0.5 rounded-sm">
                        Preview
                      </span>
                    )}
                  </div>
                  {lesson.duration_sec && (
                    <span className="text-[0.75rem] text-[var(--muted)]">
                      {formatDuration(lesson.duration_sec)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}