/// <reference types="@cloudflare/workers-types" />
/**
 * Hono API entry point — Cloudflare Workers edge runtime
 *
 * Architecture decisions:
 * - All routes are versioned under /api/v1 for forward compatibility.
 * - CORS is configured to allow the Cloudflare Pages domain only.
 * - The Cloudflare D1 binding (env.DB) is passed via Hono context, keeping
 *   the Drizzle client request-scoped (Workers are stateless).
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { drizzle } from "drizzle-orm/d1";

import { productsRouter } from "./routes/products";
import { customOrdersRouter } from "./routes/custom-orders";
import { checkoutRouter } from "./routes/checkout";
import { webhooksRouter } from "./routes/webhooks";
import { reviewsRouter } from "./routes/reviews";
import { adminRouter } from "./routes/admin";

export type Env = {
  DB: D1Database;
  ASSETS: R2Bucket;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  CORS_ORIGIN: string;
  CF_ACCOUNT_HASH: string;
};

export type HonoContext = {
  Bindings: Env;
  Variables: {
    db: ReturnType<typeof drizzle>;
  };
};

const app = new Hono<HonoContext>();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use("*", logger());
app.use("*", prettyJSON());

app.use("/api/*", async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Stripe-Signature"],
    credentials: true,
  });
  return corsMiddleware(c, next);
});

// Attach Drizzle client to context on every request
app.use("/api/*", async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set("db", db);
  await next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────

app.route("/api/v1/products", productsRouter);
app.route("/api/v1/custom-orders", customOrdersRouter);
app.route("/api/v1/checkout", checkoutRouter);
app.route("/api/v1/webhooks", webhooksRouter);
app.route("/api/v1/reviews", reviewsRouter);
app.route("/api/v1/admin", adminRouter);

// Health check
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// Root friendly message
app.get("/", (c) => {
  return c.json({
    message: "Welcome to the NailVibe API \u2728",
    status: "online",
    docs: "All endpoints are under /api/v1"
  });
});

// 404 fallback
app.notFound((c) => c.json({ error: "Route not found" }, 404));

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
