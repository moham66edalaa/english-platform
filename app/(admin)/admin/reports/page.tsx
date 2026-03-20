import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reports — Admin Panel | Eloquence',
}

export default async function OwnerReportsPage() {
  const supabase = await createClient()

  const [
    { count: studentCount },
    { count: teacherCount },
    { count: groupCount },
    { count: courseCount },
    { count: enrollmentCount },
    { data: attendanceData },
    { data: groups },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('groups').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('attendance').select('status'),
    supabase.from('groups').select('*, users!groups_teacher_id_fkey(full_name), group_members(count)').eq('is_active', true).limit(10),
  ])

  const totalAttendance = attendanceData?.length ?? 0
  const presentCount = attendanceData?.filter((a: any) => a.status === 'present').length ?? 0
  const attendanceRate = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(1) : '—'

  const stats = [
    { label: 'Total Students', value: studentCount ?? 0 },
    { label: 'Total Teachers', value: teacherCount ?? 0 },
    { label: 'Total Groups', value: groupCount ?? 0 },
    { label: 'Active Courses', value: courseCount ?? 0 },
    { label: 'Total Enrollments', value: enrollmentCount ?? 0 },
    { label: 'Attendance Rate', value: `${attendanceRate}%` },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111110', color: '#EAE4D2', padding: '48px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>
          Admin Panel
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: '#EAE4D2', margin: '0 0 40px' }}>
          Reports
        </h1>

        {/* Overview Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 56 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, padding: '28px 28px 24px' }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: '#8A8278', margin: '0 0 8px' }}>{stat.label}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: '#C9A84C', margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Student Progress */}
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: '#EAE4D2', margin: '0 0 20px' }}>
          Student Progress
        </h2>
        <div style={{ border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 56 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Student</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Email</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Enrollments</p>
          </div>

          {await (async () => {
            const { data: topStudents } = await supabase
              .from('users')
              .select('id, full_name, email, enrollments(count)')
              .eq('role', 'student')
              .order('created_at', { ascending: false })
              .limit(10)

            const sorted = (topStudents ?? []).sort((a: any, b: any) => {
              const aCount = a.enrollments?.[0]?.count ?? 0
              const bCount = b.enrollments?.[0]?.count ?? 0
              return bCount - aCount
            })

            if (sorted.length === 0) {
              return (
                <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#5E5A54', margin: 0 }}>No students found.</p>
                </div>
              )
            }

            return sorted.map((student: any) => (
              <div key={student.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.04)', alignItems: 'center' }}>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#EAE4D2', margin: 0 }}>{student.full_name ?? '—'}</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, color: '#5E5A54', margin: 0 }}>{student.email}</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#C9A84C', margin: 0 }}>{student.enrollments?.[0]?.count ?? 0}</p>
              </div>
            ))
          })()}
        </div>

        {/* Group Overview */}
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: '#EAE4D2', margin: '0 0 20px' }}>
          Group Overview
        </h2>
        <div style={{ border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Group Name</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Teacher</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Members</p>
          </div>

          {groups?.map((group: any) => (
            <div key={group.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.04)', alignItems: 'center' }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#EAE4D2', margin: 0 }}>{group.name}</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, color: '#8A8278', margin: 0 }}>{group.users?.full_name ?? '—'}</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#C9A84C', margin: 0 }}>{group.group_members?.[0]?.count ?? 0}</p>
            </div>
          ))}

          {(!groups || groups.length === 0) && (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#5E5A54', margin: 0 }}>No active groups found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
