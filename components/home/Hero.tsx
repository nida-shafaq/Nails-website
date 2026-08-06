"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SwatchStrip } from "@/components/shared/SwatchDot";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Seasonal swatches shown in the hero strip.
 * These are the "real" polish colors from the AW'26 collection —
 * the hero's signature visual anchor instead of generic numbered steps.
 */
const HERO_SWATCHES = [
  { color: "#8B1A3A", name: "Cherry Noir" },
  { color: "#2C1B3E", name: "Midnight Fig" },
  { color: "#C9963E", name: "Gilt Hour" },
  { color: "#4A3728", name: "Espresso" },
  { color: "#D4788E", name: "Blush Nude" },
  { color: "#1A2E3E", name: "Abyss" },
  { color: "#7B4F3A", name: "Terracotta (Nail)" },
  { color: "#B8A898", name: "Ash Rose" },
];

/**
 * Hero — Full-bleed orchestrated load-in sequence.
 *
 * Animation choreography (respects prefers-reduced-motion):
 * 1. Image fades in (0–0.8s)
 * 2. Headline slides up from below (0.3s delay)
 * 3. Subheadline fades in (0.5s delay)
 * 4. CTA slides up (0.65s delay)
 * 5. Swatch strip reveals left-to-right (0.8s delay, staggered dots)
 *
 * Parallax: the background image scrolls at 0.4x speed for depth.
 */
export function Hero() {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const transition = (delay: number) => ({
    duration: prefersReduced ? 0.01 : 0.7,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay: prefersReduced ? 0 : delay,
  });

  return (
    <section
      ref={containerRef}
      className="relative min-h-dvh flex flex-col overflow-hidden"
      aria-label="Hero — NailVibe Press-On Nails"
    >
      {/* Full-bleed background image with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: prefersReduced ? 0 : imageY }}
        aria-hidden="true"
      >
        <Image
          src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1800&q=85"
          alt="Close-up of manicured hands with glossy wine-red press-on nails"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay: dark at bottom for text, subtle at top */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(28, 25, 23, 0.15) 0%,
              rgba(28, 25, 23, 0.05) 30%,
              rgba(28, 25, 23, 0.45) 70%,
              rgba(28, 25, 23, 0.78) 100%
            )`,
          }}
        />
      </motion.div>

      {/* Content — positioned in lower third of viewport */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-16 md:pb-24">
        <div className="container-site">
          {/* Pre-headline label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition(0.2)}
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(247,243,238,0.7)" }}
          >
            Autumn/Winter Collection — AW&apos;26
          </motion.p>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: prefersReduced ? 0 : 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.3)}
            className="text-white mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(3rem, 8vw, 6rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              maxWidth: "14ch",
            }}
          >
            Nails that tell
            <em
              className="block not-italic"
              style={{
                fontStyle: "italic",
                color: "var(--color-lacquer-muted)",
              }}
            >
              your story
            </em>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.5)}
            className="text-sm md:text-base max-w-sm leading-relaxed mb-8"
            style={{ color: "rgba(247,243,238,0.75)" }}
          >
            Handcrafted press-ons in every shape and finish.
            Found in minutes, worn for weeks.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.65)}
            className="flex flex-wrap items-center gap-3 mb-12"
          >
            <Link href="/shop" className="btn-lacquer gap-2 py-3.5 px-6 text-sm">
              Shop the Collection
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              href="/custom"
              className="btn-ghost border-white/40 text-white hover:border-white hover:text-white py-3.5 px-6 text-sm"
            >
              Design Custom Set
            </Link>
          </motion.div>

          {/* ── Swatch Strip — the hero's signature visual anchor ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition(0.85)}
          >
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(247,243,238,0.45)" }}
            >
              AW&apos;26 Palette
            </p>
            <SwatchStrip
              swatches={HERO_SWATCHES}
              size="lg"
              gap="gap-4"
              className="flex-nowrap overflow-x-auto pb-1"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-6 right-6 md:right-10 z-10 flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <span
          className="text-[0.55rem] uppercase tracking-widest writing-mode-vertical"
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(247,243,238,0.4)",
            writingMode: "vertical-rl",
            letterSpacing: "0.15em",
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, rgba(247,243,238,0.5), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
