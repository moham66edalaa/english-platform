// app/(student)/layout.tsx
import { redirect }      from 'next/navigation'
import { requireUser }   from '@/lib/auth/helpers'
import { createClient }  from '@/lib/supabase/server'
import SidebarClient     from '@/components/layout/SidebarClient'
import type { UserRow }  from '@/types'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user     = await requireUser()
  const supabase = await createClient()

  // Owners and teachers have their own areas
  if (user.role === 'owner') redirect('/owner')
  if (user.role === 'teacher') redirect('/teacher')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const fallbackUser = {
    id: user.id, email: user.email ?? '',
    full_name: null, cefr_level: null, role: 'student',
  } as UserRow

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0f14' }}>
      <style>{`
        .student-main { margin-left: 210px; }
        @media (max-width: 768px) { .student-main { margin-left: 0; } }
      `}</style>
      <SidebarClient user={(profile ?? fallbackUser) as UserRow} />
      <main className="student-main" style={{
        flex: 1,
        minHeight: '100vh',
        padding: '40px 40px',
        backgroundColor: '#0d0f14',
        color: '#f5f0e8',
      }}>
        {children}
      </main>
    </div>
  )
}