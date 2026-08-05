import { Hono } from "hono";
import { eq, avg, count } from "drizzle-orm";
import type { HonoContext } from "../index";
import { reviews } from "../db/schema";
import { CreateReviewSchema } from "@lacquered/shared";

const router = new Hono<HonoContext>();

/**
 * GET /api/v1/reviews/:productId
 * Returns reviews for a product with aggregated rating.
 */
router.get("/:productId", async (c) => {
  const db = c.get("db");
  const productId = c.req.param("productId");

  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(reviews.createdAt);

  const [stats] = await db
    .select({
      avgRating: avg(reviews.rating),
      totalReviews: count(reviews.id),
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  return c.json({
    data: rows,
    meta: {
      averageRating: stats?.avgRating ? parseFloat(String(stats.avgRating)).toFixed(1) : null,
      totalReviews: stats?.totalReviews ?? 0,
    },
  });
});

export { router as reviewsRouter };
