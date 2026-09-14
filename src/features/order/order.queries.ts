import { useQuery } from "@tanstack/react-query";

import { getOrderById } from "./order.api";

export const orderKeys = {
  all: ["orders"] as const,

  detail: (orderId: string) => [...orderKeys.all, "detail", orderId] as const,
};

export const useOrder = (orderId?: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId ?? ""),
    queryFn: () => getOrderById(orderId!),
    enabled: Boolean(orderId),
  });
};
