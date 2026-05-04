import { loadStripe, type Stripe } from '@stripe/stripe-js'

/**
 * Stripe's universally-known TEST publishable key (safe to commit — published in
 * Stripe's own quickstarts). Used as a fallback so the embedded card form always
 * loads in demo mode even when no environment variable is configured.
 *
 * IMPORTANT: this is the *test demo* key. For real money the deployment must set
 * its own `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (and matching `STRIPE_SECRET_KEY`
 * on the server) — Stripe rejects any client_secret that does not belong to the
 * same account as the publishable key.
 */
const DEMO_PUBLISHABLE_KEY = 'pk_test_TYooMQauvdEDq54NiTphI7jx'

let stripePromise: Promise<Stripe | null> | null = null

export function getStripeBrowser(): Promise<Stripe | null> {
  const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  const key = envKey && envKey.length > 0 ? envKey : DEMO_PUBLISHABLE_KEY
  if (!stripePromise) stripePromise = loadStripe(key)
  return stripePromise
}

/** True when the page is using the embedded Stripe demo key (env not configured). */
export function isUsingStripeDemoKey(): boolean {
  const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  return !envKey || envKey.length === 0
}
