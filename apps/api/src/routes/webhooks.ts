import { Hono } from "hono";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import type { HonoContext } from "../index";
import { orders } from "../db/schema";

const router = new Hono<HonoContext>();

/**
 * POST /api/v1/webhooks/stripe
 * Verifies the Stripe webhook signature and updates the order status on payment.success.
 * Uses the raw body (arraybuffer) for signature verification — must NOT use c.req.json().
 */
router.post("/stripe", async (c) => {
  const db = c.get("db");
  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });

  const signature = c.req.header("stripe-signature");
  if (!signature) return c.json({ error: "No signature" }, 400);

  const rawBody = await c.req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      c.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return c.json({ error: "Invalid signature" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const shippingDetails = session.shipping_details;
      const address = shippingDetails?.address;

      await db
        .update(orders)
        .set({
          paymentStatus: "paid",
          customerEmail: session.customer_email ?? "",
          shippingAddress: address
            ? {
                name: shippingDetails?.name ?? "",
                line1: address.line1 ?? "",
                line2: address.line2 ?? undefined,
                city: address.city ?? "",
                state: address.state ?? "",
                postalCode: address.postal_code ?? "",
                country: address.country ?? "",
              }
            : undefined,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(orders.id, orderId));
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await db
        .update(orders)
        .set({ paymentStatus: "failed", updatedAt: new Date().toISOString() })
        .where(eq(orders.id, orderId));
    }
  }

  return c.json({ received: true });
});

export { router as webhooksRouter };
