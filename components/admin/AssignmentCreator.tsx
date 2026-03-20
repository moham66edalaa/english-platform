'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'

const sans = "'Raleway', sans-serif"
const gold = '#C9A84C'
const blue = '#4CA8C9'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  backgroundColor: 'rgba(0,0,0,0.2)',
  border: '1px solid rgba(245,240,232,0.07)',
  borderRadius: '10px', color: '#F5F0E8',
  fontSize: '0.85rem', fontFamily: sans, outline: 'none',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: sans,
  fontSize: '0.6rem', fontWeight: 700,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  color: 'rgba(76,168,201,0.5)', marginBottom: '8px',
}

interface AssignmentCreatorProps {
  courses: any[]
}

export default function AssignmentCreator({ courses }: AssignmentCreatorProps) {
  const supabase = createClient()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', course_id: '', due_date: '',
  })

  function openAdd() {
    setForm({ title: '', description: '', course_id: '', due_date: '' })
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('assignments').insert({
      title: form.title,
      description: form.description || null,
      course_id: form.course_id,
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
    } as never)
    setSaving(false)
    setModalOpen(false)
    router.refresh()
  }

  const valid = form.title.trim() && form.course_id

  return (
    <>
      <button
        onClick={openAdd}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: `1px solid rgba(76,168,201,0.35)`, borderRadius: '8px',
          padding: '10px 18px', fontSize: '0.76rem', letterSpacing: '0.06em',
          color: blue, background: 'transparent', cursor: 'pointer',
          fontFamily: sans, fontWeight: 500, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(76,168,201,0.07)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>+</span>
        Create Assignment
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Assignment" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="Assignment title" />
          </div>
          <div>
            <label style={labelStyle}>Course</label>
            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="" disabled>Select course</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Due Date</label>
            <input type="datetime-local" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Describe the assignment..." />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
            <button onClick={() => setModalOpen(false)} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(245,240,232,0.07)', background: 'transparent', color: '#6B6560', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !valid} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 26px', borderRadius: '10px', border: 'none', background: !valid ? 'rgba(76,168,201,0.15)' : blue, color: !valid ? '#6B6560' : '#fff', cursor: !valid ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
