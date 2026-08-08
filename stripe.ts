import Stripe from "stripe";

// Initialize Stripe with the secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("[Stripe] STRIPE_SECRET_KEY not configured. Payment features will be disabled.");
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover",
    })
  : null;

export function isStripeConfigured(): boolean {
  return stripe !== null;
}
