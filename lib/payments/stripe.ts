// 📁 lib/payments/stripe.ts

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

/** Create a Stripe Checkout Session for a plan purchase. */
export async function createCheckoutSession({
  planId,
  priceUsd,
  courseTitle,
  planName,
  userId,
  successUrl,
  cancelUrl,
}: {
  planId:       string
  priceUsd:     number
  courseTitle:  string
  planName:     string
  userId:       string
  successUrl:   string
  cancelUrl:    string
}) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency:     'usd',
          unit_amount:  Math.round(priceUsd * 100),   // Stripe uses cents
          product_data: {
            name:        `${courseTitle} — ${planName} Plan`,
            description: `Eloquence English Platform`,
          },
        },
      },
    ],
    metadata: { planId, userId },
    success_url: successUrl,
    cancel_url:  cancelUrl,
  })
}