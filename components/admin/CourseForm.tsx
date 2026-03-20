// components/admin/CourseForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CourseRow } from '@/types'

const CATEGORIES = ['level', 'skill', 'academic', 'exam'] as const
const CEFR_OPTS = ['A1', 'A2', 'B1', 'B2', 'C1']

export default function CourseForm({ course }: { course: CourseRow | null }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: course?.title ?? '',
    slug: course?.slug ?? '',
    description: course?.description ?? '',
    category: course?.category ?? 'level',
    cefr_level: course?.cefr_level ?? '',
    skill_type: course?.skill_type ?? '',
    academic_year: course?.academic_year ?? '',
    exam_type: course?.exam_type ?? '',
    is_published: course?.is_published ?? false,
  })
  const [saving, setSaving] = useState(false)

  function update(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const payload = {
      ...form,
      cefr_level: form.cefr_level || null,
      skill_type: form.skill_type || null,
      academic_year: form.academic_year || null,
      exam_type: form.exam_type || null,
    }

    if (course) {
      // تحويل payload إلى never لتجاوز فحص النوع
      await supabase.from('courses').update(payload as never).eq('id', course.id)
    } else {
      await supabase.from('courses').insert(payload as never)
    }
    setSaving(false)
    router.push('/admin/courses')
    router.refresh()
  }

  const inputCls = "w-full bg-[var(--ink-3)] border border-[rgba(245,240,232,0.1)] rounded-sm px-4 py-2.5 text-[0.88rem] text-[var(--cream)] focus:outline-none focus:border-[var(--gold)] transition-colors"
  const labelCls = "block text-[0.72rem] tracking-widest uppercase text-[var(--cream-dim)] mb-1.5"

  return (
    <div className="max-w-[700px] flex flex-col gap-5">
      <div>
        <label className={labelCls}>Title</label>
        <input className={inputCls} value={form.title} onChange={(e) => update('title', e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Slug (URL)</label>
        <input className={inputCls} value={form.slug} onChange={(e) => update('slug', e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea rows={4} className={inputCls} value={form.description} onChange={(e) => update('description', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Category</label>
          <select className={inputCls} value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {form.category === 'level' && (
          <div>
            <label className={labelCls}>CEFR Level</label>
            <select className={inputCls} value={form.cefr_level} onChange={(e) => update('cefr_level', e.target.value)}>
              <option value="">— Select —</option>
              {CEFR_OPTS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}
        {form.category === 'skill' && (
          <div>
            <label className={labelCls}>Skill Type</label>
            <select className={inputCls} value={form.skill_type} onChange={(e) => update('skill_type', e.target.value)}>
              <option value="">— Select —</option>
              <option value="grammar">Grammar</option>
              <option value="speaking">Speaking</option>
            </select>
          </div>
        )}
        {form.category === 'academic' && (
          <div>
            <label className={labelCls}>Academic Year</label>
            <select className={inputCls} value={form.academic_year} onChange={(e) => update('academic_year', e.target.value)}>
              <option value="">— Select —</option>
              <option value="1st_secondary">1st Secondary</option>
              <option value="2nd_secondary">2nd Secondary</option>
              <option value="3rd_secondary">3rd Secondary</option>
            </select>
          </div>
        )}
        {form.category === 'exam' && (
          <div>
            <label className={labelCls}>Exam Type</label>
            <select className={inputCls} value={form.exam_type} onChange={(e) => update('exam_type', e.target.value)}>
              <option value="">— Select —</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEFL">TOEFL</option>
            </select>
          </div>
        )}
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.is_published} onChange={(e) => update('is_published', e.target.checked)} className="w-4 h-4 accent-[var(--gold)]" />
        <span className="text-[0.85rem] text-[var(--cream-dim)]">Published (visible to students)</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} disabled={saving} className="bg-[var(--gold)] text-[var(--ink)] px-8 py-2.5 rounded-sm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Course'}
        </button>
        <button onClick={() => router.back()} className="border border-[rgba(245,240,232,0.15)] text-[var(--cream-dim)] px-6 py-2.5 rounded-sm text-[0.82rem] tracking-widest uppercase hover:border-[var(--gold)] transition-all">
          Cancel
        </button>
      </div>
    </div>
  )
}