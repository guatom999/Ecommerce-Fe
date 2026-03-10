import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id,
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, qty: item.qty + qty }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { product, qty }] };
        });
      },

      remove: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQty: (productId, qty) => {
        if (qty < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, qty } : item,
          ),
        }));
      },

      clear: () => set({ items: [] }),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.qty,
          0,
        ),

      totalItems: () => get().items.reduce((sum, item) => sum + item.qty, 0),
    }),
    { name: "cart-storage" },
  ),
);
