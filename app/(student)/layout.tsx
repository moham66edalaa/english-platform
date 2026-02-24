// 📁 app/(student)/layout.tsx
import { requireUser }  from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import Sidebar          from '@/components/layout/Sidebar'
import type { UserRow } from '@/types'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user     = await requireUser()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const fallbackUser = {
    id: user.id, email: user.email ?? '',
    full_name: null, cefr_level: null,
  } as UserRow

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0f14' }}>
      <Sidebar user={(profile ?? fallbackUser) as UserRow} />
      <main style={{
        flex: 1,
        marginLeft: '210px',
        minHeight: '100vh',
        padding: '40px 40px',
        backgroundColor: '#0d0f14',
        color: '#f5f0e8',
        position: 'relative',
        zIndex: 10,
      }}>
        {children}
      </main>
    </div>
  )
}
