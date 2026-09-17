import { useQuery } from "@tanstack/react-query";
import { getBusinessConfigs } from "./businessConfig.api";

export const businessConfigKeys = {
  all: ["admin-business-config"] as const,
  detail: () => [...businessConfigKeys.all, "detail"] as const,
};

export function useBusinessConfigs() {
  return useQuery({
    queryKey: businessConfigKeys.detail(),
    queryFn: getBusinessConfigs,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
