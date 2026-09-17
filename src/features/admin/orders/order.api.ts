// src/features/admin/orders/order.api.ts

import { api } from "../../../lib/api";

import type {
  Order,
  OrderFilters,
  OrderMetrics,
  OrdersResponse,
  OrderTimelineEvent,
  UpdateOrderCBMPayload,
  UpdateOrderStatusPayload,
} from "./order.types";

// ============================================================
// BASE URL
// ============================================================

const ORDERS_BASE_URL = "/api/orders";

// ============================================================
// QUERY STRING
// ============================================================

function buildQueryString(filters: OrderFilters = {}) {
  const params = new URLSearchParams();

  if (filters.page) {
    params.set("page", String(filters.page));
  }

  if (filters.limit) {
    params.set("limit", String(filters.limit));
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  if (filters.userId) {
    params.set("userId", filters.userId);
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

// ============================================================
// ORDERS
// ============================================================

export async function getOrders(
  filters: OrderFilters = {},
): Promise<OrdersResponse> {
  const response = await api.get(
    `${ORDERS_BASE_URL}${buildQueryString(filters)}`,
  );

  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

// ============================================================
// SINGLE ORDER
// ============================================================

export async function getOrderById(
  orderId: string,
): Promise<Order> {
  const response = await api.get(
    `${ORDERS_BASE_URL}/${orderId}`,
  );

  return response.data.data;
}

// ============================================================
// ORDER TIMELINE
// ============================================================

export async function getOrderTimeline(
  orderId: string,
): Promise<OrderTimelineEvent[]> {
  const response = await api.get(
    `${ORDERS_BASE_URL}/${orderId}/timeline`,
  );

  return response.data.data;
}

// ============================================================
// ORDER METRICS
// ============================================================

export async function getOrderMetrics(): Promise<OrderMetrics> {
  const response = await api.get(
    `${ORDERS_BASE_URL}/metrics`,
  );

  return response.data.data;
}

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

export async function updateOrderStatus(
  orderId: string,
  payload: UpdateOrderStatusPayload,
): Promise<Order> {
  const response = await api.patch(
    `${ORDERS_BASE_URL}/${orderId}/status`,
    payload,
  );

  return response.data.data;
}

// ============================================================
// UPDATE ORDER CBM
// ============================================================

export async function updateOrderCBM(
  orderId: string,
  payload: UpdateOrderCBMPayload,
): Promise<Order> {
  const response = await api.patch(
    `${ORDERS_BASE_URL}/${orderId}/cbm`,
    payload,
  );

  return response.data.data;
}