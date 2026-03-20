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

interface StudentsManagerProps {
  students: any[]
  groups: any[]
  levels: any[]
}

export default function StudentsManager({ students, groups, levels }: StudentsManagerProps) {
  const supabase = createClient()
  const router = useRouter()

  const [editModal, setEditModal] = useState(false)
  const [groupModal, setGroupModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '', cefr_level: '' })
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [assignedGroupIds, setAssignedGroupIds] = useState<string[]>([])

  function openEdit(s: any) {
    setForm({ full_name: s.full_name ?? '', phone: s.phone ?? '', cefr_level: s.cefr_level ?? '' })
    setEditId(s.id)
    setEditModal(true)
  }

  async function openGroups(s: any) {
    setSelectedStudent(s)
    const { data } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', s.id)
    setAssignedGroupIds((data ?? []).map((r: any) => r.group_id))
    setGroupModal(true)
  }

  function toggleGroup(gid: string) {
    setAssignedGroupIds(prev =>
      prev.includes(gid) ? prev.filter(id => id !== gid) : [...prev, gid]
    )
  }

  async function saveGroupAssignments() {
    if (!selectedStudent) return
    setSaving(true)
    const uid = selectedStudent.id

    await supabase.from('group_members').delete().eq('user_id', uid)
    if (assignedGroupIds.length > 0) {
      await supabase.from('group_members').insert(
        assignedGroupIds.map(gid => ({ group_id: gid, user_id: uid })) as never[]
      )
    }
    setSaving(false)
    setGroupModal(false)
    router.refresh()
  }

  async function handleSave() {
    if (!editId) return
    setSaving(true)
    await supabase.from('users').update({
      full_name: form.full_name,
      phone: form.phone || null,
      cefr_level: form.cefr_level || null,
    } as never).eq('id', editId)
    setSaving(false)
    setEditModal(false)
    router.refresh()
  }

  async function handleToggleActive(s: any) {
    const newStatus = s.is_active === false ? true : false
    await supabase.from('users').update({ is_active: newStatus } as never).eq('id', s.id)
    router.refresh()
  }

  return (
    <>
      {students.map((s: any, i: number) => {
        const isActive = s.is_active !== false
        const enrollCount = s.enrollments?.[0]?.count ?? 0
        const groupCount = s.group_members?.[0]?.count ?? 0
        const joinedDate = s.created_at
          ? new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          : '—'

        return (
          <div
            key={s.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 0.8fr 0.7fr 0.7fr 0.8fr 0.7fr 1.2fr',
              padding: '14px 24px',
              borderBottom: i < students.length - 1 ? '1px solid rgba(245,240,232,0.04)' : 'none',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,240,232,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#D8D2C0' }}>{s.full_name ?? '—'}</span>
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email ?? '—'}</span>
            <span>
              {s.cefr_level ? (
                <span style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '4px', backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: gold }}>{s.cefr_level}</span>
              ) : <span style={{ fontFamily: sans, fontSize: '0.76rem', color: '#3E3A36' }}>—</span>}
            </span>
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>{groupCount}</span>
            <span style={{ fontFamily: sans, fontSize: '0.82rem', color: '#8A8278' }}>{enrollCount}</span>
            <span>
              <span style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '4px', backgroundColor: isActive ? 'rgba(201,168,76,0.1)' : 'rgba(245,240,232,0.05)', border: `1px solid ${isActive ? 'rgba(201,168,76,0.3)' : 'rgba(245,240,232,0.1)'}`, color: isActive ? gold : '#6A6560' }}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </span>
            <span style={{ fontFamily: sans, fontSize: '0.76rem', color: '#5E5A54' }}>{joinedDate}</span>
            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
              <button onClick={() => openGroups(s)} title="Assign Groups" style={{ background: 'transparent', border: '1px solid rgba(245,240,232,0.08)', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#8A8278', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: sans, fontSize: '0.62rem' }}
                onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.borderColor = `${gold}50` }}
                onMouseLeave={e => { e.currentTarget.style.color = '#8A8278'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87"/></svg>
                Groups
              </button>
              <button onClick={() => openEdit(s)} style={{ background: 'transparent', border: '1px solid rgba(245,240,232,0.08)', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#8A8278', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.borderColor = `${gold}50` }}
                onMouseLeave={e => { e.currentTarget.style.color = '#8A8278'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button onClick={() => handleToggleActive(s)} title={isActive ? 'Deactivate' : 'Activate'} style={{ background: 'transparent', border: '1px solid rgba(245,240,232,0.08)', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: isActive ? '#22C55E' : '#8A8278', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = isActive ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)'}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {isActive ? <><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></> : <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}
                </svg>
              </button>
            </div>
          </div>
        )
      })}

      {students.length === 0 && (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: sans, fontSize: '0.85rem', color: '#5E5A54' }}>No students registered yet.</p>
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Student" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="+20..." />
          </div>
          <div>
            <label style={labelStyle}>CEFR Level</label>
            <select value={form.cefr_level} onChange={e => setForm({ ...form, cefr_level: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">No level</option>
              {levels.map((l: any) => <option key={l.id} value={l.slug}>{l.name}</option>)}
              <option value="A1">A1</option><option value="A2">A2</option>
              <option value="B1">B1</option><option value="B2">B2</option>
              <option value="C1">C1</option><option value="C2">C2</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
            <button onClick={() => setEditModal(false)} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(245,240,232,0.07)', background: 'transparent', color: '#6B6560', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.full_name.trim()} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 26px', borderRadius: '10px', border: 'none', background: !form.full_name.trim() ? 'rgba(201,168,76,0.15)' : 'linear-gradient(135deg, #b8963f, #d4af5a)', color: !form.full_name.trim() ? '#6B6560' : '#0d0f14', cursor: !form.full_name.trim() ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign Groups Modal */}
      <Modal open={groupModal} onClose={() => setGroupModal(false)} title={`Assign Groups — ${selectedStudent?.full_name ?? ''}`} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.75rem', color: '#8A8278', margin: '0 0 12px' }}>
            Select groups for this student:
          </p>
          {groups.map((g: any) => {
            const checked = assignedGroupIds.includes(g.id)
            return (
              <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', background: checked ? 'rgba(201,168,76,0.06)' : 'rgba(0,0,0,0.1)', border: `1px solid ${checked ? 'rgba(201,168,76,0.2)' : 'rgba(245,240,232,0.05)'}`, transition: 'all 0.2s' }}>
                <input type="checkbox" checked={checked} onChange={() => toggleGroup(g.id)} style={{ accentColor: gold, width: '16px', height: '16px' }} />
                <div>
                  <span style={{ fontFamily: sans, fontSize: '0.82rem', color: checked ? '#F5F0E8' : '#8A8278', fontWeight: 500 }}>{g.name}</span>
                  {g.courses?.title && <span style={{ fontFamily: sans, fontSize: '0.65rem', color: '#5E5A54', marginLeft: '8px' }}>{g.courses.title}</span>}
                </div>
              </label>
            )
          })}
          {groups.length === 0 && <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54', textAlign: 'center', padding: '20px' }}>No groups available.</p>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
            <button onClick={() => setGroupModal(false)} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: '10px', border: '1px solid rgba(245,240,232,0.07)', background: 'transparent', color: '#6B6560', cursor: 'pointer' }}>Cancel</button>
            <button onClick={saveGroupAssignments} disabled={saving} style={{ fontFamily: sans, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 26px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #b8963f, #d4af5a)', color: '#0d0f14', cursor: 'pointer' }}>
              {saving ? 'Saving...' : `Save (${assignedGroupIds.length} selected)`}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
