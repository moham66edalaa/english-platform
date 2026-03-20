'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'

const serif = "'Cormorant Garamond', serif"
const sans = "'Raleway', sans-serif"

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

interface ProfileEditorProps {
  profile: any
  accentColor?: string
}

export default function ProfileEditor({ profile, accentColor = '#4CA8C9' }: ProfileEditorProps) {
  const supabase = createClient()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    phone: profile.phone ?? '',
    bio: profile.bio ?? '',
  })

  // Fade out success message after 3 seconds
  useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(false), 3000)
    return () => clearTimeout(timer)
  }, [saved])

  function handleCancel() {
    setForm({
      full_name: profile.full_name ?? '',
      phone: profile.phone ?? '',
      bio: profile.bio ?? '',
    })
    setEditing(false)
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      full_name: form.full_name,
      phone: form.phone,
      bio: form.bio,
    }
    await supabase.from('users').update(payload as never).eq('id', profile.id)
    setSaving(false)
    setEditing(false)
    setSaved(true)
    router.refresh()
  }

  const initials = (profile.full_name ?? profile.email ?? '?')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  return (
    <div
      style={{
        background: 'rgba(245,240,232,0.02)',
        border: '1px solid rgba(245,240,232,0.06)',
        borderRadius: '16px',
        padding: '32px',
      }}
    >
      {/* Top section: Avatar + Name + Email */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
        {/* Avatar */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: serif,
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontFamily: serif,
              fontSize: '1.3rem',
              fontWeight: 600,
              color: '#F5F0E8',
              margin: 0,
            }}
          >
            {profile.full_name ?? 'No name set'}
          </h3>
          <p
            style={{
              fontFamily: sans,
              fontSize: '0.82rem',
              color: '#8A8278',
              margin: '4px 0 0 0',
            }}
          >
            {profile.email}
          </p>
        </div>

        {/* Edit / Save+Cancel buttons */}
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
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
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                style={{
                  fontFamily: sans,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
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
                onClick={handleSave}
                disabled={saving}
                style={{
                  fontFamily: sans,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: 'none',
                  background: accentColor,
                  color: '#fff',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Success message */}
      {saved && (
        <div
          style={{
            fontFamily: sans,
            fontSize: '0.82rem',
            color: '#4CAF50',
            marginBottom: '16px',
            padding: '10px 16px',
            background: 'rgba(76,175,80,0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(76,175,80,0.2)',
            transition: 'opacity 0.3s',
          }}
        >
          Profile updated successfully.
        </div>
      )}

      {/* Info grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}
      >
        {/* Full Name */}
        <div>
          <label style={labelStyle}>Full Name</label>
          {editing ? (
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              style={inputStyle}
              placeholder="Your full name"
            />
          ) : (
            <p
              style={{
                fontFamily: sans,
                fontSize: '0.9rem',
                color: '#EAE4D2',
                margin: 0,
              }}
            >
              {profile.full_name || '—'}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}>Phone</label>
          {editing ? (
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
              placeholder="Phone number"
            />
          ) : (
            <p
              style={{
                fontFamily: sans,
                fontSize: '0.9rem',
                color: '#EAE4D2',
                margin: 0,
              }}
            >
              {profile.phone || '—'}
            </p>
          )}
        </div>

        {/* Member Since (not editable) */}
        <div>
          <label style={labelStyle}>Member Since</label>
          <p
            style={{
              fontFamily: sans,
              fontSize: '0.9rem',
              color: '#EAE4D2',
              margin: 0,
            }}
          >
            {memberSince}
          </p>
        </div>

        {/* Bio (spans full width) */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Bio</label>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              style={{
                ...inputStyle,
                minHeight: '80px',
                resize: 'vertical',
              }}
              placeholder="A short bio..."
            />
          ) : (
            <p
              style={{
                fontFamily: sans,
                fontSize: '0.9rem',
                color: '#EAE4D2',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {profile.bio || '—'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
