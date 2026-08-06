import { CustomOrderForm } from "@/components/custom-order/CustomOrderForm";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/MotionWrapper";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Design | NailVibe",
  description: "Request a custom press-on nail design.",
};

export const revalidate = 60; // ISR cache

interface GalleryItem {
  id: string;
  shape?: string;
  notes?: string;
  referenceImageUrls: string[];
}

async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const baseUrl = process.env.NODE_ENV === "development" 
      ? (process.env.API_URL || "http://127.0.0.1:8787")
      : "https://nailvibe-api.nidawasilay.workers.dev";

    const res = await fetch(`${baseUrl}/api/v1/custom-orders/gallery`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Failed to fetch custom gallery:", err);
    return [];
  }
}

export default async function CustomOrderPage() {
  const items = await getGalleryItems();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-site">
        <FadeUp className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest font-mono text-[--color-ink] mb-4">
            Made for you
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-[--color-obsidian] mb-4">
            Completed Custom Designs
          </h1>
          <p className="max-w-xl mx-auto text-[--color-ink] leading-relaxed mb-8">
            Get inspired by our recent hand-painted commissions. Have a specific vision? 
            Upload your inspiration, and our artists will bring it to life.
          </p>
          
          <Link
            href="#request-form"
            className="inline-flex items-center gap-2 badge-premium px-6 py-3 text-sm transition-transform hover:scale-105"
          >
            <Sparkles size={14} />
            Start Your Custom Design
            <ArrowDown size={14} className="ml-1" />
          </Link>
        </FadeUp>

        {/* Gallery Grid */}
        {items.length > 0 && (
          <StaggerContainer className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 mb-24">
            {items.map((item) => (
              <StaggerItem key={item.id} className="break-inside-avoid">
                <div className="group relative rounded-2xl overflow-hidden bg-[--color-mist] shadow-sm">
                  <div className="relative w-full" style={{ paddingBottom: "125%" }}>
                    <Image
                      src={item.referenceImageUrls[0] || "https://placehold.co/600x800/E8E6E1/8B1A3A?text=Custom+Design"}
                      alt={item.notes || "Custom Nail Design"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white font-medium text-sm drop-shadow-md">
                      {item.shape ? `${item.shape} Shape` : "Custom Set"}
                    </p>
                    {item.notes && (
                      <p className="text-white/80 text-xs mt-1 line-clamp-2 drop-shadow-sm font-mono">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div id="request-form" className="scroll-mt-24">
          <FadeUp delay={0.1}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display text-[--color-obsidian] mb-3">Request a Design</h2>
              <p className="text-[--color-ink]">Fill out the form below to get a quote and timeline.</p>
            </div>
            <div className="flex justify-center">
              <CustomOrderForm />
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
