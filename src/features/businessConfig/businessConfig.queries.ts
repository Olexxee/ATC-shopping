import { useQuery } from "@tanstack/react-query";
import { businessConfigApi } from "./businessConfig.api";

export function useStorefrontConfig() {
  return useQuery({
    queryKey: ["storefront-config"],
    queryFn: businessConfigApi.getStorefrontConfig,
    staleTime: 5 * 60 * 1000,
  });
}
