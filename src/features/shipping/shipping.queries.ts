import { useQuery } from "@tanstack/react-query";
import { getStorefrontShipping } from "./shipping.api";

export const storefrontShippingKeys = {
  all: ["storefront-shipping"] as const,
};

export function useStorefrontShipping() {
  return useQuery({
    queryKey: storefrontShippingKeys.all,
    queryFn: getStorefrontShipping,
    staleTime: 5 * 60 * 1000,
  });
}
