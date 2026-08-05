"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * SwatchDot — The Signature Element
 *
 * A glossy circular paint swatch that serves as the structural motif across the entire site:
 * - Filter chips on the product catalog
 * - Color picker on PDPs
 * - Seasonal palette strip on the hero
 * - Rating indicators
 * - Any context where a real polish color needs to be represented
 *
 * Design decisions:
 * - The radial-gradient "sheen" overlay simulates light on a freshly lacquered nail.
 *   On hover, the sheen position shifts — this is the ONE memorable motion on the site,
 *   kept deliberately sparse so it stays impactful.
 * - aria-pressed indicates selected state for filter chips (accessibility).
 * - The dot size scales via size prop rather than className overrides to keep the
 *   pseudo-element sizing consistent.
 */

type SwatchSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface SwatchDotProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The actual hex color of the polish shade */
  color: string;
  /** Dot size */
  size?: SwatchSize;
  /** Whether this swatch is currently selected (for filter chips) */
  selected?: boolean;
  /** Accessible label for the color — shown as tooltip and used for aria-label */
  label?: string;
  /** If true, renders as a div (non-interactive display) */
  asDisplay?: boolean;
  /** Additional className */
  className?: string;
}

const sizeClasses: Record<SwatchSize, string> = {
  xs:  "w-4 h-4",
  sm:  "w-6 h-6",
  md:  "w-8 h-8",
  lg:  "w-11 h-11",
  xl:  "w-16 h-16",
  "2xl": "w-22 h-22",
};

export function SwatchDot({
  color,
  size = "md",
  selected = false,
  label,
  asDisplay = false,
  className,
  ...props
}: SwatchDotProps) {
  const sharedStyle = {
    backgroundColor: color,
  } as React.CSSProperties;

  const sharedClassName = cn(
    "swatch-dot",
    sizeClasses[size],
    selected && "ring-2 ring-offset-2 ring-[--color-obsidian]",
    className
  );

  if (asDisplay) {
    return (
      <div
        role="img"
        aria-label={label ?? `Color swatch: ${color}`}
        title={label}
        className={sharedClassName}
        style={sharedStyle}
      />
    );
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={label ?? `Filter by color ${color}`}
      title={label}
      className={sharedClassName}
      style={sharedStyle}
      {...props}
    />
  );
}

/**
 * SwatchStrip — A horizontal row of swatch dots, used in the hero
 * to show the season's real palette as the visual anchor.
 */
interface SwatchStripProps {
  swatches: Array<{ color: string; name: string }>;
  size?: SwatchSize;
  className?: string;
  gap?: string;
}

export function SwatchStrip({ swatches, size = "lg", className, gap = "gap-3" }: SwatchStripProps) {
  return (
    <div
      role="list"
      aria-label="Seasonal color palette"
      className={cn("flex items-center flex-wrap", gap, className)}
    >
      {swatches.map((swatch) => (
        <div key={swatch.color} role="listitem" className="flex flex-col items-center gap-1.5">
          <SwatchDot
            color={swatch.color}
            size={size}
            label={swatch.name}
            asDisplay
          />
          <span
            className="text-center leading-none"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-ink)",
            }}
          >
            {swatch.name}
          </span>
        </div>
      ))}
    </div>
  );
}
