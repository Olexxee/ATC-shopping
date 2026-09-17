// src/features/admin/orders/order.queries.ts

import { useQuery } from "@tanstack/react-query";

import {
  getOrderById,
  getOrderMetrics,
  getOrderTimeline,
  getOrders,
} from "./order.api";

import type { OrderFilters } from "./order.types";

export const orderKeys = {
  all: ["admin", "orders"] as const,

  lists: () => [...orderKeys.all, "list"] as const,

  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,

  details: () => [...orderKeys.all, "detail"] as const,

  detail: (id: string) => [...orderKeys.details(), id] as const,

  metrics: () => [...orderKeys.all, "metrics"] as const,

  timeline: (id: string) => [...orderKeys.all, "timeline", id] as const,
};

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => getOrders(filters),
    staleTime: 30_000,
    retry: false,
  });
}

export function useOrder(orderId?: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId ?? ""),
    queryFn: () => getOrderById(orderId as string),
    enabled: Boolean(orderId),
    staleTime: 30_000,
    retry: false,
  });
}

export function useOrderMetrics() {
  return useQuery({
    queryKey: orderKeys.metrics(),
    queryFn: getOrderMetrics,
    staleTime: 30_000,
    retry: false,
  });
}

export function useOrderTimeline(orderId?: string) {
  return useQuery({
    queryKey: orderKeys.timeline(orderId ?? ""),
    queryFn: () => getOrderTimeline(orderId as string),
    enabled: Boolean(orderId),
    staleTime: 30_000,
    retry: false,
  });
}
