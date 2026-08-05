"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { SwatchDot } from "@/components/shared/SwatchDot";
import { QuickViewModal } from "@/components/products/QuickViewModal";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    priceInCents: number;
    swatchColor: string;
    imageUrl: string;
    shapes: string[];
    finish: string;
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <>
      <div className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)", transition: "box-shadow var(--transition-base), transform var(--transition-base)" }}>
        {/* Quick Add overlay button */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setQuickViewOpen(true);
            }}
            className="bg-white/90 backdrop-blur-sm text-[--color-obsidian] hover:text-[--color-lacquer] hover:bg-white p-2 rounded-full shadow-sm transition-colors"
            aria-label={`Quick view ${product.title}`}
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        <Link
          href={`/shop/${product.slug}`}
          className="flex flex-col h-full outline-none focus-visible:ring-2 focus-visible:ring-[--color-lacquer] focus-visible:ring-offset-2"
        >
          {/* Image */}
          <div className="relative aspect-4/5 overflow-hidden bg-[--color-mist]">
             <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
             {/* Swatch dot — overlaid on image corner */}
            <div className="absolute top-3 left-3 z-10">
              <SwatchDot color={product.swatchColor} size="sm" asDisplay label={product.title} />
            </div>
            {/* Soft gradient at bottom for text contrast if needed */}
             <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(to top, rgba(28,25,23,0.1) 0%, transparent 40%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex justify-between items-start gap-3 mb-1">
              <h3 className="font-medium text-[--color-obsidian] text-base leading-tight truncate group-hover:text-[--color-lacquer] transition-colors">
                {product.title}
              </h3>
              <span className="font-mono text-sm font-medium text-[--color-obsidian] shrink-0">
                {formatPrice(product.priceInCents)}
              </span>
            </div>
            
            <p className="text-xs font-mono tracking-wide text-[--color-ink] mb-4 uppercase mt-1">
              {product.finish} Finish
            </p>

            <div className="mt-auto flex items-center justify-between text-xs text-[--color-ink]">
              <span className="flex items-center gap-1">
                <Star size={12} fill="var(--color-gilded)" stroke="none" />
                <span className="font-mono">4.9</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider">{product.shapes.length} Shapes</span>
            </div>
          </div>
        </Link>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
