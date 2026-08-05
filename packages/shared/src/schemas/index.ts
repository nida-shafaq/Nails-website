/**
 * Shared Zod schemas — derived from Drizzle schema types.
 *
 * These schemas are imported by both the Next.js frontend (React Hook Form validation)
 * and the Hono API (request body validation), giving end-to-end type safety without
 * duplication. The pattern: Drizzle schema → TS types → Zod schemas → RHF + Hono.
 */

import { z } from "zod";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const ShapeEnum = z.enum(["Almond", "Coffin", "Square", "Stiletto", "Oval"]);
export const LengthEnum = z.enum(["Short", "Medium", "Long", "XL"]);
export const FinishEnum = z.enum(["Glossy", "Matte", "Chrome", "Glitter", "Jelly"]);
export const SizeEnum = z.enum(["XS", "S", "M", "L", "XL"]);
export const CustomOrderStatusEnum = z.enum([
  "submitted",
  "in_design",
  "ready",
  "shipped",
  "cancelled",
]);
export const PaymentStatusEnum = z.enum(["pending", "paid", "refunded", "failed"]);

// ─── Product ─────────────────────────────────────────────────────────────────

export const ProductSchema = z.object({
  id: z.string().cuid2(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().default(""),
  priceInCents: z.number().int().positive(),
  shapes: z.array(ShapeEnum),
  lengths: z.array(LengthEnum),
  finish: FinishEnum,
  collection: z.string().optional(),
  imageUrls: z.array(z.string().url()),
  swatchColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  customizable: z.boolean().default(false),
  stockQuantity: z.number().int().default(-1),
  active: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const ProductFilterSchema = z.object({
  shape: z.array(ShapeEnum).optional(),
  length: z.array(LengthEnum).optional(),
  finish: z.array(FinishEnum).optional(),
  collection: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(24),
});

// ─── Custom Order ─────────────────────────────────────────────────────────────

const FingerSizeMapSchema = z
  .record(z.string(), SizeEnum)
  .optional();

export const CustomOrderSchema = z.object({
  id: z.string().cuid2(),
  customerName: z.string().min(1).max(200),
  customerEmail: z.string().email(),
  occasion: z.string().max(100).optional(),
  budget: z.string().max(50).optional(),
  deadline: z.string().optional(), // ISO date
  shape: ShapeEnum.optional(),
  fingerSizes: FingerSizeMapSchema,
  notes: z.string().max(2000).optional(),
  referenceImageUrls: z.array(z.string().url()),
  status: CustomOrderStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateCustomOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(200),
  customerEmail: z.string().email("Valid email required"),
  occasion: z.string().max(100).optional(),
  budget: z.string().max(50).optional(),
  deadline: z.string().optional(),
  shape: ShapeEnum.optional(),
  fingerSizes: FingerSizeMapSchema,
  notes: z.string().max(2000).optional(),
  // referenceImageUrls will be added server-side after R2 upload
});

// ─── Order ────────────────────────────────────────────────────────────────────

export const LineItemSchema = z.object({
  productId: z.string(),
  productTitle: z.string(),
  quantity: z.number().int().positive(),
  priceInCents: z.number().int().positive(),
  size: z.string().optional(),
  shape: ShapeEnum.optional(),
});

export const ShippingAddressSchema = z.object({
  name: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().length(2, "Use ISO 3166-1 alpha-2 country code"),
});

export const CreateCheckoutSchema = z.object({
  lineItems: z.array(LineItemSchema).min(1, "Cart cannot be empty"),
  customerEmail: z.string().email().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export const OrderSchema = z.object({
  id: z.string().cuid2(),
  customerEmail: z.string().email(),
  lineItems: z.array(LineItemSchema),
  totalInCents: z.number().int().positive(),
  stripeSessionId: z.string().optional(),
  paymentStatus: PaymentStatusEnum,
  shippingAddress: ShippingAddressSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Review ───────────────────────────────────────────────────────────────────

export const CreateReviewSchema = z.object({
  productId: z.string(),
  customerName: z.string().min(1).max(200),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  // photoUrls added server-side after R2 upload
});

export const ReviewSchema = z.object({
  id: z.string().cuid2(),
  productId: z.string(),
  customerName: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  photoUrls: z.array(z.string().url()),
  verified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type ProductType = z.infer<typeof ProductSchema>;
export type CreateProductType = z.infer<typeof CreateProductSchema>;
export type ProductFilterType = z.infer<typeof ProductFilterSchema>;
export type CustomOrderType = z.infer<typeof CustomOrderSchema>;
export type CreateCustomOrderType = z.infer<typeof CreateCustomOrderSchema>;
export type OrderType = z.infer<typeof OrderSchema>;
export type LineItemType = z.infer<typeof LineItemSchema>;
export type ReviewType = z.infer<typeof ReviewSchema>;
export type CreateReviewType = z.infer<typeof CreateReviewSchema>;
