"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  priceInCents: number;
  quantity: number;
  size?: string;
  shape?: string;
  imageUrl?: string;
  swatchColor: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const id = `${item.productId}-${item.size ?? ""}-${item.shape ?? ""}`;
        const existing = get().items.find((i) => i.id === id);

        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
            isOpen: true,
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, id }],
            isOpen: true,
          }));
        }
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0),
    }),
    {
      name: "lacquered-cart",
      // Only persist items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
