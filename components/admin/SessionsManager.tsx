'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'

const sans = "'Raleway', sans-serif"
const gold = '#C9A84C'

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
  color: 'rgba(201,168,76,0.5)', marginBottom: '8px',
}

interface SessionsManagerProps {
  courses: any[]
  onCreated?: () => void
}

export default function SessionsManager({ courses }: SessionsManagerProps) {
  const supabase = createClient()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', course_id: '', meeting_url: '',
    starts_at_date: '', starts_at_time: '', duration_min: 60,
  })

  function openAdd() {
    setForm({ title: '', course_id: '', meeting_url: '', starts_at_date: '', starts_at_time: '', duration_min: 60 })
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    const starts_at = form.starts_at_date && form.starts_at_time
      ? new Date(`${form.starts_at_date}T${form.starts_at_time}`).toISOString()
      : null

    await supabase.from('live_sessions').insert({
      title: form.title,
      course_id: form.course_id || null,
      meeting_url: form.meeting_url,
      starts_at,
      duration_min: form.duration_min,
    } as never)

    setSaving(false)
    setModalOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    await supabase.from('live_sessions').delete().eq('id', id)
    router.refresh()
  }

  const valid = form.title.trim() && form.starts_at_date && form.starts_at_time

  return (
    <>
      {/* Schedule button */}
      <button
        onClick={openAdd}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(201,168,76,0.25)', borderRadius: '8px',
          padding: '10px 18px', fontSize: '0.76rem', letterSpacing: '0.06em',
          color: gold, background: 'transparent', cursor: 'pointer',
          fontFamily: sans, fontWeight: 500, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)' }}
      >
        <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>+</span>
        Schedule Session
      </button>

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Session" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="Session title" />
          </div>
          <div>
            <label style={labelStyle}>Course (optional)</label>
            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">All students</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" value={form.starts_at_date} onChange={e => setForm({ ...form, starts_at_date: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input type="time" value={form.starts_at_time} onChange={e => setForm({ ...form, starts_at_time: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Duration (minutes)</label>
            <input type="number" value={form.duration_min} onChange={e => setForm({ ...form, duration_min: parseInt(e.target.value) || 60 })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Meeting URL</label>
            <input type="text" value={form.meeting_url} onChange={e => setForm({ ...form, meeting_url: e.target.value })} style={inputStyle} placeholder="https://meet.google.com/..." />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
            <button onClick={() => setModalOpen(false)} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(245,240,232,0.07)', background: 'transparent', color: '#6B6560', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !valid} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 26px', borderRadius: '10px', border: 'none', background: !valid ? 'rgba(201,168,76,0.15)' : 'linear-gradient(135deg, #b8963f, #d4af5a)', color: !valid ? '#6B6560' : '#0d0f14', cursor: !valid ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : 'Schedule'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
