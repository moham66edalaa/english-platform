import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payments — Admin Panel | Eloquence',
}

export default async function OwnerPaymentsPage() {
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from('payments')
    .select('*, users!payments_user_id_fkey(full_name, email), plans(name, course_id)')
    .order('created_at', { ascending: false })
    .limit(50)

  const totalRevenue = payments?.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + (p.amount_usd ?? 0), 0) ?? 0
  const completedCount = payments?.filter((p: any) => p.status === 'completed').length ?? 0
  const pendingCount = payments?.filter((p: any) => p.status === 'pending').length ?? 0
  const failedCount = payments?.filter((p: any) => p.status === 'failed').length ?? 0

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#C9A84C'
      case 'pending': return '#eab308'
      case 'failed': return '#ef4444'
      case 'refunded': return '#4CA8C9'
      default: return '#8A8278'
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111110', color: '#EAE4D2', padding: '48px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>
          Admin Panel
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: '#EAE4D2', margin: '0 0 40px' }}>
          Payments
        </h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 48 }}>
          <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, padding: '28px 28px 24px' }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: '#8A8278', margin: '0 0 8px' }}>Total Revenue</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: '#C9A84C', margin: 0 }}>${totalRevenue.toLocaleString()}</p>
          </div>
          <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, padding: '28px 28px 24px' }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: '#8A8278', margin: '0 0 8px' }}>Completed</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: '#C9A84C', margin: 0 }}>{completedCount}</p>
          </div>
          <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, padding: '28px 28px 24px' }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: '#8A8278', margin: '0 0 8px' }}>Pending</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: '#C9A84C', margin: 0 }}>{pendingCount}</p>
          </div>
          <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, padding: '28px 28px 24px' }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: '#8A8278', margin: '0 0 8px' }}>Failed</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: '#C9A84C', margin: 0 }}>{failedCount}</p>
          </div>
        </div>

        {/* Table */}
        <div style={{ border: '1px solid rgba(245,240,232,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.04)' }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Student</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Plan</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Amount</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Status</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#5E5A54', margin: 0 }}>Date</p>
          </div>

          {payments?.map((payment: any) => (
            <div key={payment.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.04)', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#EAE4D2', margin: 0 }}>{payment.users?.full_name ?? '—'}</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: '#5E5A54', margin: '4px 0 0' }}>{payment.users?.email ?? ''}</p>
              </div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#8A8278', margin: 0 }}>{payment.plans?.name ?? '—'}</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#EAE4D2', margin: 0 }}>${(payment.amount_usd ?? 0).toLocaleString()}</p>
              <div>
                <span style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: 12,
                  color: statusColor(payment.status),
                  backgroundColor: `${statusColor(payment.status)}18`,
                  padding: '4px 12px',
                  borderRadius: 20,
                  textTransform: 'capitalize',
                }}>
                  {payment.status}
                </span>
              </div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, color: '#5E5A54', margin: 0 }}>
                {new Date(payment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ))}

          {(!payments || payments.length === 0) && (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, color: '#5E5A54', margin: 0 }}>No payments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
