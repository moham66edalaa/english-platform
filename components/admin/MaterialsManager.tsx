'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'

const serif = "'Cormorant Garamond', serif"
const sans = "'Raleway', sans-serif"

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  backgroundColor: 'rgba(0,0,0,0.2)',
  border: '1px solid rgba(245,240,232,0.07)',
  borderRadius: '10px',
  color: '#F5F0E8',
  fontSize: '0.85rem',
  fontFamily: sans,
  outline: 'none',
  transition: 'border-color 0.25s, background 0.25s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: sans,
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(201,168,76,0.5)',
  marginBottom: '8px',
}

const typeBadgeColors: Record<string, string> = {
  pdf: 'rgba(201,168,76,0.15)',
  video: 'rgba(76,168,201,0.15)',
  worksheet: 'rgba(76,201,168,0.15)',
  vocabulary: 'rgba(168,76,201,0.15)',
}

const typeTextColors: Record<string, string> = {
  pdf: 'rgba(201,168,76,1)',
  video: 'rgba(76,168,201,1)',
  worksheet: 'rgba(76,201,168,1)',
  vocabulary: 'rgba(168,76,201,1)',
}

const accentColor = '#4CA8C9'

interface MaterialsManagerProps {
  materials: any[]
  teacherId: string
  courses: any[]
}

