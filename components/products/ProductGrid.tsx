"use client";

import React, { useMemo, Suspense } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";

const MOCK_PRODUCTS = [
  {
    id: "p1",
    slug: "cherry-noir-coffin",
    title: "Cherry Noir",
    priceInCents: 2800,
    swatchColor: "#8B1A3A",
    imageUrl: "/images/products/cherry-noir.png",
    shapes: ["Coffin", "Almond", "Square"],
    lengths: ["Medium", "Long", "XL"],
    finish: "Glossy",
  },
  {
    id: "p2",
    slug: "midnight-fig-almond",
    title: "Midnight Fig",
    priceInCents: 2600,
    swatchColor: "#2C1B3E",
    imageUrl: "/images/products/midnight-fig.png",
    shapes: ["Almond", "Stiletto"],
    lengths: ["Short", "Medium"],
    finish: "Matte",
  },
  {
    id: "p3",
    slug: "gilt-hour-stiletto",
    title: "Gilt Hour",
    priceInCents: 3200,
    swatchColor: "#C9963E",
    imageUrl: "/images/products/gilt-hour.png",
    shapes: ["Stiletto", "Coffin"],
    lengths: ["Long", "XL"],
    finish: "Chrome",
  },
  {
    id: "p4",
    slug: "ash-rose-square",
    title: "Ash Rose",
    priceInCents: 2400,
    swatchColor: "#B8A898",
    imageUrl: "/images/products/ash-rose.png",
    shapes: ["Square", "Oval", "Almond"],
    lengths: ["Short", "Medium", "Long"],
    finish: "Glossy",
  },
  {
    id: "p5",
    slug: "espresso-oval",
    title: "Espresso",
    priceInCents: 2600,
    swatchColor: "#4A3728",
    imageUrl: "/images/products/espresso.png",
    shapes: ["Oval", "Almond", "Square"],
    lengths: ["Short", "Medium"],
    finish: "Matte",
  },
  {
    id: "p6",
    slug: "abyss-coffin",
    title: "Abyss",
    priceInCents: 2900,
    swatchColor: "#1A2E3E",
    imageUrl: "/images/products/abyss.png",
    shapes: ["Coffin", "Square", "Stiletto"],
    lengths: ["Medium", "Long", "XL"],
    finish: "Glitter",
  },
  {
    id: "p7",
    slug: "bridal-pearl-cascade",
    title: "Pearl Cascade",
    priceInCents: 4500,
    swatchColor: "#F5F5DC",
    imageUrl: "/images/products/bridal-pearl-cascade.png",
    shapes: ["Almond", "Oval"],
    lengths: ["Short", "Medium", "Long"],
    finish: "Glossy",
    collection: "bridal",
  },
  {
    id: "p8",
    slug: "bridal-blush-elegance",
    title: "Blush Elegance",
    priceInCents: 3800,
    swatchColor: "#FADADD",
    imageUrl: "/images/products/bridal-blush-elegance.png",
    shapes: ["Coffin", "Square"],
    lengths: ["Medium", "Long"],
    finish: "Matte",
    collection: "bridal",
  },
  {
    id: "p9",
    slug: "bridal-lace-aura",
    title: "Lace Aura",
    priceInCents: 5200,
    swatchColor: "#FFFFFF",
    imageUrl: "/images/products/bridal-lace-aura.png",
    shapes: ["Stiletto", "Almond"],
    lengths: ["Medium", "Long", "XL"],
    finish: "Chrome",
    collection: "bridal",
  },
  {
    id: "p10",
    slug: "pink-bow-elegance",
    title: "Pink Bow Elegance",
    priceInCents: 4500,
    swatchColor: "#D87A8F",
    imageUrl: "/images/products/bridal-4.png",
    shapes: ["Almond", "Oval"],
    lengths: ["Short", "Medium", "Long"],
    finish: "Glossy",
    collection: "bridal",
  },
  {
    id: "p11",
    slug: "ruby-polka",
    title: "Ruby Polka",
    priceInCents: 3800,
    swatchColor: "#800000",
    imageUrl: "/images/products/bridal-5.png",
    shapes: ["Coffin", "Square"],
    lengths: ["Medium", "Long"],
    finish: "Glossy",
    collection: "bridal",
  },
  {
    id: "p12",
    slug: "golden-mehndi",
    title: "Golden Mehndi",
    priceInCents: 5200,
    swatchColor: "#D4AF37",
    imageUrl: "/images/products/bridal-6.png",
    shapes: ["Stiletto", "Almond"],
    lengths: ["Long", "XL"],
    finish: "Glitter",
    collection: "bridal",
  },
];

interface ProductGridProps {
  collection?: string;
}

function ProductGridContent({ collection }: ProductGridProps) {
  const [selectedShape] = useQueryState("shape", parseAsString);
  const [selectedFinish] = useQueryState("finish", parseAsString);
  const [selectedLength] = useQueryState("length", parseAsString);

  const filteredProducts = useMemo(() => {
    let list = collection 
      ? MOCK_PRODUCTS.filter(p => p.collection === collection)
      : MOCK_PRODUCTS;

    if (selectedShape) {
      const activeShape = selectedShape.toLowerCase().trim();
      list = list.filter(p => p.shapes.some(s => s.toLowerCase().trim() === activeShape));
    }
    
    if (selectedFinish) {
      const activeFinish = selectedFinish.toLowerCase().trim();
      list = list.filter(p => p.finish.toLowerCase().trim() === activeFinish);
    }
    
    if (selectedLength) {
      const activeLength = selectedLength.toLowerCase().trim();
      list = list.filter(p => p.lengths?.some(l => l.toLowerCase().trim() === activeLength));
    }

    console.log({ 
      selectedLength, 
      selectedShape,
      selectedFinish,
      totalProducts: MOCK_PRODUCTS.length, 
      filteredCount: list.length 
    });

    return list;
  }, [collection, selectedShape, selectedFinish, selectedLength]);

  return (
    <section className="py-12 md:py-20" aria-label="Product Catalog">
      <div className="container-site flex flex-col lg:flex-row gap-12">
        {/* Filters sidebar */}
        <ProductFilters />

        {/* Main grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-display text-[--color-obsidian] capitalize">
              {collection ? `${collection} Collection` : "All Nail Sets"}
            </h1>
            <span className="text-sm font-mono text-[--color-ink]">
              {filteredProducts.length} results
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-dashed border-[--color-chrome] rounded-2xl bg-white/50">
              <h3 className="text-xl font-display text-[--color-obsidian] mb-2">No products found</h3>
              <p className="text-[--color-ink] mb-6">There are no products matching your selected filters.</p>
              <button 
                onClick={() => window.history.replaceState(null, '', window.location.pathname)}
                className="px-6 py-2 bg-[--color-obsidian] text-white rounded-full text-sm hover:bg-black transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ProductGrid(props: ProductGridProps) {
  return (
    <Suspense fallback={<div className="h-screen animate-pulse bg-[--color-mist]" />}>
      <ProductGridContent {...props} />
    </Suspense>
  );
}
