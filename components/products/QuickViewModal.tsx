"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SwatchDot } from "@/components/shared/SwatchDot";
import { useCartStore } from "@/lib/store";
import { useSavedSize, NailSize } from "@/hooks/useSavedSize";
import { formatPrice } from "@/lib/utils";

// In production, this would be imported from shared schema
const SIZES: NailSize[] = ["XS", "S", "M", "L", "XL"];
const SHAPES = ["Almond", "Coffin", "Square", "Stiletto", "Oval"];

interface QuickViewModalProps {
  product: {
    id: string;
    slug: string;
    title: string;
    priceInCents: number;
    swatchColor: string;
    imageUrl: string;
    shapes: string[];
    description?: string;
  };
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const { primarySize } = useSavedSize();

  const [selectedShape, setSelectedShape] = useState<string>(product.shapes[0] ?? SHAPES[0]);
  const [selectedSize, setSelectedSize] = useState<NailSize | null>(primarySize);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addItem({
      productId: product.id,
      title: product.title,
      priceInCents: product.priceInCents,
      quantity: 1,
      size: selectedSize,
      shape: selectedShape,
      imageUrl: product.imageUrl,
      swatchColor: product.swatchColor,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-[--color-obsidian] opacity-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className="relative z-10 w-full max-w-4xl bg-[--color-pearl] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left: Image (takes half width on desktop) */}
        <div className="md:w-1/2 relative bg-[--color-mist] h-64 md:h-auto">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Right: Details & Add to Cart */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col">
          <button 
            type="button" 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[--color-mist] text-[--color-obsidian] hover:bg-black/5 transition-colors z-20"
            aria-label="Close"
          >
             <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="mb-6 pr-8">
            <h2 id="quick-view-title" className="text-3xl font-display text-[--color-obsidian] mb-1">
              {product.title}
            </h2>
            <div className="flex items-center gap-3">
              <SwatchDot color={product.swatchColor} size="sm" asDisplay />
              <span className="font-mono text-sm text-[--color-obsidian] font-medium">
                {formatPrice(product.priceInCents)}
              </span>
            </div>
            {product.description && (
              <p className="mt-4 text-sm text-[--color-ink] leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="space-y-6 flex-1">
            {/* Shape Selection */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-xs uppercase tracking-widest font-mono text-[--color-ink]">Shape</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.shapes.length > 0 ? product.shapes : SHAPES).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setSelectedShape(shape)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedShape === shape 
                        ? "border-[--color-obsidian] bg-[--color-obsidian] text-white" 
                        : "border-[--color-chrome] text-[--color-obsidian] hover:border-[--color-obsidian]"
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
               <div className="flex justify-between items-end mb-3">
                <span className="text-xs uppercase tracking-widest font-mono text-[--color-ink]">Size</span>
                <a href="/sizing" className="text-xs text-[--color-lacquer] underline underline-offset-2">Find your size</a>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border rounded-md text-sm font-mono transition-colors ${
                      selectedSize === size 
                        ? "border-[--color-lacquer] text-[--color-lacquer] bg-[--color-lacquer-tint]" 
                        : "border-[--color-chrome] text-[--color-obsidian] hover:border-[--color-obsidian]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {primarySize && (
                <p className="text-xs text-[--color-ink] mt-2 italic flex items-center gap-1.5">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  Showing your saved size
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[--color-chrome]">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="btn-lacquer w-full py-4 text-sm"
            >
              {selectedSize ? "Add to Bag" : "Select a Size"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
