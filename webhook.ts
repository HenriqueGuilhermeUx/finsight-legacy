import { Request, Response } from "express";
import { stripe, isStripeConfigured } from "./stripe";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function handleStripeWebhook(req: Request, res: Response) {
  if (!isStripeConfigured() || !stripe) {
    console.warn("[Stripe Webhook] Stripe not configured");
    return res.status(400).json({ error: "Stripe not configured" });
  }

  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    console.error("[Stripe Webhook] No signature provided");
    return res.status(400).json({ error: "No signature provided" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret || "");
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle test events for webhook verification
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Invoice paid: ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Invoice payment failed: ${invoice.id}`);
        // Could send email notification to user here
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  const userId = session.metadata?.user_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error("[Stripe Webhook] No user_id in session metadata");
    return;
  }

  // Determine subscription tier from the session
  const subscriptionStatus = session.metadata?.plan === "enterprise" ? "enterprise" : "pro";

  // Calculate expiration date (1 month or 1 year from now)
  const billingInterval = session.metadata?.billing_interval || "month";
  const expiresAt = new Date();
  if (billingInterval === "year") {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }

  console.log(`[Stripe Webhook] Updating user ${userId} to ${subscriptionStatus} subscription`);

  await db
    .update(users)
    .set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: subscriptionStatus as "free" | "pro" | "enterprise",
      subscriptionExpiresAt: expiresAt,
    })
    .where(eq(users.id, parseInt(userId)));

  console.log(`[Stripe Webhook] User ${userId} subscription updated successfully`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (userResult.length === 0) {
    console.error(`[Stripe Webhook] No user found for customer ${customerId}`);
    return;
  }

  const user = userResult[0];

  // Update subscription status based on Stripe status
  let newStatus: "free" | "pro" | "enterprise" = "free";
  if (subscription.status === "active" || subscription.status === "trialing") {
    // Determine tier from price
    const priceId = subscription.items.data[0]?.price?.id;
    if (priceId?.includes("enterprise")) {
      newStatus = "enterprise";
    } else {
      newStatus = "pro";
    }
  }

  // Get expiration from subscription items or default to 1 month
  const currentPeriodEnd = (subscription as any).current_period_end;
  const expiresAt = currentPeriodEnd 
    ? new Date(currentPeriodEnd * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db
    .update(users)
    .set({
      subscriptionStatus: newStatus,
      subscriptionExpiresAt: expiresAt,
    })
    .where(eq(users.id, user.id));

  console.log(`[Stripe Webhook] User ${user.id} subscription updated to ${newStatus}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const db = await getDb();
  if (!db) return;

  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (userResult.length === 0) {
    console.error(`[Stripe Webhook] No user found for customer ${customerId}`);
    return;
  }

  const user = userResult[0];

  // Downgrade to free plan
  await db
    .update(users)
    .set({
      subscriptionStatus: "free",
      stripeSubscriptionId: null,
      subscriptionExpiresAt: null,
    })
    .where(eq(users.id, user.id));

  console.log(`[Stripe Webhook] User ${user.id} subscription cancelled, downgraded to free`);
}
