import { Hono } from "hono";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import type { HonoContext } from "../index";
import { orders } from "../db/schema";
import { CreateCheckoutSchema } from "@lacquered/shared";

const router = new Hono<HonoContext>();

/**
 * POST /api/v1/checkout
 * Creates a Stripe Checkout Session and returns the session URL.
 * Line items are validated against our shared schema before creating the session.
 */
router.post("/", async (c) => {
  const db = c.get("db");
  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });

  const body = await c.req.json();
  const parsed = CreateCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Validation failed", details: parsed.error.flatten() }, 422);
  }

  const { lineItems, customerEmail, successUrl, cancelUrl } = parsed.data;

  const totalInCents = lineItems.reduce(
    (sum, item) => sum + item.priceInCents * item.quantity,
    0
  );

  // Pre-create the order record in pending state
  const [order] = await db
    .insert(orders)
    .values({
      customerEmail: customerEmail ?? "",
      lineItems,
      totalInCents,
      paymentStatus: "pending",
    })
    .returning();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: lineItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productTitle,
          metadata: {
            productId: item.productId,
            size: item.size ?? "",
            shape: item.shape ?? "",
          },
        },
        unit_amount: item.priceInCents,
      },
      quantity: item.quantity,
    })),
    payment_method_types: ["card"],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: { orderId: order.id },
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU"],
    },
  });

  // Update order with Stripe session id
  await db
    .update(orders)
    .set({ stripeSessionId: session.id })
    .where(eq(orders.id, order.id));

  return c.json({ url: session.url, sessionId: session.id });
});

export { router as checkoutRouter };
