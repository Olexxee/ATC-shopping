import { api } from "../../../lib/api";
import type {
  AdminSourcingListParams,
  AdminSourcingListResponse,
  AdminSourcingRequest,
  AdminSourcingResponse,
  CreateAdminSourcingResponseInput,
  AdminSourcingRequestStatus,
  AdminSourcingResponseStatus,
} from "./admin-sourcing.types";




interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============================================================
// LIST
//
// Backend: { success, message, data: { requests, meta } }
// We return `data` unchanged so callers destructure
// `{ requests, meta }` directly.
// ============================================================

export async function getAdminSourcingRequests(
  params?: AdminSourcingListParams,
): Promise<AdminSourcingListResponse> {
  const response = await api.get<ApiEnvelope<AdminSourcingListResponse>>(
    "/api/sourcing/admin/list",
    { params },
  );

  return response.data.data;
}

// ============================================================
// DETAIL
// ============================================================

export async function getAdminSourcingRequest(
  id: string,
): Promise<AdminSourcingRequest> {
  const response = await api.get<ApiEnvelope<AdminSourcingRequest>>(
    `/api/sourcing/admin/${id}`,
  );

  return response.data.data;
}

// ============================================================
// REQUEST STATUS
// ============================================================

export async function updateAdminSourcingRequestStatus(
  id: string,
  status: AdminSourcingRequestStatus,
): Promise<AdminSourcingRequest> {
  const response = await api.patch<ApiEnvelope<AdminSourcingRequest>>(
    `/api/sourcing/admin/${id}/status`,
    { status },
  );

  return response.data.data;
}

// ============================================================
// RESPONSE — LINK EXISTING PRODUCT
// ============================================================

export async function createAdminSourcingResponse(
  requestId: string,
  input: CreateAdminSourcingResponseInput,
): Promise<AdminSourcingResponse> {
  const response = await api.post<ApiEnvelope<AdminSourcingResponse>>(
    `/api/sourcing/admin/${requestId}/respond`,
    input,
  );

  return response.data.data;
}

// ============================================================
// RESPONSE STATUS
// ============================================================

export async function updateAdminSourcingResponseStatus(
  responseId: string,
  status: AdminSourcingResponseStatus,
): Promise<AdminSourcingResponse> {
  const response = await api.patch<ApiEnvelope<AdminSourcingResponse>>(
    `/api/sourcing/admin/responses/${responseId}/status`,
    { status },
  );

  return response.data.data;
}
