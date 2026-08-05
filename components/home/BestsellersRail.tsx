import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { SwatchDot } from "@/components/shared/SwatchDot";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/MotionWrapper";
import { formatPrice } from "@/lib/utils";

/**
 * Mock bestseller data — in production this is fetched from
 * GET /api/v1/products?collection=bestseller&limit=8
 */
const BESTSELLERS = [
  {
    id: "p1",
    slug: "cherry-noir-coffin",
    title: "Cherry Noir",
    subtitle: "Coffin — Glossy",
    priceInCents: 2800,
    swatchColor: "#8B1A3A",
    imageUrl: "/images/products/cherry-noir.png",
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: "p2",
    slug: "midnight-fig-almond",
    title: "Midnight Fig",
    subtitle: "Almond — Matte",
    priceInCents: 2600,
    swatchColor: "#2C1B3E",
    imageUrl: "/images/products/midnight-fig.png",
    rating: 4.8,
    reviewCount: 218,
  },
  {
    id: "p3",
    slug: "gilt-hour-stiletto",
    title: "Gilt Hour",
    subtitle: "Stiletto — Chrome",
    priceInCents: 3200,
    swatchColor: "#C9963E",
    imageUrl: "/images/products/gilt-hour.png",
    rating: 4.9,
    reviewCount: 178,
  },
  {
    id: "p4",
    slug: "ash-rose-square",
    title: "Ash Rose",
    subtitle: "Square — Glossy",
    priceInCents: 2400,
    swatchColor: "#B8A898",
    imageUrl: "/images/products/ash-rose.png",
    rating: 4.7,
    reviewCount: 143,
  },
  {
    id: "p5",
    slug: "espresso-oval",
    title: "Espresso",
    subtitle: "Oval — Matte",
    priceInCents: 2600,
    swatchColor: "#4A3728",
    imageUrl: "/images/products/espresso.png",
    rating: 4.8,
    reviewCount: 97,
  },
  {
    id: "p6",
    slug: "abyss-coffin",
    title: "Abyss",
    subtitle: "Coffin — Glitter",
    priceInCents: 2900,
    swatchColor: "#1A2E3E",
    imageUrl: "/images/products/abyss.png",
    rating: 4.9,
    reviewCount: 201,
  },
];

interface ProductRailCardProps {
  product: (typeof BESTSELLERS)[number];
}

function ProductRailCard({ product }: ProductRailCardProps) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="product-card group shrink-0 w-56 md:w-64"
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-label={`${product.title} — ${product.subtitle}, ${formatPrice(product.priceInCents)}`}
    >
      {/* Image */}
      <div
        className="relative h-64 overflow-hidden"
        style={{ backgroundColor: "var(--color-mist)" }}
      >
        <Image
          src={product.imageUrl}
          alt={`${product.title} nail set`}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 224px, 256px"
        />
        {/* Swatch dot — overlaid on image corner */}
        <div className="absolute top-3 left-3">
          <SwatchDot color={product.swatchColor} size="sm" asDisplay label={product.title} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="font-medium text-sm leading-snug"
              style={{ color: "var(--color-obsidian)" }}
            >
              {product.title}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
            >
              {product.subtitle}
            </p>
          </div>
          <span
            className="text-sm font-medium shrink-0"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-obsidian)" }}
          >
            {formatPrice(product.priceInCents)}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-3">
          <Star
            size={11}
            fill="var(--color-gilded)"
            stroke="none"
            aria-hidden="true"
          />
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
          >
            {product.rating} ({product.reviewCount})
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BestsellersRail() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="bestsellers-heading">
      {/* Section header */}
      <FadeUp className="container-site flex items-end justify-between mb-8">
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
          >
            Most loved
          </p>
          <h2
            id="bestsellers-heading"
            className="text-4xl md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              color: "var(--color-obsidian)",
            }}
          >
            Shop Bestsellers
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:flex items-center gap-1.5 text-sm font-medium hover:gap-3 transition-all"
          style={{ color: "var(--color-lacquer)" }}
        >
          View all
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </FadeUp>

      {/* Horizontal scroll rail */}
      <div className="scroll-rail">
        {BESTSELLERS.map((product, i) => (
          <StaggerItem key={product.id}>
            <ProductRailCard product={product} />
          </StaggerItem>
        ))}
      </div>

      {/* Mobile "view all" */}
      <div className="container-site mt-6 md:hidden">
        <Link
          href="/shop"
          className="btn-ghost w-full justify-center"
        >
          View All Sets
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
