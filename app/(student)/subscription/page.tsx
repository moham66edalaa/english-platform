import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth/helpers'

export const metadata: Metadata = {
  title: 'Subscription | Eloquence',
}

const teal = '#4CC9A8'
const serif = "'Cormorant Garamond', serif"
const sans = "'DM Sans', sans-serif"

function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return teal
    case 'expired': return '#ef4444'
    case 'cancelled': return '#6A6560'
    default: return '#8A8278'
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100)
}

export default async function SubscriptionPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: subsData } = await supabase
    .from('subscriptions')
    .select('*, plans(name, price_usd, course_id, courses:course_id(title))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  const subscriptions = (subsData ?? []) as any[]

  const { data: paymentsData } = await supabase
    .from('payments')
    .select('*, plans(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)
  const payments = (paymentsData ?? []) as any[]

  const activeSub: any = subscriptions.find((s: any) => s.status === 'active') ?? null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111110', color: '#EAE4D2', fontFamily: sans }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: teal,
          }}>
            My Account
          </span>
          <h1 style={{
            fontFamily: serif,
            fontSize: '42px',
            fontWeight: 300,
            color: '#EAE4D2',
            margin: '8px 0 0 0',
          }}>
            Subscription
          </h1>
        </div>

        {/* Active Subscription Card */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: serif,
            fontSize: '24px',
            fontWeight: 400,
            color: '#EAE4D2',
            marginBottom: '20px',
          }}>
            Current Subscription
          </h2>

          {activeSub ? (
            <div style={{
              backgroundColor: '#111110',
              border: '1px solid rgba(245,240,232,0.07)',
              borderRadius: '16px',
              padding: '40px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
              }}>
                <div>
                  <h3 style={{
                    fontFamily: serif,
                    fontSize: '28px',
                    fontWeight: 400,
                    color: '#EAE4D2',
                    margin: '0 0 4px 0',
                    textTransform: 'capitalize' as const,
                  }}>
                    {activeSub.plans?.name ?? 'Subscription'} Plan
                  </h3>
                  {activeSub.plans?.courses?.title && (
                    <span style={{ fontSize: '14px', color: '#8A8278' }}>
                      {activeSub.plans.courses.title}
                    </span>
                  )}
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '5px 16px',
                  borderRadius: '20px',
                  backgroundColor: `${getStatusColor(activeSub.status)}18`,
                  color: getStatusColor(activeSub.status),
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'capitalize' as const,
                }}>
                  {activeSub.status}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
              }}>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    color: '#5E5A54',
                    marginBottom: '6px',
                  }}>
                    Start Date
                  </div>
                  <div style={{ fontSize: '15px', color: '#EAE4D2' }}>
                    {activeSub.start_date ? formatDate(activeSub.start_date) : '—'}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    color: '#5E5A54',
                    marginBottom: '6px',
                  }}>
                    Expiry Date
                  </div>
                  <div style={{ fontSize: '15px', color: '#EAE4D2' }}>
                    {activeSub.end_date ? formatDate(activeSub.end_date) : '—'}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    color: '#5E5A54',
                    marginBottom: '6px',
                  }}>
                    Auto-Renew
                  </div>
                  <div style={{
                    fontSize: '15px',
                    color: activeSub.auto_renew ? teal : '#8A8278',
                  }}>
                    {activeSub.auto_renew ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#111110',
              border: '1px solid rgba(245,240,232,0.07)',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center' as const,
            }}>
              <p style={{
                fontSize: '16px',
                color: '#8A8278',
                margin: '0 0 8px 0',
              }}>
                No active subscription
              </p>
              <p style={{
                fontSize: '14px',
                color: '#5E5A54',
                margin: 0,
              }}>
                Browse our courses and plans to get started with your learning journey.
              </p>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div>
          <h2 style={{
            fontFamily: serif,
            fontSize: '24px',
            fontWeight: 400,
            color: '#EAE4D2',
            marginBottom: '20px',
          }}>
            Payment History
          </h2>

          {payments && payments.length > 0 ? (
            <div style={{
              backgroundColor: '#111110',
              border: '1px solid rgba(245,240,232,0.07)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}>
                <thead>
                  <tr>
                    {['Date', 'Plan', 'Amount', 'Status'].map((header) => (
                      <th key={header} style={{
                        textAlign: 'left' as const,
                        padding: '14px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        color: '#5E5A54',
                        borderBottom: '1px solid rgba(245,240,232,0.07)',
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment: any) => (
                    <tr key={payment.id}>
                      <td style={{
                        padding: '14px 20px',
                        fontSize: '14px',
                        color: '#EAE4D2',
                        borderBottom: '1px solid rgba(245,240,232,0.04)',
                      }}>
                        {payment.created_at ? formatDate(payment.created_at) : '—'}
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontSize: '14px',
                        color: '#8A8278',
                        borderBottom: '1px solid rgba(245,240,232,0.04)',
                        textTransform: 'capitalize' as const,
                      }}>
                        {payment.plans?.name ?? '—'}
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        fontSize: '14px',
                        color: '#EAE4D2',
                        borderBottom: '1px solid rgba(245,240,232,0.04)',
                      }}>
                        {payment.amount != null ? formatCurrency(payment.amount) : '—'}
                      </td>
                      <td style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid rgba(245,240,232,0.04)',
                      }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: payment.status === 'succeeded'
                            ? `${teal}18`
                            : payment.status === 'failed'
                              ? '#ef444418'
                              : 'rgba(138,130,120,0.12)',
                          color: payment.status === 'succeeded'
                            ? teal
                            : payment.status === 'failed'
                              ? '#ef4444'
                              : '#8A8278',
                          textTransform: 'capitalize' as const,
                        }}>
                          {payment.status ?? '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ fontSize: '15px', color: '#8A8278' }}>
              No payment history available.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
