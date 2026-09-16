import { useQuery } from "@tanstack/react-query";

import {
  getMyOrders,
  getOrderById,
} from "./order.api";

import type {
  GetMyOrdersQuery,
} from "./order.types";

export const orderKeys = {
  all: ["orders"] as const,

  list: (params?: GetMyOrdersQuery) =>
    [...orderKeys.all, "list", params] as const,

  detail: (orderId: string) =>
    [...orderKeys.all, "detail", orderId] as const,
};

export const useMyOrders = (
  params?: GetMyOrdersQuery,
) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getMyOrders(params),
  });
};

export const useOrder = (
  orderId?: string,
) => {
  return useQuery({
    queryKey: orderKeys.detail(
      orderId ?? "",
    ),
    queryFn: () =>
      getOrderById(orderId!),
    enabled: Boolean(orderId),
  });
};
