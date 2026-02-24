// 📁 components/layout/SidebarClient.tsx
// This wrapper ensures Sidebar only renders client-side, preventing hydration mismatch
'use client'

import dynamic from 'next/dynamic'
import type { UserRow } from '@/types'

const Sidebar = dynamic(
  () => import('./Sidebar'),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '210px', height: '100vh',
        backgroundColor: '#13161f',
        borderRight: '1px solid rgba(245,240,232,0.07)',
        zIndex: 30,
      }} />
    )
  }
)

export default function SidebarClient({ user }: { user: UserRow }) {
  return <Sidebar user={user} />
}
