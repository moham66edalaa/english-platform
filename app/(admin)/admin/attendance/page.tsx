// app/(owner)/admin/attendance/page.tsx

import { createClient } from '@/lib/supabase/server'
import AttendanceManager from '@/components/admin/AttendanceManager'

export const metadata = { title: 'Attendance — Admin Panel | Eloquence' }

export default async function OwnerAttendancePage() {
  const supabase = await createClient()

  // Fetch all active groups
  const { data: groups } = await supabase
    .from('groups')
    .select('id, name, teacher_id')
    .eq('is_active', true)
    .order('name')

  // Fetch group members with user info
  const groupMembers: Record<string, any[]> = {}
  if (groups && groups.length > 0) {
    const groupIds = groups.map((g: any) => g.id)
    const { data: members } = await supabase
      .from('group_members')
      .select('group_id, user_id, users!group_members_user_id_fkey(full_name, email)')
      .in('group_id', groupIds)

    for (const m of (members ?? []) as any[]) {
      if (!groupMembers[m.group_id]) groupMembers[m.group_id] = []
      groupMembers[m.group_id].push({
        user_id: m.user_id,
        full_name: m.users?.full_name ?? '—',
        email: m.users?.email ?? '',
      })
    }
  }

  return (
    <AttendanceManager
      groups={groups ?? []}
      groupMembers={groupMembers}
    />
  )
}
