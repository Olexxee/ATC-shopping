import { create } from "zustand";
import type { Cart } from "./cart.types";
import { updateCartItem } from "./cart.api";

interface CartStore {
  cart: Cart | null;
  pendingUpdates: Record<string, boolean>;
  updateSequence: Record<string, number>;

  setCart: (cart: Cart) => void;
  clearStore: () => void;

  updateQuantity: (
    variantId: string,
    quantity: number,
    onError?: (message: string) => void,
  ) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  pendingUpdates: {},
  updateSequence: {},

  setCart: (cart) => {
    set({ cart });
  },

  clearStore: () => {
    set({
      cart: null,
      pendingUpdates: {},
      updateSequence: {},
    });
  },

  updateQuantity: (variantId, quantity, onError) => {
    const currentCart = get().cart;

    if (!currentCart) return;

    const item = currentCart.items.find(
      (cartItem) => cartItem.variantId === variantId,
    );

    if (!item) return;

    if (quantity < 1) return;

    if (quantity > item.availableStock) {
      onError?.(
        `Only ${item.availableStock} ${
          item.availableStock === 1 ? "item is" : "items are"
        } available for ${item.variant?.product?.name || "this product"}.`,
      );
      return;
    }

    const previousQuantity = item.quantity;

    const sequence = (get().updateSequence[variantId] || 0) + 1;

    set((state) => ({
      cart: state.cart
        ? {
            ...state.cart,
            items: state.cart.items.map((cartItem) =>
              cartItem.variantId === variantId
                ? {
                    ...cartItem,
                    quantity,
                    lineTotal: cartItem.unitPrice * quantity,
                    inStock: cartItem.availableStock >= quantity,
                  }
                : cartItem,
            ),
            totalItems: state.cart.items.reduce(
              (total, cartItem) =>
                total +
                (cartItem.variantId === variantId
                  ? quantity
                  : cartItem.quantity),
              0,
            ),
            subtotal: state.cart.items.reduce(
              (total, cartItem) =>
                total +
                cartItem.unitPrice *
                  (cartItem.variantId === variantId
                    ? quantity
                    : cartItem.quantity),
              0,
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,

      pendingUpdates: {
        ...state.pendingUpdates,
        [variantId]: true,
      },

      updateSequence: {
        ...state.updateSequence,
        [variantId]: sequence,
      },
    }));

    updateCartItem(variantId, { quantity })
      .then((serverCart) => {
        const latestSequence = get().updateSequence[variantId];

        // Ignore stale responses.
        if (latestSequence !== sequence) {
          return;
        }

        set((state) => ({
          cart: serverCart,
          pendingUpdates: {
            ...state.pendingUpdates,
            [variantId]: false,
          },
        }));
      })
      .catch((error) => {
        const latestSequence = get().updateSequence[variantId];

        // A newer quantity has already been requested.
        if (latestSequence !== sequence) {
          return;
        }

        set((state) => ({
          cart: state.cart
            ? {
                ...state.cart,
                items: state.cart.items.map((cartItem) =>
                  cartItem.variantId === variantId
                    ? {
                        ...cartItem,
                        quantity: previousQuantity,
                        lineTotal: cartItem.unitPrice * previousQuantity,
                        inStock: cartItem.availableStock >= previousQuantity,
                      }
                    : cartItem,
                ),
                totalItems: state.cart.items.reduce(
                  (total, cartItem) =>
                    total +
                    (cartItem.variantId === variantId
                      ? previousQuantity
                      : cartItem.quantity),
                  0,
                ),
                subtotal: state.cart.items.reduce(
                  (total, cartItem) =>
                    total +
                    cartItem.unitPrice *
                      (cartItem.variantId === variantId
                        ? previousQuantity
                        : cartItem.quantity),
                  0,
                ),
              }
            : null,

          pendingUpdates: {
            ...state.pendingUpdates,
            [variantId]: false,
          },
        }));

        onError?.(
          error instanceof Error
            ? error.message
            : "Unable to update your cart.",
        );
      });
  },
}));
