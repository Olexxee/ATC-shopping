import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, removeFromWishlist } from "./wishlist.api";
import { wishlistKeys } from "./wishlistKeys";
import type { AddToWishlistPayload } from "./wishlist.types";

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToWishlistPayload) => addToWishlist(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all,
      });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all,
      });
    },
  });
}
