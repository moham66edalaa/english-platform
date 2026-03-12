// app/(owner)/layout.tsx
import { requireOwner } from '@/lib/auth/helpers'
import OwnerSidebar     from '@/components/layout/OwnerSidebar'

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireOwner() // redirects to /dashboard if not owner

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0f14' }}>
      <OwnerSidebar user={{ full_name: user.full_name, email: user.email }} />
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
