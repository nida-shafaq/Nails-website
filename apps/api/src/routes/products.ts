import { Hono } from "hono";
import { eq, and, sql, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { HonoContext } from "../index";
import { products } from "../db/schema";
import { ProductFilterSchema } from "@lacquered/shared";

const router = new Hono<HonoContext>();

/**
 * GET /api/v1/products
 * Filterable, paginated product list.
 * Filter params map directly to the ProductFilterSchema and are reflected in URL state
 * via nuqs on the client so filtered views are shareable.
 */
router.get("/", zValidator("query", ProductFilterSchema), async (c) => {
  const db = c.get("db");
  const { shape, length, finish, collection, minPrice, maxPrice, page, limit } =
    c.req.valid("query");

  const offset = (page - 1) * limit;

  // Base conditions — always filter inactive products
  const conditions = [eq(products.active, true)];

  if (finish) conditions.push(eq(products.finish, finish as any));
  if (collection) conditions.push(eq(products.collection, collection));
  if (minPrice) conditions.push(sql`${products.priceInCents} >= ${minPrice * 100}`);
  if (maxPrice) conditions.push(sql`${products.priceInCents} <= ${maxPrice * 100}`);

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset);

  // Client-side shape/length filter (SQLite JSON containment is limited)
  let filtered = rows;
  if (shape && shape.length > 0) {
    filtered = filtered.filter((p) =>
      (p.shapes as string[]).some((s) => shape.includes(s as any))
    );
  }
  if (length && length.length > 0) {
    filtered = filtered.filter((p) =>
      (p.lengths as string[]).some((l) => length.includes(l as any))
    );
  }

  return c.json({ data: filtered, meta: { page, limit } });
});

/**
 * GET /api/v1/products/:slug
 */
router.get("/:slug", async (c) => {
  const db = c.get("db");
  const slug = c.req.param("slug");

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.active, true)));

  if (!product) return c.json({ error: "Product not found" }, 404);
  return c.json({ data: product });
});

export { router as productsRouter };
