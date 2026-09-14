import { useQuery } from "@tanstack/react-query";
import {
  batchCheckWishlist,
  checkInWishlist,
  getWishlist,
} from "./wishlist.api";
import { wishlistKeys } from "./wishlistKeys";
import type { WishlistListParams } from "./wishlist.types";

export function useWishlist(params?: WishlistListParams, enabled = true) {
  return useQuery({
    queryKey: wishlistKeys.list(params),
    queryFn: () => getWishlist(params),

    enabled,

    staleTime: 30 * 1000,

    retry: false,

    refetchOnWindowFocus: false,
  });
}

export function useWishlistCheck(productId: string, enabled = true) {
  return useQuery({
    queryKey: wishlistKeys.check(productId),
    queryFn: () => checkInWishlist(productId),

    enabled: enabled && Boolean(productId),

    staleTime: 30 * 1000,

    retry: false,

    refetchOnWindowFocus: false,
  });
}

// For a grid of ProductCards: one request checking every visible
// productId at once, instead of one request per card. `enabled` should
// combine "there are ids to check" with "the user is actually logged in"
// — the caller decides the latter (mirrors useCart(enabled)).
export function useBatchWishlistCheck(productIds: string[], enabled = true) {
  return useQuery({
    queryKey: wishlistKeys.batchCheck(productIds),
    queryFn: () => batchCheckWishlist(productIds),

    enabled: enabled && productIds.length > 0,

    staleTime: 30 * 1000,
    
    retry: false,

    refetchOnWindowFocus: false,
  });
}
