import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/MotionWrapper";

/**
 * UGC-style customer gallery.
 *
 * Layout: asymmetric masonry-inspired grid — 2 cols on mobile, 3 cols + a tall featured
 * cell on desktop. Avoids the uniform boxy card grid listed as a design anti-pattern.
 *
 * In production: these images come from the reviews table (photo_urls, verified flag).
 */
const UGC_PHOTOS = [
  {
    id: "ugc1",
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80",
    alt: "Customer wearing Cherry Noir coffin press-ons at a dinner party",
    author: "@nailsbyavia",
    rating: 5,
    caption: "Wore these for two weeks straight — zero chips.",
    featured: true,
  },
  {
    id: "ugc2",
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80",
    alt: "Close-up of Midnight Fig almond nails on piano keys",
    author: "@margaux.nails",
    rating: 5,
    caption: "The matte finish is *chef's kiss*",
    featured: false,
  },
  {
    id: "ugc3",
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80",
    alt: "Bridal set — Ash Rose square nails with engagement ring",
    author: "@thebridaltable",
    rating: 5,
    caption: "Perfect for my wedding day 💍",
    featured: false,
  },
  {
    id: "ugc4",
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80",
    alt: "Gilt Hour chrome stiletto nails catching the light",
    author: "@goldenhourgal",
    rating: 5,
    caption: "Everyone asks where I got them",
    featured: false,
  },
  {
    id: "ugc5",
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80",
    alt: "Espresso oval nails with a flat white coffee",
    author: "@coffeehours_",
    rating: 4,
    caption: "Finally found my perfect everyday nail",
    featured: false,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={10}
          fill={i < count ? "var(--color-gilded)" : "var(--color-chrome)"}
          stroke="none"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function UGCGallery() {
  const [featured, ...rest] = UGC_PHOTOS;

  return (
    <section className="py-16 md:py-24" aria-labelledby="ugc-heading">
      <FadeUp className="container-site mb-10">
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
        >
          Real nails, real people
        </p>
        <h2
          id="ugc-heading"
          className="text-4xl md:text-5xl"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            color: "var(--color-obsidian)",
          }}
        >
          The Community
        </h2>
      </FadeUp>

      {/* Asymmetric grid */}
      <StaggerContainer className="container-site grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4">
        {/* Featured — spans 2 rows on desktop */}
        <StaggerItem className="col-span-2 md:col-span-2 md:row-span-2">
          <div
            className="relative rounded-2xl overflow-hidden group h-72 md:h-full min-h-95"
            style={{ backgroundColor: "var(--color-mist)" }}
          >
            <Image
              src={featured.src}
              alt={featured.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-103"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(28,25,23,0.75) 0%, transparent 50%)",
              }}
              aria-hidden="true"
            />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <Quote
                size={18}
                style={{ color: "var(--color-lacquer-muted)" }}
                className="mb-2"
                aria-hidden="true"
              />
              <p className="text-white text-sm font-medium mb-2 leading-snug">
                &ldquo;{featured.caption}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <StarRating count={featured.rating} />
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "rgba(247,243,238,0.6)" }}
                >
                  {featured.author}
                </span>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Remaining photos */}
        {rest.map((photo) => (
          <StaggerItem key={photo.id}>
            <div
              className="relative rounded-xl overflow-hidden group h-40 md:h-full min-h-40"
              style={{ backgroundColor: "var(--color-mist)" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(to top, rgba(28,25,23,0.7) 0%, transparent 60%)",
                }}
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <p
                  className="text-white text-xs font-medium leading-snug mb-1"
                >
                  &ldquo;{photo.caption}&rdquo;
                </p>
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "rgba(247,243,238,0.6)" }}
                >
                  {photo.author}
                </span>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* CTA to tag on Instagram */}
      <FadeUp delay={0.3} className="container-site mt-8 text-center">
        <p className="text-sm" style={{ color: "var(--color-ink)" }}>
          Tag us{" "}
          <a
            href="https://instagram.com/nailvibe"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline decoration-dotted underline-offset-3"
            style={{ color: "var(--color-lacquer)" }}
          >
            @nailvibe
          </a>{" "}
          to be featured here.
        </p>
      </FadeUp>
    </section>
  );
}
