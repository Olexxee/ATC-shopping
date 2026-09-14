import { useQuery } from "@tanstack/react-query";
import { getCart, getCartSummary, validateCart } from "./cart.api";
import { cartKeys } from "./cart.keys";

export function useCart(enabled: boolean) {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: getCart,

    enabled,

    staleTime: 30 * 1000,

    retry: false,

    refetchOnWindowFocus: false,
  });
}


export function useCartSummary(enabled: boolean) {
  return useQuery({
    queryKey: cartKeys.summary(),
    queryFn: getCartSummary,
    enabled,
    staleTime: 30 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useValidateCart() {
  return useQuery({
    queryKey: cartKeys.validation(),
    queryFn: validateCart,

    enabled: false,

    retry: false,
  });
}
