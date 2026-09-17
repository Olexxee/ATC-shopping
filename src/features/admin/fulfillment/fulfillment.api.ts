import { api } from "../../../lib/api";
import type {
  Fulfillment,
  FulfillmentFilters,
  FulfillmentListResponse,
  UpdateFulfillmentStatusPayload,
  UpdateFulfillmentTrackingPayload,
} from "./fulfillment.types";

const BASE_URL = "/api/fulfillments";

function buildQueryString(filters: FulfillmentFilters = {}) {
  const params = new URLSearchParams();

  if (filters.page !== undefined) params.set("page", String(filters.page));
  if (filters.limit !== undefined) params.set("limit", String(filters.limit));
  if (filters.orderId) params.set("orderId", filters.orderId);
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.warehouseId) {
    params.set("warehouseId", filters.warehouseId);
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export async function getFulfillments(
  filters: FulfillmentFilters = {},
): Promise<FulfillmentListResponse> {
  const response = await api.get(
    `${BASE_URL}${buildQueryString(filters)}`,
  );

  return response.data.data;
}

export async function getFulfillmentById(
  fulfillmentId: string,
): Promise<Fulfillment> {
  const response = await api.get(
    `${BASE_URL}/${fulfillmentId}`,
  );

  return response.data.data;
}

export async function getFulfillmentsByOrder(
  orderId: string,
): Promise<Fulfillment[]> {
  const response = await api.get(
    `${BASE_URL}/order/${orderId}`,
  );

  return response.data.data;
}

export async function generateFulfillmentsForOrder(
  orderId: string,
): Promise<Fulfillment[]> {
  const response = await api.post(
    `${BASE_URL}/order/${orderId}/generate`,
  );

  return response.data.data;
}

export async function updateFulfillmentStatus(
  fulfillmentId: string,
  payload: UpdateFulfillmentStatusPayload,
): Promise<Fulfillment> {
  const response = await api.patch(
    `${BASE_URL}/${fulfillmentId}/status`,
    payload,
  );

  return response.data.data;
}

export async function updateFulfillmentTracking(
  fulfillmentId: string,
  payload: UpdateFulfillmentTrackingPayload,
): Promise<Fulfillment> {
  const response = await api.patch(
    `${BASE_URL}/${fulfillmentId}/tracking`,
    payload,
  );

  return response.data.data;
}

export async function deleteFulfillment(
  fulfillmentId: string,
): Promise<void> {
  await api.delete(`${BASE_URL}/${fulfillmentId}`);
}
