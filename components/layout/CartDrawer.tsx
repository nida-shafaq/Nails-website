"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { SwatchDot } from "@/components/shared/SwatchDot";

/**
 * CartDrawer — Slide-out cart from the right edge.
 *
 * Design decisions:
 * - Uses an overlay backdrop + spring animation for a tactile feel
 * - Each line item shows the polish swatch color so the cart is visually distinct
 *   from a generic list — grounded in the product's color identity
 * - Empty state has an illustration voice that matches the brand tone
 * - Checkout button is the full-width lacquer CTA
 */
export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const total = totalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(28, 25, 23, 0.55)" }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-md"
            style={{
              backgroundColor: "var(--color-pearl)",
              boxShadow: "var(--shadow-modal)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "var(--color-chrome)" }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} style={{ color: "var(--color-obsidian)" }} />
                <h2
                  className="text-lg tracking-tight"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-obsidian)" }}
                >
                  Your Bag
                </h2>
                {items.length > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--color-lacquer)",
                      color: "white",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {items.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[--color-mist] transition-colors"
                aria-label="Close cart"
                style={{ color: "var(--color-obsidian)" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
                {/* Empty state illustration — swatch cluster */}
                <div className="flex items-end gap-1.5">
                  {["#D4D0CC", "#C4788E", "#2E2926"].map((c, i) => (
                    <div
                      key={c}
                      className="rounded-full animate-float"
                      style={{
                        width: `${1.5 + i * 0.5}rem`,
                        height: `${1.5 + i * 0.5}rem`,
                        backgroundColor: c,
                        animationDelay: `${i * 0.3}s`,
                        opacity: 0.6 + i * 0.2,
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div>
                  <p
                    className="text-2xl mb-2"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-obsidian)" }}
                  >
                    Your bag is bare
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-ink)" }}>
                    Let&apos;s change that. Find a set that speaks to you.
                  </p>
                </div>
                <Link href="/shop" onClick={closeCart} className="btn-lacquer">
                  Browse Nail Sets
                </Link>
              </div>
            ) : (
              <>
                {/* Item list */}
                <ul className="flex-1 overflow-y-auto divide-y divide-[--color-chrome]">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      className="flex gap-4 p-5"
                    >
                      {/* Product image */}
                      <div
                        className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative"
                        style={{ backgroundColor: "var(--color-mist)" }}
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <SwatchDot color={item.swatchColor} size="md" asDisplay />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className="text-sm font-medium leading-snug truncate pr-2"
                            style={{ color: "var(--color-obsidian)" }}
                          >
                            {item.title}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="shrink-0 w-6 h-6 flex items-center justify-center rounded opacity-40 hover:opacity-100 transition-opacity"
                            aria-label={`Remove ${item.title} from cart`}
                            style={{ color: "var(--color-obsidian)" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {(item.size || item.shape) && (
                          <p
                            className="text-xs mt-0.5"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink)" }}
                          >
                            {[item.shape, item.size].filter(Boolean).join(" · ")}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity stepper */}
                          <div
                            className="flex items-center gap-0 rounded-full border"
                            style={{ borderColor: "var(--color-chrome)" }}
                          >
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-l-full hover:bg-[--color-mist] transition-colors"
                              aria-label={`Decrease quantity of ${item.title}`}
                              style={{ color: "var(--color-obsidian)" }}
                            >
                              <Minus size={12} />
                            </button>
                            <span
                              className="w-7 text-center text-sm select-none"
                              style={{ fontFamily: "var(--font-mono)", color: "var(--color-obsidian)" }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-r-full hover:bg-[--color-mist] transition-colors"
                              aria-label={`Increase quantity of ${item.title}`}
                              style={{ color: "var(--color-obsidian)" }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span
                            className="text-sm font-medium"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--color-obsidian)" }}
                          >
                            {formatPrice(item.priceInCents * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                {/* Footer — total + checkout */}
                <div
                  className="border-t p-6 flex flex-col gap-4"
                  style={{ borderColor: "var(--color-chrome)" }}
                >
                  {/* "Complete the look" cross-sell hint */}
                  <div
                    className="p-3 rounded-lg text-xs flex items-center gap-2"
                    style={{ backgroundColor: "var(--color-lacquer-tint)", color: "var(--color-lacquer)" }}
                  >
                    <span>✦</span>
                    <span>Add a nail care kit — adhesive, file, and cuticle oil</span>
                    <Link href="/shop?collection=kits" onClick={closeCart} className="ml-auto underline shrink-0">
                      Add
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--color-ink)" }}>
                      Subtotal
                    </span>
                    <span
                      className="text-lg font-medium"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--color-obsidian)" }}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>

                  <p className="text-xs text-center" style={{ color: "var(--color-ink)" }}>
                    Shipping + taxes calculated at checkout
                  </p>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="btn-lacquer justify-between w-full text-base"
                  >
                    Checkout
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={closeCart}
                    className="btn-ghost w-full text-sm py-2.5"
                    style={{ borderColor: "var(--color-chrome)" }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
