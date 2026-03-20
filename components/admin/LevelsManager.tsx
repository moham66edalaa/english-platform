'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'

const serif = "'Cormorant Garamond', serif"
const sans = "'Raleway', sans-serif"
const gold = '#C9A84C'

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  backgroundColor: '#1a1e28',
  border: '1px solid rgba(245,240,232,0.1)',
  borderRadius: '8px',
  color: '#EAE4D2',
  fontSize: '0.88rem',
  fontFamily: sans,
  outline: 'none',
}

const labelStyle = {
  display: 'block' as const,
  fontFamily: sans,
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: '#8A8278',
  marginBottom: '8px',
}

interface LevelsManagerProps {
  levels: any[]
  studentCounts: Record<string, number>
  courseCounts: Record<string, number>
}

export default function LevelsManager({ levels, studentCounts, courseCounts }: LevelsManagerProps) {
  const router = useRouter()
  const supabase = createClient()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '', sort_order: 0, is_active: true })

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  function openAdd() {
    setEditId(null)
    setForm({ name: '', slug: '', description: '', sort_order: 0, is_active: true })
    setModalOpen(true)
  }

  function openEdit(level: any) {
    setEditId(level.id)
    setForm({
      name: level.name ?? '',
      slug: level.slug ?? '',
      description: level.description ?? '',
      sort_order: level.sort_order ?? 0,
      is_active: level.is_active ?? true,
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditId(null)
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      sort_order: form.sort_order,
      is_active: form.is_active,
    }

    if (editId) {
      await supabase.from('levels').update(payload as never).eq('id', editId)
    } else {
      await supabase.from('levels').insert(payload as never)
    }

    setSaving(false)
    router.refresh()
    closeModal()
  }

  async function handleDelete() {
    if (!deleteId) return
    await supabase.from('levels').delete().eq('id', deleteId)
    setDeleteId(null)
    router.refresh()
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: serif, fontSize: '1.4rem', fontWeight: 600, color: '#EAE4D2' }}>
          Levels
        </h2>
        <button
          onClick={openAdd}
          style={{
            padding: '8px 20px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '6px',
            color: gold,
            fontSize: '0.72rem',
            fontFamily: sans,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          + Add Level
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          border: '1px solid rgba(245,240,232,0.08)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
            padding: '12px 20px',
            backgroundColor: 'rgba(245,240,232,0.03)',
            borderBottom: '1px solid rgba(245,240,232,0.08)',
          }}
        >
          {['Name', 'Students', 'Courses', 'Status', 'Order', 'Actions'].map((h) => (
            <span
              key={h}
              style={{
                fontFamily: sans,
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8A8278',
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Table Rows */}
        {levels.map((level) => (
          <div
            key={level.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(245,240,232,0.05)',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: sans, fontSize: '0.88rem', color: '#EAE4D2' }}>
              {level.name}
            </span>
            <span style={{ fontFamily: sans, fontSize: '0.85rem', color: '#B8B0A4' }}>
              {studentCounts[level.id] ?? 0}
            </span>
            <span style={{ fontFamily: sans, fontSize: '0.85rem', color: '#B8B0A4' }}>
              {courseCounts[level.id] ?? 0}
            </span>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontFamily: sans,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  backgroundColor: level.is_active ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                  color: level.is_active ? '#4ADE80' : '#F87171',
                }}
              >
                {level.is_active ? 'Active' : 'Inactive'}
              </span>
            </span>
            <span style={{ fontFamily: sans, fontSize: '0.85rem', color: '#B8B0A4' }}>
              {level.sort_order}
            </span>
            <span style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => openEdit(level)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: sans,
                  fontSize: '0.78rem',
                  color: '#8A8278',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8278')}
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteId(level.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: sans,
                  fontSize: '0.78rem',
                  color: '#8A8278',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F87171')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8278')}
              >
                Delete
              </button>
            </span>
          </div>
        ))}

        {levels.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8A8278', fontFamily: sans, fontSize: '0.85rem' }}>
            No levels found. Click &quot;Add Level&quot; to create one.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal} title={editId ? 'Edit Level' : 'Add Level'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value
                setForm((f) => ({
                  ...f,
                  name,
                  slug: editId ? f.slug : generateSlug(name),
                }))
              }}
              style={inputStyle}
              placeholder="e.g. Beginner"
            />
          </div>

          {/* Slug */}
          <div>
            <label style={labelStyle}>Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              style={inputStyle}
              placeholder="e.g. beginner"
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Brief description of this level"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label style={labelStyle}>Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
              style={inputStyle}
            />
          </div>

          {/* Active */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              style={{ accentColor: gold, width: '16px', height: '16px' }}
            />
            <label style={{ fontFamily: sans, fontSize: '0.82rem', color: '#EAE4D2' }}>Active</label>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: gold,
              border: 'none',
              borderRadius: '8px',
              color: '#0D0F14',
              fontSize: '0.78rem',
              fontFamily: sans,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
              transition: 'opacity 0.2s',
              marginTop: '6px',
            }}
          >
            {saving ? 'Saving...' : editId ? 'Update Level' : 'Create Level'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Level" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#B8B0A4', lineHeight: 1.6 }}>
            Are you sure you want to delete this level?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setDeleteId(null)}
              style={{
                padding: '8px 20px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(245,240,232,0.15)',
                borderRadius: '6px',
                color: '#B8B0A4',
                fontSize: '0.78rem',
                fontFamily: sans,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: '8px 20px',
                backgroundColor: '#DC2626',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.78rem',
                fontFamily: sans,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
