import React from "react";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { SwatchDot } from "@/components/shared/SwatchDot";

const SEASON_SWATCHES = [
  { color: "#8B1A3A", name: "Cherry Noir" },
  { color: "#2C1B3E", name: "Midnight Fig" },
  { color: "#C9963E", name: "Gilt Hour" },
  { color: "#4A3728", name: "Espresso" },
  { color: "#D4788E", name: "Blush Nude" },
  { color: "#1A2E3E", name: "Abyss" },
];

const FOOTER_LINKS = {
  Shop: [
    { href: "/products", label: "All Nail Sets" },
    { href: "/products?finish=Glossy", label: "Glossy Finishes" },
    { href: "/products?finish=Matte", label: "Matte Finishes" },
    { href: "/products?finish=Chrome", label: "Chrome Finishes" },
    { href: "/products?collection=bridal", label: "Bridal Collection" },
  ],
  Services: [
    { href: "/custom", label: "Custom Design" },
    { href: "/sizing", label: "Find Your Size" },
    { href: "/products?collection=kits", label: "Starter Kits" },
  ],
  Support: [
    { href: "/care", label: "Nail Care Guide" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact Us" },
    { href: "/shipping", label: "Shipping & Returns" },
  ],
};

export function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{ backgroundColor: "var(--color-slate)", color: "rgba(247,243,238,0.8)" }}
      role="contentinfo"
    >
      {/* Season palette strip */}
      <div
        className="border-b flex items-center gap-3 px-6 py-4 overflow-x-auto"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
        aria-label="Current season palette"
      >
        <span
          className="text-xs uppercase tracking-widest shrink-0 mr-2"
          style={{ fontFamily: "var(--font-mono)", color: "rgba(247,243,238,0.4)" }}
        >
          AW&apos;26 Palette
        </span>
        {SEASON_SWATCHES.map((s) => (
          <div key={s.color} className="flex flex-col items-center gap-1.5 shrink-0">
            <SwatchDot color={s.color} size="sm" label={s.name} asDisplay />
          </div>
        ))}
      </div>

      {/* Main footer content */}
      <div className="container-site py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <span
            className="text-2xl tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, color: "var(--color-pearl)" }}
          >
            NailVibe
          </span>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(247,243,238,0.6)" }}>
            Handcrafted press-on nails made with intention. Each set is designed and finished
            by hand in small batches.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a
              href="https://instagram.com/nailvibe"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              aria-label="NailVibe on Instagram"
            >
              <ArrowUpRight size={16} />
            </a>
            <a
              href="mailto:hello@nailvibe.co"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              aria-label="Email NailVibe"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Navigation columns */}
        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
          <div key={category} className="flex flex-col gap-3">
            <h3
              className="text-xs uppercase tracking-widest mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(247,243,238,0.4)" }}
            >
              {category}
            </h3>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "rgba(247,243,238,0.7)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-5"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(247,243,238,0.35)" }}
          >
            © {new Date().getFullYear()} NailVibe. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Accessibility"].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase().replace(/ /g, "-")}`}
                className="text-xs transition-colors hover:text-white"
                style={{ color: "rgba(247,243,238,0.4)" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
