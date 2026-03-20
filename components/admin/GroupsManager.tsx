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

interface GroupsManagerProps {
  groups: any[]
  courses: any[]
  teachers: any[]
}

export default function GroupsManager({ groups, courses, teachers }: GroupsManagerProps) {
  const supabase = createClient()
  const router = useRouter()

  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', course_id: '', teacher_id: '',
    max_students: 30, schedule_note: '', is_active: true,
  })

  function openAdd() {
    setForm({ name: '', course_id: '', teacher_id: '', max_students: 30, schedule_note: '', is_active: true })
    setEditId(null)
    setModalOpen(true)
  }

  function openEdit(g: any) {
    setForm({
      name: g.name ?? '',
      course_id: g.course_id ?? '',
      teacher_id: g.teacher_id ?? '',
      max_students: g.max_students ?? 30,
      schedule_note: g.schedule_note ?? '',
      is_active: g.is_active !== false,
    })
    setEditId(g.id)
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    const payload: any = {
      name: form.name,
      course_id: form.course_id || null,
      teacher_id: form.teacher_id || null,
      max_students: form.max_students,
      schedule_note: form.schedule_note || null,
      is_active: form.is_active,
    }

    if (editId) {
      await supabase.from('groups').update(payload as never).eq('id', editId)
    } else {
      await supabase.from('groups').insert(payload as never)
    }
    setSaving(false)
    setModalOpen(false)
    router.refresh()
  }

  const groupToDelete = groups.find(g => g.id === deleteId)

  async function handleDelete() {
    if (!deleteId) return
    setSaving(true)
    await supabase.from('groups').delete().eq('id', deleteId)
    setSaving(false)
    setDeleteId(null)
    router.refresh()
  }

  return (
    <>
      {/* Add button */}
      <div style={{ marginBottom: '40px' }}>
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
          New Group
        </button>
      </div>

      {/* Rows */}
      {groups.map((g: any, i: number) => {
        const isActive = g.is_active !== false
        const studentCount = g.group_members?.[0]?.count ?? 0

        return (
          <div
            key={g.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 2fr 0.8fr 0.8fr 1fr',
              padding: '14px 24px',
              borderBottom: i < groups.length - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,240,232,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>{g.name ?? '—'}</span>
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>{g.courses?.title ?? '—'}</span>
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>{g.users?.full_name ?? '—'}</span>
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>{studentCount}</span>
            <span>
              <span style={{
                fontFamily: sans, fontWeight: 600, fontSize: '0.6rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                padding: '3px 9px', borderRadius: '4px',
                backgroundColor: isActive ? 'rgba(201,168,76,0.1)' : 'rgba(245,240,232,0.05)',
                border: `1px solid ${isActive ? 'rgba(201,168,76,0.3)' : 'rgba(245,240,232,0.1)'}`,
                color: isActive ? gold : '#6A6560',
              }}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </span>
            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => openEdit(g)}
                style={{
                  background: 'transparent', border: '1px solid rgba(245,240,232,0.08)',
                  borderRadius: '6px', padding: '5px 8px', cursor: 'pointer',
                  color: '#8A8278', transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.borderColor = `${gold}50` }}
                onMouseLeave={e => { e.currentTarget.style.color = '#8A8278'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                onClick={() => setDeleteId(g.id)}
                style={{
                  background: 'transparent', border: '1px solid rgba(245,240,232,0.08)',
                  borderRadius: '6px', padding: '5px 8px', cursor: 'pointer',
                  color: '#8A8278', transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#8A8278'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          </div>
        )
      })}

      {groups.length === 0 && (
        <div style={{ padding: '40px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
          No groups found. Click &ldquo;New Group&rdquo; to create one.
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditId(null) }} title={editId ? 'Edit Group' : 'New Group'} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Group Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g. Group A1 Morning" />
          </div>
          <div>
            <label style={labelStyle}>Course</label>
            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">No course</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Teacher</label>
            <select value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">No teacher</option>
              {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.full_name ?? t.email}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Max Students</label>
              <input type="number" value={form.max_students} onChange={e => setForm({ ...form, max_students: parseInt(e.target.value) || 30 })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.is_active ? 'active' : 'inactive'} onChange={e => setForm({ ...form, is_active: e.target.value === 'active' })} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Schedule Note</label>
            <input type="text" value={form.schedule_note} onChange={e => setForm({ ...form, schedule_note: e.target.value })} style={inputStyle} placeholder="e.g. Sun/Tue/Thu 6-8 PM" />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
            <button onClick={() => { setModalOpen(false); setEditId(null) }} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(245,240,232,0.07)', background: 'transparent', color: '#6B6560', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !form.name.trim()} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 26px', borderRadius: '10px', border: 'none', background: !form.name.trim() ? 'rgba(201,168,76,0.15)' : 'linear-gradient(135deg, #b8963f, #d4af5a)', color: !form.name.trim() ? '#6B6560' : '#0d0f14', cursor: !form.name.trim() ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Group" size="sm">
        <p style={{ fontFamily: sans, fontSize: '0.85rem', color: '#C2B9A7', lineHeight: 1.6, marginBottom: '24px' }}>
          Delete &lsquo;{groupToDelete?.name}&rsquo;? This will also remove all group members and attendance records.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(245,240,232,0.07)', background: 'transparent', color: '#6B6560', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleDelete} disabled={saving} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 26px', borderRadius: '10px', border: 'none', background: '#EF4444', color: '#fff', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </>
  )
}
