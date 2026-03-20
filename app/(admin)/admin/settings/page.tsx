// app/(owner)/admin/settings/page.tsx

import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Settings — Admin' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('platform_settings')
    .select('*')

  // Build a key→value map from the settings rows
  const settingsMap: Record<string, string> = {}
  ;(settings ?? []).forEach((row: any) => {
    if (row.key) settingsMap[row.key] = row.value ?? ''
  })

  const platformName        = settingsMap['platform_name']        || null
  const platformDescription = settingsMap['platform_description'] || null
  const stripeMode          = settingsMap['stripe_mode']          || null
  const stripePublicKey     = settingsMap['stripe_public_key']    || null

  return (
    <>
      <style>{`
        .settings-card {
          background-color: #111110;
          border: 1px solid rgba(245,240,232,0.07);
          border-radius: 16px;
          padding: 28px 28px 24px;
          margin-bottom: 16px;
        }
        .settings-card:last-child { margin-bottom: 0; }
        .settings-field { padding: 14px 0; border-bottom: 1px solid rgba(245,240,232,0.05); }
        .settings-field:last-child { border-bottom: none; padding-bottom: 0; }
        .settings-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .badge-active {
          background-color: rgba(109,200,122,0.1);
          border: 1px solid rgba(109,200,122,0.25);
          color: #6DC87A;
        }
        .badge-inactive {
          background-color: rgba(245,240,232,0.04);
          border: 1px solid rgba(245,240,232,0.1);
          color: #5E5A54;
        }
        .badge-gold {
          background-color: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.2);
          color: #C9A84C;
        }
      `}</style>

      <div style={{ maxWidth: '760px' }}>

        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6F35', marginBottom: '8px' }}>
            Admin Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2' }}>
            Settings
          </h1>
          <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.82rem', color: '#5E5A54', marginTop: '8px' }}>
            Platform configuration and integration status.
          </p>
        </div>

        {/* ── Platform Info ── */}
        <div className="settings-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '4px' }}>
                Platform Info
              </h2>
              <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.78rem', color: '#5E5A54' }}>
                Core identity settings for the platform
              </p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '1rem', flexShrink: 0 }}>
              ◈
            </div>
          </div>

          <div className="settings-field">
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54', marginBottom: '6px' }}>
              Platform Name
            </div>
            <div style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.9rem', color: platformName ? '#D8D2C0' : '#3E3A36' }}>
              {platformName ?? 'Not configured'}
            </div>
          </div>

          <div className="settings-field">
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54', marginBottom: '6px' }}>
              Description
            </div>
            <div style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.88rem', lineHeight: 1.6, color: platformDescription ? '#8A8278' : '#3E3A36' }}>
              {platformDescription ?? 'Not configured'}
            </div>
          </div>
        </div>

        {/* ── Payment Configuration ── */}
        <div className="settings-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '4px' }}>
                Payment Configuration
              </h2>
              <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.78rem', color: '#5E5A54' }}>
                Stripe integration status and mode
              </p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '1rem', flexShrink: 0 }}>
              ◆
            </div>
          </div>

          <div className="settings-field">
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54', marginBottom: '8px' }}>
              Stripe Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {stripePublicKey ? (
                <>
                  <span className="settings-badge badge-active">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#6DC87A', display: 'inline-block' }} />
                    Connected
                  </span>
                  {stripeMode && (
                    <span className="settings-badge badge-gold" style={{ fontFamily: sans }}>
                      {stripeMode}
                    </span>
                  )}
                </>
              ) : (
                <span className="settings-badge badge-inactive" style={{ fontFamily: sans }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#5E5A54', display: 'inline-block' }} />
                  Not configured
                </span>
              )}
            </div>
          </div>

          <div className="settings-field">
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54', marginBottom: '6px' }}>
              Public Key
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.8rem', color: stripePublicKey ? '#8A8278' : '#3E3A36' }}>
              {stripePublicKey
                ? `${stripePublicKey.slice(0, 12)}${'•'.repeat(16)}${stripePublicKey.slice(-4)}`
                : 'Not configured'}
            </div>
          </div>

          <div className="settings-field">
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54', marginBottom: '6px' }}>
              Mode
            </div>
            <div style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.88rem', color: stripeMode ? '#D8D2C0' : '#3E3A36' }}>
              {stripeMode
                ? stripeMode.charAt(0).toUpperCase() + stripeMode.slice(1)
                : 'Not configured'}
            </div>
          </div>
        </div>

        {/* ── Notifications ── */}
        <div className="settings-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.3rem', color: '#EAE4D2', marginBottom: '4px' }}>
                Notifications
              </h2>
              <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.78rem', color: '#5E5A54' }}>
                Email and system notification preferences
              </p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '1rem', flexShrink: 0 }}>
              ◎
            </div>
          </div>

          <div className="settings-field">
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54', marginBottom: '8px' }}>
              Email Notifications
            </div>
            <span className="settings-badge badge-inactive" style={{ fontFamily: sans }}>
              Not configured
            </span>
          </div>

          <div className="settings-field">
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54', marginBottom: '8px' }}>
              Enrolment Alerts
            </div>
            <span className="settings-badge badge-inactive" style={{ fontFamily: sans }}>
              Not configured
            </span>
          </div>

          <div className="settings-field">
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5E5A54', marginBottom: '8px' }}>
              Payment Alerts
            </div>
            <span className="settings-badge badge-inactive" style={{ fontFamily: sans }}>
              Not configured
            </span>
          </div>

          {/* Coming soon notice */}
          <div style={{ marginTop: '20px', padding: '14px 18px', borderRadius: '10px', backgroundColor: 'rgba(201,168,76,0.04)', border: '1px dashed rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'rgba(201,168,76,0.35)', fontSize: '0.85rem' }}>◈</span>
            <p style={{ fontFamily: sans, fontWeight: 300, fontSize: '0.78rem', color: '#5E5A54', margin: 0 }}>
              Notification settings will be configurable in a future update.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}
