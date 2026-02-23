// components/admin/SectionEditor.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LessonForm from './LessonForm'

interface Lesson { id: string; title: string; video_url: string | null; sort_order: number }
interface Section { id: string; title: string; lessons: Lesson[]; sort_order: number }
interface Course { id: string; sections: Section[] }

export default function SectionEditor({ course }: { course: Course }) {
  const router = useRouter()
  const supabase = createClient()
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  async function addSection() {
    if (!newSectionTitle.trim()) return
    await supabase.from('sections').insert({
      course_id: course.id,
      title: newSectionTitle.trim(),
      sort_order: course.sections.length,
    } as never) // ✅ تحويل الكائن إلى never
    setNewSectionTitle('')
    router.refresh()
  }

  async function deleteSection(sectionId: string) {
    await supabase.from('sections').delete().eq('id', sectionId)
    router.refresh()
  }

  return (
    <div>
      {/* Existing sections */}
      <div className="flex flex-col gap-4 mb-8">
        {course.sections.map((section) => (
          <div key={section.id} className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.07)] rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(245,240,232,0.07)]">
              <button onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="font-medium text-[0.95rem] text-left hover:text-[var(--gold)] transition-colors">
                {section.title} ({section.lessons.length} lessons)
              </button>
              <button onClick={() => deleteSection(section.id)}
                      className="text-[0.72rem] text-red-400 hover:underline tracking-widest uppercase">
                Delete
              </button>
            </div>
            {expandedSection === section.id && (
              <div className="p-5">
                <LessonForm sectionId={section.id} lessons={section.lessons} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add section */}
      <div className="flex gap-3">
        <input
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="New section title…"
          className="flex-1 bg-[var(--ink-3)] border border-[rgba(245,240,232,0.1)] rounded-sm px-4 py-2.5 text-[0.88rem] text-[var(--cream)] focus:outline-none focus:border-[var(--gold)] transition-colors"
        />
        <button onClick={addSection}
                className="bg-[var(--gold)] text-[var(--ink)] px-6 py-2.5 rounded-sm text-[0.78rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all">
          + Add Section
        </button>
      </div>
    </div>
  )
}