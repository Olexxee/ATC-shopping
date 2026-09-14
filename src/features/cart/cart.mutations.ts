import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";

import {
  addCartItem,
  clearCart,
  removeCartItem,
  updateCartItem,
} from "./cart.api";

import { cartKeys } from "./cart.keys";

export function useAddCartItem() {
  return useMutation({
    mutationFn: addCartItem,

    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(), cart);

      queryClient.invalidateQueries({
        queryKey: cartKeys.summary(),
      });

      queryClient.invalidateQueries({
        queryKey: cartKeys.validation(),
      });
    },
  });
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
    }) =>
      updateCartItem(variantId, {
        quantity,
      }),

    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(), cart);

      queryClient.invalidateQueries({
        queryKey: cartKeys.summary(),
      });

      queryClient.invalidateQueries({
        queryKey: cartKeys.validation(),
      });
    },
  });
}

export function useRemoveCartItem() {
  return useMutation({
    mutationFn: removeCartItem,

    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(), cart);

      queryClient.invalidateQueries({
        queryKey: cartKeys.summary(),
      });

      queryClient.invalidateQueries({
        queryKey: cartKeys.validation(),
      });
    },
  });
}

export function useClearCart() {
  return useMutation({
    mutationFn: clearCart,

    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(), cart);

      queryClient.invalidateQueries({
        queryKey: cartKeys.summary(),
      });

      queryClient.invalidateQueries({
        queryKey: cartKeys.validation(),
      });
    },
  });
}
