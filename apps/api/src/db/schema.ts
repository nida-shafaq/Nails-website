/**
 * Drizzle ORM schema for Lacquered — Cloudflare D1 (SQLite dialect)
 *
 * Design decisions:
 * - SQLite stores arrays as JSON text (no native array type); we use $type<string[]>()
 *   with a custom JSON serializer so Drizzle keeps them typed on the TS side.
 * - All timestamps are stored as ISO-8601 text (SQLite has no native DATETIME).
 * - Slugs are generated server-side (slugify on title) and stored for stable URLs.
 * - Per-finger size breakdown in custom_orders is stored as JSON (10 fingers, each with
 *   an XS-XL enum) — flexible enough for customers who only fill in some fingers.
 */

import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";

// ─── Helpers ────────────────────────────────────────────────────────────────

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => createId());

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
};

// ─── Products ────────────────────────────────────────────────────────────────

export const products = sqliteTable("products", {
  id: id(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  /** Price in cents (USD) — avoids float rounding issues */
  priceInCents: integer("price_in_cents").notNull(),
  /** JSON array of Shape enums: Almond | Coffin | Square | Stiletto | Oval */
  shapes: text("shapes", { mode: "json" }).$type<string[]>().notNull().default([]),
  /** JSON array of Length enums: Short | Medium | Long | XL */
  lengths: text("lengths", { mode: "json" }).$type<string[]>().notNull().default([]),
  /** Finish enum: Glossy | Matte | Chrome | Glitter | Jelly */
  finish: text("finish", {
    enum: ["Glossy", "Matte", "Chrome", "Glitter", "Jelly"],
  }).notNull(),
  /** Collection / theme grouping e.g. "Autumn Noir", "Bridal" */
  collection: text("collection"),
  /** JSON array of Cloudflare Images URLs */
  imageUrls: text("image_urls", { mode: "json" }).$type<string[]>().notNull().default([]),
  /** Hex color of the real polish swatch tied to this product */
  swatchColor: text("swatch_color").notNull().default("#8B1A3A"),
  /** Whether this product can be ordered in custom sizes / designs */
  customizable: integer("customizable", { mode: "boolean" }).notNull().default(false),
  /** Inventory count; -1 = unlimited (made-to-order) */
  stockQuantity: integer("stock_quantity").notNull().default(-1),
  /** Soft delete */
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ─── Custom Orders ───────────────────────────────────────────────────────────

export const customOrders = sqliteTable("custom_orders", {
  id: id(),
  /** Customer details */
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  /** Occasion e.g. "Wedding", "Birthday", "Everyday" */
  occasion: text("occasion"),
  /** Budget range e.g. "$50-$100" */
  budget: text("budget"),
  /** Deadline (ISO date string) */
  deadline: text("deadline"),
  /** Shape preference for the whole set */
  shape: text("shape", {
    enum: ["Almond", "Coffin", "Square", "Stiletto", "Oval"],
  }),
  /**
   * Per-finger size breakdown as JSON:
   * { thumb_L: "M", index_L: "S", ... } using XS|S|M|L|XL
   */
  fingerSizes: text("finger_sizes", { mode: "json" }).$type<
    Partial<Record<string, "XS" | "S" | "M" | "L" | "XL">>
  >(),
  /** Additional free-text notes / inspiration */
  notes: text("notes"),
  /** JSON array of R2 URLs for reference images */
  referenceImageUrls: text("reference_image_urls", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  status: text("status", {
    enum: ["submitted", "in_design", "ready", "shipped", "cancelled"],
  })
    .notNull()
    .default("submitted"),
  ...timestamps,
});

// ─── Orders ──────────────────────────────────────────────────────────────────

export const orders = sqliteTable("orders", {
  id: id(),
  customerEmail: text("customer_email").notNull(),
  /**
   * Line items as JSON:
   * Array<{ productId, productTitle, quantity, priceInCents, size, shape }>
   */
  lineItems: text("line_items", { mode: "json" })
    .$type<
      Array<{
        productId: string;
        productTitle: string;
        quantity: number;
        priceInCents: number;
        size?: string;
        shape?: string;
      }>
    >()
    .notNull()
    .default([]),
  /** Total in cents */
  totalInCents: integer("total_in_cents").notNull(),
  /** Stripe payment_intent or session id */
  stripeSessionId: text("stripe_session_id").unique(),
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "refunded", "failed"],
  })
    .notNull()
    .default("pending"),
  /** Shipping address as JSON */
  shippingAddress: text("shipping_address", { mode: "json" }).$type<{
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>(),
  ...timestamps,
});

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviews = sqliteTable("reviews", {
  id: id(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  customerName: text("customer_name").notNull(),
  /** 1–5 integer */
  rating: integer("rating").notNull(),
  comment: text("comment"),
  /** JSON array of Cloudflare Images URLs */
  photoUrls: text("photo_urls", { mode: "json" }).$type<string[]>().notNull().default([]),
  /** Only set to true after order verification */
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

// ─── Type exports (inferred from schema) ────────────────────────────────────

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type CustomOrder = typeof customOrders.$inferSelect;
export type NewCustomOrder = typeof customOrders.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
