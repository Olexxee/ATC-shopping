import type { WishlistListParams } from "./wishlist.types";

export const wishlistKeys = {
  all: ["wishlist"] as const,

  lists: () => [...wishlistKeys.all, "list"] as const,
  list: (params?: WishlistListParams) =>
    [...wishlistKeys.lists(), params ?? {}] as const,

  checks: () => [...wishlistKeys.all, "check"] as const,
  check: (productId: string) => [...wishlistKeys.checks(), productId] as const,

  batchChecks: () => [...wishlistKeys.all, "batchCheck"] as const,
  batchCheck: (productIds: string[]) =>
    [...wishlistKeys.batchChecks(), [...productIds].sort()] as const,
};
