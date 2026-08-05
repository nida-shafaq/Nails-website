import { Hono } from "hono";
import { HonoContext } from "../index";
import { products, customOrders, orders, reviews } from "../db/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";

export const adminRouter = new Hono<HonoContext>();

// Very simple RBAC auth middleware for MVP
adminRouter.use("/*", async (c, next) => {
  // In production, verify a real JWT from HTTP-only cookie.
  // For this scaffold, we check a simple bearer token or bypass in dev.
  const authHeader = c.req.header("Authorization");
  if (authHeader !== "Bearer admin_secret_token_123" && process.env.NODE_ENV === "production") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

// ─── Stats / KPIs ───────────────────────────────────────────────────────────
adminRouter.get("/stats", async (c) => {
  const db = c.get("db");
  
  // Total Revenue (Paid orders)
  const revenueResult = await db
    .select({ total: sql<number>`coalesce(sum(total_in_cents), 0)` })
    .from(orders)
    .where(eq(orders.paymentStatus, "paid"));
  const totalRevenue = revenueResult[0]?.total || 0;

  // Pending Custom Orders
  const pendingOrders = await db
    .select({ count: sql<number>`count(*)` })
    .from(customOrders)
    .where(inArray(customOrders.status, ["submitted", "in_design"]));
  const pendingCount = pendingOrders[0]?.count || 0;

  // Total Orders
  const totalOrdersResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders);
  
  // Low Stock Alerts (<= 5)
  const lowStockProducts = await db
    .select()
    .from(products)
    .where(sql`stock_quantity > -1 AND stock_quantity <= 5`);

  return c.json({
    totalRevenue: totalRevenue / 100, // format to dollars
    pendingCustomOrders: pendingCount,
    totalOrders: totalOrdersResult[0]?.count || 0,
    lowStockAlerts: lowStockProducts.length,
    lowStockProducts: lowStockProducts,
  });
});

// ─── Products ────────────────────────────────────────────────────────────────
adminRouter.get("/products", async (c) => {
  const db = c.get("db");
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
  return c.json(allProducts);
});

adminRouter.post("/products", async (c) => {
  const db = c.get("db");
  const body = await c.req.json();
  const newProduct = await db.insert(products).values(body).returning();
  return c.json(newProduct[0], 201);
});

adminRouter.patch("/products/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const body = await c.req.json();
  const updated = await db.update(products).set(body).where(eq(products.id, id)).returning();
  return c.json(updated[0]);
});

// ─── Custom Orders ───────────────────────────────────────────────────────────
adminRouter.get("/custom-orders", async (c) => {
  const db = c.get("db");
  const allCustomOrders = await db.select().from(customOrders).orderBy(desc(customOrders.createdAt));
  return c.json(allCustomOrders);
});

adminRouter.patch("/custom-orders/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const body = await c.req.json();
  const updated = await db
    .update(customOrders)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(customOrders.id, id))
    .returning();
  return c.json(updated[0]);
});

// ─── Orders & Reviews ────────────────────────────────────────────────────────
adminRouter.get("/orders", async (c) => {
  const db = c.get("db");
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return c.json(allOrders);
});

adminRouter.get("/reviews", async (c) => {
  const db = c.get("db");
  const allReviews = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  return c.json(allReviews);
});

adminRouter.patch("/reviews/:id/approve", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");
  const { verified } = await c.req.json();
  const updated = await db.update(reviews).set({ verified }).where(eq(reviews.id, id)).returning();
  return c.json(updated[0]);
});
