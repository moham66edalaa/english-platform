// app/(teacher)/teacher/profile/page.tsx

import { createClient } from '@/lib/supabase/server'
import { requireTeacher } from '@/lib/auth/helpers'
import ProfileEditor from '@/components/admin/ProfileEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile — Teacher Panel | Eloquence',
}

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

export default async function TeacherProfilePage() {
  const user = await requireTeacher()
  const supabase = await createClient()

  const { data: profileData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  const profile = profileData as any

  const { data: groups } = await supabase
    .from('groups')
    .select('*, group_members(count)')
    .eq('teacher_id', user.id)
    .eq('is_active', true)

  const { data: courses } = await supabase
    .from('teacher_courses')
    .select('*, courses(title, slug, is_published)')
    .eq('teacher_id', user.id)

  const groupList = (groups ?? []) as any[]
  const courseList = (courses ?? []) as any[]

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <span style={{ fontFamily: sans, fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#2a7a9e' }}>
          Teacher Panel
        </span>
        <h1 style={{ fontFamily: serif, fontSize: '36px', fontWeight: 600, color: '#EAE4D2', margin: '8px 0 0' }}>
          My Profile
        </h1>
      </div>

      {/* Profile Editor */}
      <ProfileEditor profile={profile} accentColor={blue} />

      {/* My Groups */}
      <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 600, color: '#EAE4D2', margin: '0 0 20px' }}>
          My Groups
        </h3>
        {groupList.length === 0 ? (
          <p style={{ fontFamily: sans, fontSize: '14px', color: '#8A8278', margin: 0 }}>No groups assigned yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {groupList.map((group: any) => (
              <div key={group.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '10px', backgroundColor: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.05)' }}>
                <span style={{ fontFamily: sans, fontSize: '14px', fontWeight: 500, color: '#EAE4D2' }}>{group.name}</span>
                <span style={{ fontFamily: sans, fontSize: '12px', color: '#8A8278' }}>{group.group_members?.[0]?.count ?? 0} members</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Courses */}
      <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', padding: '28px' }}>
        <h3 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 600, color: '#EAE4D2', margin: '0 0 20px' }}>
          My Courses
        </h3>
        {courseList.length === 0 ? (
          <p style={{ fontFamily: sans, fontSize: '14px', color: '#8A8278', margin: 0 }}>No courses assigned yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {courseList.map((tc: any) => (
              <div key={tc.course_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '10px', backgroundColor: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.05)' }}>
                <span style={{ fontFamily: sans, fontSize: '14px', fontWeight: 500, color: '#EAE4D2' }}>{tc.courses?.title ?? 'Untitled Course'}</span>
                <span style={{ fontFamily: sans, fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', backgroundColor: tc.courses?.is_published ? 'rgba(76,168,201,0.12)' : 'rgba(138,130,120,0.15)', color: tc.courses?.is_published ? blue : '#8A8278', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                  {tc.courses?.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