export default function MaterialsManager({ materials, teacherId, courses }: MaterialsManagerProps) {
  const supabase = createClient()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'pdf', file_url: '', course_id: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const materialToDelete = materials.find((m) => m.id === deleteId)

  const acceptedTypes: Record<string, string> = {
    pdf: '.pdf',
    video: '.mp4,.webm,.mov,.avi',
    worksheet: '.pdf,.doc,.docx,.xlsx,.pptx',
    vocabulary: '.pdf,.doc,.docx,.xlsx,.csv,.txt',
  }

  async function uploadFile(file: File) {
    setUploading(true)
    setUploadProgress(0)
    setUploadedFileName(file.name)

    const fileExt = file.name.split('.').pop()
    const fileName = `${teacherId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    // Simulate progress (Supabase JS doesn't expose upload progress natively)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 15, 90))
    }, 200)

    const { data, error } = await supabase.storage
      .from('materials')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    clearInterval(progressInterval)

    if (error) {
      alert('Upload failed: ' + error.message)
      setUploading(false)
      setUploadProgress(0)
      setUploadedFileName('')
      return
    }

    const { data: urlData } = supabase.storage.from('materials').getPublicUrl(data.path)
    setForm((prev) => ({ ...prev, file_url: urlData.publicUrl }))
    setUploadProgress(100)
    setUploading(false)
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  function openAdd() {
    setForm({ title: '', type: 'pdf', file_url: '', course_id: '' })
    setEditId(null)
    setUploadedFileName('')
    setUploadProgress(0)
    setModalOpen(true)
  }

  function openEdit(material: any) {
    setForm({
      title: material.title ?? '',
      type: material.type ?? 'pdf',
      file_url: material.file_url ?? '',
      course_id: material.course_id ?? '',
    })
    setEditId(material.id)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditId(null)
  }

  async function handleSave() {
    setSaving(true)
    const payload: any = {
      title: form.title,
      type: form.type,
      file_url: form.file_url,
      course_id: form.course_id || null,
    }

    if (editId) {
      await supabase.from('materials').update(payload as never).eq('id', editId)
    } else {
      payload.teacher_id = teacherId
      await supabase.from('materials').insert(payload as never)
    }

    setSaving(false)
    closeModal()
    router.refresh()
  }

  async function handleDelete() {
    if (!deleteId) return
    setSaving(true)

    // Try to delete file from storage if it's a Supabase URL
    const mat = materials.find((m) => m.id === deleteId)
    if (mat?.file_url?.includes('/storage/v1/object/public/materials/')) {
      const path = mat.file_url.split('/storage/v1/object/public/materials/')[1]
      if (path) await supabase.storage.from('materials').remove([decodeURIComponent(path)])
    }

    await supabase.from('materials').delete().eq('id', deleteId)
    setSaving(false)
    setDeleteId(null)
    router.refresh()
  }

  return (
    <>
      {/* Add Material button */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={openAdd}
          style={{
            fontFamily: sans,
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '10px 22px',
            borderRadius: '8px',
            border: `1px solid ${accentColor}`,
            background: 'transparent',
            color: accentColor,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${accentColor}15`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          + Add Material
        </button>
      </div>

      {/* Header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1.5fr 1fr 0.8fr',
          gap: '12px',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(245,240,232,0.06)',
        }}
      >
        {['Title', 'Type', 'Course', 'Created', 'Actions'].map((h) => (
          <span
            key={h}
            style={{
              fontFamily: sans,
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#8A8278',
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Material rows */}
      {materials.map((mat) => {
        const course = courses.find((c: any) => c.id === mat.course_id)
        return (
          <div
            key={mat.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1.5fr 1fr 0.8fr',
              gap: '12px',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(245,240,232,0.04)',
              alignItems: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245,240,232,0.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Title */}
            <span style={{ fontFamily: serif, fontSize: '1rem', fontWeight: 600, color: '#F5F0E8' }}>
              {mat.title}
            </span>

            {/* Type badge */}
            <span>
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: sans,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: typeBadgeColors[mat.type] ?? 'rgba(138,130,120,0.15)',
                  color: typeTextColors[mat.type] ?? '#8A8278',
                }}
              >
                {mat.type}
              </span>
            </span>

            {/* Course */}
            <span style={{ fontFamily: sans, fontSize: '0.85rem', color: '#C2B9A7' }}>
              {course?.title ?? '—'}
            </span>

            {/* Created */}
            <span style={{ fontFamily: sans, fontSize: '0.8rem', color: '#8A8278' }}>
              {mat.created_at ? new Date(mat.created_at).toLocaleDateString() : '—'}
            </span>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
              {/* Edit */}
              <button
                onClick={() => openEdit(mat)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(245,240,232,0.08)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  color: '#8A8278',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = accentColor
                  e.currentTarget.style.borderColor = `${accentColor}50`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8A8278'
                  e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)'
                }}
                aria-label={`Edit ${mat.title}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>

              {/* Delete */}
              <button
                onClick={() => setDeleteId(mat.id)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(245,240,232,0.08)',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  color: '#8A8278',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444'
                  e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
                  e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#8A8278'
                  e.currentTarget.style.borderColor = 'rgba(245,240,232,0.08)'
                  e.currentTarget.style.background = 'transparent'
                }}
                aria-label={`Delete ${mat.title}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        )
      })}

      {/* Empty state */}
      {materials.length === 0 && (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            fontFamily: sans,
            fontSize: '0.85rem',
            color: '#8A8278',
          }}
        >
          No materials yet. Click &ldquo;Add Material&rdquo; to create one.
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal} title={editId ? 'Edit Material' : 'Add Material'} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyle}
              placeholder="Material title"
            />
          </div>

          {/* Type */}
          <div>
            <label style={labelStyle}>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="worksheet">Worksheet</option>
              <option value="vocabulary">Vocabulary</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label style={labelStyle}>Upload File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes[form.type] || '*'}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                border: `1.5px dashed ${dragOver ? 'rgba(201,168,76,0.4)' : 'rgba(245,240,232,0.06)'}`,
                borderRadius: '12px',
                padding: '22px 16px',
                textAlign: 'center',
                cursor: uploading ? 'default' : 'pointer',
                background: dragOver
                  ? 'rgba(201,168,76,0.03)'
                  : 'rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
              }}
            >
              {uploading ? (
                <div style={{ padding: '8px 0' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'rgba(76,168,201,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: sans, fontSize: '0.8rem', color: '#C2B9A7', margin: '0 0 14px', fontWeight: 500 }}>
                    Uploading {uploadedFileName}
                  </p>
                  <div style={{
                    width: '80%', height: '4px', borderRadius: '4px',
                    background: 'rgba(245,240,232,0.06)', overflow: 'hidden',
                    margin: '0 auto',
                  }}>
                    <div style={{
                      width: `${uploadProgress}%`, height: '100%', borderRadius: '4px',
                      background: `linear-gradient(90deg, ${accentColor}, #c9a84c)`,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <p style={{ fontFamily: sans, fontSize: '0.68rem', color: '#8A8278', margin: '8px 0 0' }}>
                    {uploadProgress}%
                  </p>
                </div>
              ) : uploadedFileName && form.file_url ? (
                <div style={{ padding: '8px 0' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'rgba(34,197,94,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#22C55E', margin: '0 0 4px', fontWeight: 600 }}>
                    {uploadedFileName}
                  </p>
                  <p style={{ fontFamily: sans, fontSize: '0.68rem', color: '#8A8278', margin: 0 }}>
                    Click to replace file
                  </p>
                </div>
              ) : (
                <div style={{ padding: '6px 0' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'rgba(201,168,76,0.06)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: sans, fontSize: '0.8rem', color: '#C2B9A7', margin: '0 0 4px', fontWeight: 500 }}>
                    Drag & drop your file here
                  </p>
                  <p style={{ fontFamily: sans, fontSize: '0.68rem', color: '#6B6560', margin: '0 0 10px' }}>
                    or <span style={{ color: 'rgba(201,168,76,0.7)', cursor: 'pointer' }}>browse files</span>
                  </p>
                  <span style={{
                    fontFamily: sans, fontSize: '0.58rem', fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#6B6560', background: 'rgba(245,240,232,0.03)',
                    padding: '3px 10px', borderRadius: '6px',
                  }}>
                    {acceptedTypes[form.type]?.replace(/\./g, '').replace(/,/g, ', ').toUpperCase() || 'Any file'}
                  </span>
                </div>
              )}
            </div>

            {/* OR manual URL */}
            <details style={{ marginTop: '12px' }}>
              <summary style={{
                fontFamily: sans, fontSize: '0.68rem', color: '#8A8278',
                cursor: 'pointer', letterSpacing: '0.04em',
                padding: '4px 0',
              }}>
                Or paste a URL manually
              </summary>
              <input
                type="text"
                value={form.file_url}
                onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                style={{ ...inputStyle, marginTop: '10px' }}
                placeholder="https://..."
              />
            </details>
          </div>

          {/* Course */}
          <div>
            <label style={labelStyle}>Course</label>
            <select
              value={form.course_id}
              onChange={(e) => setForm({ ...form, course_id: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="" disabled>Select a course</option>
              {courses.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex', gap: '10px', justifyContent: 'flex-end',
            marginTop: '20px', paddingTop: '18px',
            borderTop: '1px solid rgba(245,240,232,0.05)',
          }}>
            <button
              onClick={closeModal}
              style={{
                fontFamily: sans,
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '10px 22px',
                borderRadius: '10px',
                border: '1px solid rgba(245,240,232,0.07)',
                background: 'transparent',
                color: '#6B6560',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245,240,232,0.15)'
                e.currentTarget.style.color = '#C2B9A7'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245,240,232,0.07)'
                e.currentTarget.style.color = '#6B6560'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.title.trim() || !form.course_id}
              style={{
                fontFamily: sans,
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '10px 26px',
                borderRadius: '10px',
                border: 'none',
                background: saving || !form.title.trim() || !form.course_id
                  ? 'rgba(201,168,76,0.15)'
                  : 'linear-gradient(135deg, #b8963f, #d4af5a)',
                color: saving || !form.title.trim() || !form.course_id ? '#6B6560' : '#0d0f14',
                cursor: saving || !form.title.trim() || !form.course_id ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s',
                boxShadow: saving || !form.title.trim() || !form.course_id ? 'none' : '0 2px 12px rgba(201,168,76,0.15)',
              }}
            >
              {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Material" size="sm">
        <p
          style={{
            fontFamily: sans,
            fontSize: '0.88rem',
            color: '#C2B9A7',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          Delete &lsquo;{materialToDelete?.title}&rsquo;? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setDeleteId(null)}
            style={{
              fontFamily: sans,
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(245,240,232,0.12)',
              background: 'transparent',
              color: '#C2B9A7',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={saving}
            style={{
              fontFamily: sans,
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#EF4444',
              color: '#fff',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {saving ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </>
  )
}
