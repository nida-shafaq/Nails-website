import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FadeUp } from "@/components/shared/MotionWrapper";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container-site">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-[--color-ink] hover:text-[--color-lacquer] mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back to Shop
        </Link>
        <FadeUp>
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-display text-[--color-obsidian] mb-4">
              Product Details: {slug}
            </h1>
            <p className="text-[--color-ink] leading-relaxed mb-8">
              This is a placeholder page for the individual product view. The full product details, 
              image gallery, size selector, and "Add to Cart" functionality will be built here!
            </p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
