import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import type { HonoContext } from "../index";
import { customOrders } from "../db/schema";
import { CreateCustomOrderSchema } from "@lacquered/shared";
import { createId } from "@paralleldrive/cuid2";

const router = new Hono<HonoContext>();

/**
 * POST /api/v1/custom-orders
 * Accepts multipart form data:
 * - JSON fields matching CreateCustomOrderSchema
 * - Optional file uploads (reference images)
 *
 * Files are compressed client-side before upload, then stored in R2.
 */
router.post("/", async (c) => {
  const db = c.get("db");
  const assets = c.env.ASSETS;

  const formData = await c.req.formData();

  // Parse JSON fields from form data
  const rawData = {
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    occasion: formData.get("occasion") ?? undefined,
    budget: formData.get("budget") ?? undefined,
    deadline: formData.get("deadline") ?? undefined,
    shape: formData.get("shape") ?? undefined,
    fingerSizes: formData.get("fingerSizes")
      ? JSON.parse(formData.get("fingerSizes") as string)
      : undefined,
    notes: formData.get("notes") ?? undefined,
  };

  const parsed = CreateCustomOrderSchema.safeParse(rawData);
  if (!parsed.success) {
    return c.json({ error: "Validation failed", details: parsed.error.flatten() }, 422);
  }

  // Upload reference images to R2
  const referenceImageUrls: string[] = [];
  const files = formData.getAll("referenceImages") as File[];

  for (const file of files) {
    if (!(file instanceof File)) continue;
    const key = `custom-orders/${createId()}/${file.name}`;
    const buffer = await file.arrayBuffer();
    await assets.put(key, buffer, {
      httpMetadata: { contentType: file.type },
    });
    // Construct Cloudflare Images URL pattern
    referenceImageUrls.push(
      `https://imagedelivery.net/${c.env.CF_ACCOUNT_HASH}/${key}/public`
    );
  }

  const [order] = await db
    .insert(customOrders)
    .values({
      ...parsed.data,
      shape: parsed.data.shape as any,
      referenceImageUrls,
      status: "submitted",
    })
    .returning();

  return c.json({ data: order }, 201);
});

/**
 * GET /api/v1/custom-orders/gallery
 * Public endpoint to fetch shipped custom orders for the inspiration gallery.
 */
router.get("/gallery", async (c) => {
  const db = c.get("db");

  const orders = await db
    .select({
      id: customOrders.id,
      shape: customOrders.shape,
      notes: customOrders.notes,
      referenceImageUrls: customOrders.referenceImageUrls,
    })
    .from(customOrders)
    .where(eq(customOrders.status, "shipped"))
    .limit(12);

  return c.json({ data: orders });
});

/**
 * GET /api/v1/custom-orders/:id
 * Public status check — customer can track their custom order.
 */
router.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [order] = await db
    .select({
      id: customOrders.id,
      status: customOrders.status,
      createdAt: customOrders.createdAt,
      updatedAt: customOrders.updatedAt,
      customerName: customOrders.customerName,
      occasion: customOrders.occasion,
      deadline: customOrders.deadline,
    })
    .from(customOrders)
    .where(eq(customOrders.id, id));

  if (!order) return c.json({ error: "Order not found" }, 404);
  return c.json({ data: order });
});

export { router as customOrdersRouter };
