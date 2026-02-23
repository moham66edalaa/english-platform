// lib/payments/stripe.ts
import Stripe from 'stripe'

/**
 * Get a configured Stripe instance.
 * Returns null if STRIPE_SECRET_KEY is missing (prevents build failures).
 */
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    console.warn('⚠️ STRIPE_SECRET_KEY is missing – Stripe will not work')
    return null
  }
  return new Stripe(key, {
    apiVersion: '2026-01-28.clover',
  })
}

/**
 * Create a Stripe Checkout Session for a plan purchase.
 * Throws if Stripe is not configured.
 */
export async function createCheckoutSession({
  planId,
  priceUsd,
  courseTitle,
  planName,
  userId,
  successUrl,
  cancelUrl,
}: {
  planId: string
  priceUsd: number
  courseTitle: string
  planName: string
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  const stripe = getStripe()
  if (!stripe) {
    throw new Error('Stripe is not configured – missing STRIPE_SECRET_KEY')
  }

  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(priceUsd * 100), // Stripe uses cents
          product_data: {
            name: `${courseTitle} — ${planName} Plan`,
            description: `Eloquence English Platform`,
          },
        },
      },
    ],
    metadata: { planId, userId },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}