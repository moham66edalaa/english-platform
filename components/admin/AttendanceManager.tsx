'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const serif = "'Cormorant Garamond', serif"
const sans = "'Raleway', sans-serif"
const gold = '#C9A84C'

const statusConfig: Record<string, { bg: string; border: string; text: string; label: string }> = {
  present: { bg: 'rgba(76,201,168,0.15)', border: 'rgba(76,201,168,0.4)', text: '#4CC9A8', label: 'Present' },
  absent:  { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  text: '#ef4444', label: 'Absent' },
  late:    { bg: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.4)',  text: '#eab308', label: 'Late' },
  excused: { bg: 'rgba(76,168,201,0.15)',  border: 'rgba(76,168,201,0.4)', text: '#4CA8C9', label: 'Excused' },
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  backgroundColor: '#1a1e28',
  border: '1px solid rgba(245,240,232,0.1)',
  borderRadius: '8px',
  color: '#EAE4D2',
  fontSize: '0.88rem',
  fontFamily: sans,
  outline: 'none',
}

export default function AttendanceManager({
  groups,
  groupMembers,
}: {
  groups: any[]
  groupMembers: Record<string, any[]>
}) {
  const router = useRouter()
  const [selectedGroup, setSelectedGroup] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [statuses, setStatuses] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const members = selectedGroup ? (groupMembers[selectedGroup] ?? []) : []

  function setStatus(userId: string, status: string) {
    setStatuses((prev) => ({ ...prev, [userId]: status }))
  }

  function markAllPresent() {
    const next: Record<string, string> = {}
    for (const m of members) {
      next[m.user_id] = 'present'
    }
    setStatuses((prev) => ({ ...prev, ...next }))
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const members = groupMembers[selectedGroup] ?? []

    for (const m of members) {
      const status = statuses[m.user_id] || 'present'
      await supabase.from('attendance').upsert(
        {
          group_id: selectedGroup,
          user_id: m.user_id,
          session_date: date,
          status,
        } as never,
        { onConflict: 'group_id,user_id,session_date' }
      )
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top controls */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Group selector */}
        <select
          value={selectedGroup}
          onChange={(e) => {
            setSelectedGroup(e.target.value)
            setStatuses({})
          }}
          style={{
            ...inputStyle,
            flex: '1 1 200px',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23EAE4D2' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '36px',
          }}
        >
          <option value="">Select a group...</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Date picker */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            ...inputStyle,
            flex: '0 0 180px',
            cursor: 'pointer',
            colorScheme: 'dark',
          }}
        />

        {/* Mark All Present */}
        <button
          onClick={markAllPresent}
          disabled={!selectedGroup}
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(76,201,168,0.12)',
            border: '1px solid rgba(76,201,168,0.3)',
            borderRadius: '8px',
            color: '#4CC9A8',
            fontSize: '0.85rem',
            fontFamily: sans,
            fontWeight: 600,
            cursor: selectedGroup ? 'pointer' : 'not-allowed',
            opacity: selectedGroup ? 1 : 0.4,
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          Mark All Present
        </button>
      </div>

      {/* Student grid or empty state */}
      {!selectedGroup ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            color: 'rgba(234,228,210,0.4)',
            fontFamily: serif,
            fontSize: '1.1rem',
            fontStyle: 'italic',
          }}
        >
          Select a group to mark attendance
        </div>
      ) : members.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            color: 'rgba(234,228,210,0.4)',
            fontFamily: serif,
            fontSize: '1.1rem',
            fontStyle: 'italic',
          }}
        >
          No students in this group
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {members.map((m) => {
            const currentStatus = statuses[m.user_id] || ''
            return (
              <div
                key={m.user_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  backgroundColor: 'rgba(245,240,232,0.03)',
                  border: '1px solid rgba(245,240,232,0.06)',
                  borderRadius: '10px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(201,168,76,0.15)',
                    border: `1px solid rgba(201,168,76,0.3)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: gold,
                    fontSize: '0.8rem',
                    fontFamily: serif,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(m.full_name || 'U')}
                </div>

                {/* Name + email */}
                <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                  <div
                    style={{
                      color: '#EAE4D2',
                      fontSize: '0.92rem',
                      fontFamily: serif,
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.full_name || 'Unknown'}
                  </div>
                  <div
                    style={{
                      color: 'rgba(234,228,210,0.4)',
                      fontSize: '0.78rem',
                      fontFamily: sans,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.email}
                  </div>
                </div>

                {/* Status buttons */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {Object.entries(statusConfig).map(([key, cfg]) => {
                    const active = currentStatus === key
                    return (
                      <button
                        key={key}
                        onClick={() => setStatus(m.user_id, key)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          border: `1px solid ${active ? cfg.border : 'rgba(245,240,232,0.08)'}`,
                          backgroundColor: active ? cfg.bg : 'transparent',
                          color: active ? cfg.text : 'rgba(234,228,210,0.35)',
                          fontSize: '0.75rem',
                          fontFamily: sans,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Save button */}
      {selectedGroup && members.length > 0 && (
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: saving ? 'rgba(201,168,76,0.3)' : gold,
            border: 'none',
            borderRadius: '10px',
            color: saving ? 'rgba(234,228,210,0.5)' : '#0a0c10',
            fontSize: '0.95rem',
            fontFamily: serif,
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.03em',
          }}
        >
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      )}

      {/* Success message */}
      {saved && (
        <div
          style={{
            textAlign: 'center',
            padding: '12px',
            backgroundColor: 'rgba(76,201,168,0.1)',
            border: '1px solid rgba(76,201,168,0.25)',
            borderRadius: '8px',
            color: '#4CC9A8',
            fontSize: '0.88rem',
            fontFamily: sans,
            fontWeight: 600,
          }}
        >
          Attendance saved successfully
        </div>
      )}
    </div>
  )
}
