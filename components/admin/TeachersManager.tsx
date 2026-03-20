'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'

const serif = "'Cormorant Garamond', serif"
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

interface TeachersManagerProps {
  teachers: any[]
  courses: any[]
}

export default function TeachersManager({ teachers, courses }: TeachersManagerProps) {
  const supabase = createClient()
  const router = useRouter()

  const [editModal, setEditModal] = useState(false)
  const [coursesModal, setCoursesModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [assignedCourseIds, setAssignedCourseIds] = useState<string[]>([])

  function openAdd() {
    setForm({ full_name: '', email: '', phone: '' })
    setEditId(null)
    setEditModal(true)
  }

  function openEdit(t: any) {
    setForm({ full_name: t.full_name ?? '', email: t.email ?? '', phone: t.phone ?? '' })
    setEditId(t.id)
    setEditModal(true)
  }

  async function openCourses(t: any) {
    setSelectedTeacher(t)
    // Fetch current assignments
    const { data } = await supabase
      .from('teacher_courses')
      .select('course_id')
      .eq('teacher_id', t.id)
    setAssignedCourseIds((data ?? []).map((r: any) => r.course_id))
    setCoursesModal(true)
  }

  function toggleCourse(courseId: string) {
    setAssignedCourseIds(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  async function saveCourseAssignments() {
    if (!selectedTeacher) return
    setSaving(true)
    const tid = selectedTeacher.id

    // Delete all existing, then insert new
    await supabase.from('teacher_courses').delete().eq('teacher_id', tid)
    if (assignedCourseIds.length > 0) {
      await supabase.from('teacher_courses').insert(
        assignedCourseIds.map(cid => ({ teacher_id: tid, course_id: cid })) as never[]
      )
    }
    setSaving(false)
    setCoursesModal(false)
    router.refresh()
  }

  async function handleSave() {
    setSaving(true)
    if (editId) {
      await supabase.from('users').update({
        full_name: form.full_name, phone: form.phone,
      } as never).eq('id', editId)
    }
    // Note: creating new teacher requires auth signup — owner can only edit existing
    setSaving(false)
    setEditModal(false)
    router.refresh()
  }

  async function handleToggleActive(t: any) {
    const newStatus = t.is_active === false ? true : false
    await supabase.from('users').update({ is_active: newStatus } as never).eq('id', t.id)
    router.refresh()
  }

  const teacherToDelete = teachers.find(t => t.id === deleteId)

  async function handleDelete() {
    if (!deleteId) return
    setSaving(true)
    await supabase.from('teacher_courses').delete().eq('teacher_id', deleteId)
    await supabase.from('users').update({ role: 'student' } as never).eq('id', deleteId)
    setSaving(false)
    setDeleteId(null)
    router.refresh()
  }

  return (
    <>
      {/* Add/Edit buttons per row */}
      {teachers.map((t: any, i: number) => {
        const isActive = t.is_active !== false
        const courseCount = t.teacher_courses?.[0]?.count ?? 0
        const joinedDate = t.created_at
          ? new Date(t.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : '—'

        return (
          <div
            key={t.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 0.8fr 0.8fr 1fr 1.2fr',
              padding: '14px 24px',
              borderBottom: i < teachers.length - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,240,232,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>
              {t.full_name ?? '—'}
            </span>
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
              {t.email ?? '—'}
            </span>
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
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>
              {courseCount}
            </span>
            <span style={{ fontFamily: sans, fontSize: '0.76rem', color: '#5E5A54' }}>
              {joinedDate}
            </span>
            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
              {/* Assign Courses */}
              <button
                onClick={() => openCourses(t)}
                title="Assign Courses"
                style={{
                  background: 'transparent', border: '1px solid rgba(245,240,232,0.08)',
                  borderRadius: '6px', padding: '5px 8px', cursor: 'pointer',
                  color: '#8A8278', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px',
                  fontFamily: sans, fontSize: '0.62rem', letterSpacing: '0.06em',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.borderColor = `${gold}50` }}
                onMouseLeave={e => { e.currentTarget.style.color = '#8A8278'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
                Courses
              </button>
              {/* Edit */}
              <button
                onClick={() => openEdit(t)}
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
              {/* Toggle Active */}
              <button
                onClick={() => handleToggleActive(t)}
                title={isActive ? 'Deactivate' : 'Activate'}
                style={{
                  background: 'transparent', border: '1px solid rgba(245,240,232,0.08)',
                  borderRadius: '6px', padding: '5px 8px', cursor: 'pointer',
                  color: isActive ? '#22C55E' : '#8A8278', transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = isActive ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {isActive
                    ? <><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></>
                    : <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
                  }
                </svg>
              </button>
            </div>
          </div>
        )
      })}

      {teachers.length === 0 && (
        <div style={{ padding: '40px 24px', textAlign: 'center', fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>
          No teachers found.
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)} title={editId ? 'Edit Teacher' : 'Add Teacher'} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} style={inputStyle} placeholder="Teacher name" />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} disabled={!!editId} onChange={e => setForm({ ...form, email: e.target.value })} style={{ ...inputStyle, opacity: editId ? 0.5 : 1 }} placeholder="teacher@example.com" />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="+20..." />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
            <button onClick={() => setEditModal(false)} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(245,240,232,0.07)', background: 'transparent', color: '#6B6560', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !form.full_name.trim()} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 26px', borderRadius: '10px', border: 'none', background: !form.full_name.trim() ? 'rgba(201,168,76,0.15)' : 'linear-gradient(135deg, #b8963f, #d4af5a)', color: !form.full_name.trim() ? '#6B6560' : '#0d0f14', cursor: !form.full_name.trim() ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign Courses Modal */}
      <Modal open={coursesModal} onClose={() => setCoursesModal(false)} title={`Assign Courses — ${selectedTeacher?.full_name ?? ''}`} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.75rem', color: '#8A8278', margin: '0 0 12px' }}>
            Select courses this teacher can manage:
          </p>
          {courses.map((c: any) => {
            const checked = assignedCourseIds.includes(c.id)
            return (
              <label
                key={c.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                  background: checked ? 'rgba(201,168,76,0.06)' : 'rgba(0,0,0,0.1)',
                  border: `1px solid ${checked ? 'rgba(201,168,76,0.2)' : 'rgba(245,240,232,0.05)'}`,
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCourse(c.id)}
                  style={{ accentColor: gold, width: '16px', height: '16px' }}
                />
                <div>
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: checked ? '#F5F0E8' : '#8A8278', fontWeight: 500 }}>
                    {c.title}
                  </span>
                  {c.cefr_level && (
                    <span style={{ fontFamily: sans, fontSize: '0.65rem', color: '#5E5A54', marginLeft: '8px' }}>
                      {c.cefr_level}
                    </span>
                  )}
                </div>
              </label>
            )
          })}
          {courses.length === 0 && (
            <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54', textAlign: 'center', padding: '20px' }}>
              No courses available. Create courses first.
            </p>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
            <button onClick={() => setCoursesModal(false)} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(245,240,232,0.07)', background: 'transparent', color: '#6B6560', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={saveCourseAssignments} disabled={saving} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 26px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #b8963f, #d4af5a)', color: '#0d0f14', cursor: 'pointer' }}>
              {saving ? 'Saving...' : `Save (${assignedCourseIds.length} selected)`}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remove Teacher" size="sm">
        <p style={{ fontFamily: sans, fontSize: '0.85rem', color: '#C2B9A7', lineHeight: 1.6, marginBottom: '24px' }}>
          Remove &lsquo;{teacherToDelete?.full_name}&rsquo; from teachers? Their account will be changed to student role.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(245,240,232,0.07)', background: 'transparent', color: '#6B6560', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleDelete} disabled={saving} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 26px', borderRadius: '10px', border: 'none', background: '#EF4444', color: '#fff', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </Modal>
    </>
  )
}
