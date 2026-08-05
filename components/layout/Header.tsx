"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom" },
  { href: "/sizing", label: "Find Your Size" },
  { href: "/shop?collection=bridal", label: "Bridal" },
];

/**
 * Header — Glass-morphism header that transitions from transparent (hero overlap)
 * to solid on scroll. The cart badge uses the signature lacquer accent.
 *
 * Mobile: Hamburger nav slides in from left with staggered link reveal.
 * Desktop: Horizontal nav with understated hover underlines.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleCart, totalItems } = useCartStore();
  const itemCount = totalItems();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "glass shadow-[0_1px_0_rgba(212,208,204,0.5)]"
            : "bg-transparent"
        )}
      >
        <div className="container-site flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="NailVibe — go to homepage"
          >
            <span
              className="text-[1.6rem] tracking-[-0.04em] leading-none select-none"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--color-obsidian)" }}
            >
              NailVibe
            </span>
            <span
              className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
              style={{ backgroundColor: "var(--color-lacquer)" }}
              aria-hidden="true"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium tracking-wide group"
                style={{ color: "var(--color-obsidian)", letterSpacing: "0.04em" }}
              >
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: "var(--color-lacquer)" }}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Custom order CTA — premium */}
            <Link
              href="/custom"
              className="hidden md:inline-flex items-center gap-1.5 badge-premium"
              aria-label="Book a custom nail design"
            >
              <Sparkles size={10} aria-hidden="true" />
              Custom Design
            </Link>

            {/* Cart */}
            <button
              id="cart-open-button"
              type="button"
              onClick={toggleCart}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[--color-mist] transition-colors"
              aria-label={`Shopping bag, ${itemCount} items`}
              style={{ color: "var(--color-obsidian)" }}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full text-white text-[0.6rem] font-bold flex items-center justify-center leading-none"
                    style={{ backgroundColor: "var(--color-lacquer)", minWidth: "1.1rem", height: "1.1rem" }}
                    aria-hidden="true"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-[--color-mist] transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              style={{ color: "var(--color-obsidian)" }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              style={{ backgroundColor: "rgba(28, 25, 23, 0.5)" }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.nav
              key="mobile-nav"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 bottom-0 w-72 z-50 flex flex-col pt-20 pb-8 px-6 gap-2"
              style={{ backgroundColor: "var(--color-pearl)", boxShadow: "var(--shadow-modal)" }}
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-2xl font-light border-b border-[--color-chrome]"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-obsidian)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <Link
                  href="/custom"
                  onClick={() => setMobileOpen(false)}
                  className="badge-premium text-sm px-4 py-2 inline-flex"
                >
                  <Sparkles size={12} aria-hidden="true" />
                  Book Custom Design
                </Link>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
