import { useQuery } from "@tanstack/react-query";
import {
  getFulfillmentById,
  getFulfillments,
  getFulfillmentsByOrder,
} from "./fulfillment.api";
import type { FulfillmentFilters } from "./fulfillment.types";

export const fulfillmentKeys = {
  all: ["admin", "fulfillments"] as const,

  lists: () => [...fulfillmentKeys.all, "list"] as const,

  list: (filters: FulfillmentFilters) =>
    [...fulfillmentKeys.lists(), filters] as const,

  details: () => [...fulfillmentKeys.all, "detail"] as const,

  detail: (id: string) => [...fulfillmentKeys.details(), id] as const,

  byOrder: (orderId: string) =>
    [...fulfillmentKeys.all, "order", orderId] as const,
};

export function useFulfillments(filters: FulfillmentFilters = {}) {
  return useQuery({
    queryKey: fulfillmentKeys.list(filters),
    queryFn: () => getFulfillments(filters),
    staleTime: 30_000,
    retry: false,
  });
}

export function useFulfillment(fulfillmentId?: string) {
  return useQuery({
    queryKey: fulfillmentKeys.detail(fulfillmentId ?? ""),
    queryFn: () => getFulfillmentById(fulfillmentId as string),
    enabled: Boolean(fulfillmentId),
    staleTime: 30_000,
    retry: false,
  });
}

export function useFulfillmentsByOrder(orderId?: string) {
  return useQuery({
    queryKey: fulfillmentKeys.byOrder(orderId ?? ""),
    queryFn: () => getFulfillmentsByOrder(orderId as string),
    enabled: Boolean(orderId),
    staleTime: 30_000,
    retry: false,
  });
}
