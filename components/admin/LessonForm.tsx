// components/admin/LessonForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Lesson { id: string; title: string; video_url: string | null }

export default function LessonForm({ sectionId, lessons }: { sectionId: string; lessons: Lesson[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  async function addLesson() {
    if (!title.trim()) return
    await supabase.from('lessons').insert({
      section_id: sectionId,
      title: title.trim(),
      video_url: videoUrl || null,
      sort_order: lessons.length,
    } as never) // تحويل الكائن إلى never لتجاوز فحص TypeScript
    setTitle('')
    setVideoUrl('')
    router.refresh()
  }

  async function deleteLesson(id: string) {
    await supabase.from('lessons').delete().eq('id', id)
    router.refresh()
  }

  const inputCls = "bg-[var(--ink)] border border-[rgba(245,240,232,0.1)] rounded-sm px-3 py-2 text-[0.82rem] text-[var(--cream)] focus:outline-none focus:border-[var(--gold)] transition-colors"

  return (
    <div>
      {/* Lesson list */}
      <div className="flex flex-col gap-2 mb-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="flex items-center justify-between bg-[var(--ink)] px-4 py-2.5 rounded-sm border border-[rgba(245,240,232,0.05)]">
            <span className="text-[0.85rem] text-[var(--cream-dim)]">{lesson.title}</span>
            <button onClick={() => deleteLesson(lesson.id)} className="text-[0.7rem] text-red-400 hover:underline tracking-widest uppercase">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add lesson */}
      <div className="flex gap-3 flex-wrap">
        <input value={title} onChange={(e) => setTitle(e.target.value)}
               placeholder="Lesson title" className={`flex-1 min-w-[180px] ${inputCls}`} />
        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
               placeholder="Video URL" className={`flex-1 min-w-[200px] ${inputCls}`} />
        <button onClick={addLesson}
                className="bg-[var(--ink-3)] border border-[rgba(201,168,76,0.3)] text-[var(--gold)] px-5 py-2 rounded-sm text-[0.75rem] tracking-widest uppercase hover:bg-[rgba(201,168,76,0.08)] transition-all">
          + Lesson
        </button>
      </div>
    </div>
  )
}