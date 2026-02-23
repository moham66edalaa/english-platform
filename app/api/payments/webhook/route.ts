// 📁 app/api/payments/webhook/route.ts

import { NextResponse }    from 'next/server'
import { stripe }          from '@/lib/payments/stripe'
import { createClient }    from '@/lib/supabase/server'
import Stripe              from 'stripe'

export async function POST(request: Request) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object as Stripe.Checkout.Session
    const { planId, userId } = session.metadata ?? {}

    if (!planId || !userId) return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })

    const supabase = await createClient()

    // Fetch plan → get course_id
    const { data: plan } = await supabase.from('plans').select('id, course_id').eq('id', planId).single()
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

    // Create enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .upsert({ user_id: userId, course_id: plan.course_id, plan_id: plan.id }, { onConflict: 'user_id,course_id' })
      .select()
      .single()

    // Record payment
    await supabase.from('payments').insert({
      user_id:       userId,
      enrollment_id: enrollment?.id ?? null,
      plan_id:       planId,
      amount_usd:    (session.amount_total ?? 0) / 100,
      currency:      session.currency ?? 'usd',
      provider:      'stripe',
      provider_ref:  session.payment_intent as string,
      status:        'completed',
      paid_at:       new Date().toISOString(),
    })
  }

  return NextResponse.json({ received: true })
}