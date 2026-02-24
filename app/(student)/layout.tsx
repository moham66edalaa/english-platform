// app/(student)/layout.tsx
import { redirect }      from 'next/navigation'
import { requireUser }   from '@/lib/auth/helpers'
import { createClient }  from '@/lib/supabase/server'
import SidebarClient     from '@/components/layout/SidebarClient'
import type { UserRow }  from '@/types'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user     = await requireUser()
  const supabase = await createClient()

  // Admins have their own area
  if (user.role === 'admin') redirect('/admin')

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
      <SidebarClient user={(profile ?? fallbackUser) as UserRow} />
      <main style={{
        flex: 1,
        marginLeft: '210px',
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