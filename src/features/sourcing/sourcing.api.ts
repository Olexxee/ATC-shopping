import { api } from "../../lib/api";
import type {
  CreateSourcingRequestInput,
  CreateSourcingRequestResponse,
  SourcingListParams,
  SourcingPagination,
  SourcingRequest,
} from "./sourcing.types";

// ============================================================
// RESPONSE ENVELOPE
// ============================================================

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============================================================
// HELPERS
// ============================================================

const appendField = (formData: FormData, key: string, value: unknown): void => {
  if (value === undefined) return;

  if (value === null) {
    formData.append(key, "");
    return;
  }

  formData.append(key, String(value));
};

// ============================================================
// CREATE
// ============================================================

export async function createSourcingRequest(
  input: CreateSourcingRequestInput,
): Promise<CreateSourcingRequestResponse> {
  const formData = new FormData();

  appendField(formData, "title", input.title);
  appendField(formData, "description", input.description);
  appendField(formData, "referenceUrl", input.referenceUrl);

  for (const image of input.referenceImages ?? []) {
    formData.append("referenceImages", image);
  }

  const response = await api.post<ApiEnvelope<CreateSourcingRequestResponse>>(
    "/api/sourcing",
    formData,
  );

  return response.data.data;
}

// ============================================================
// LIST
//
// Backend returns: { success, message, data: { requests, meta } }
// ============================================================

export async function getMySourcingRequests(
  params: SourcingListParams = {},
): Promise<{
  requests: SourcingRequest[];
  pagination: SourcingPagination;
}> {
  const response = await api.get<
    ApiEnvelope<{
      requests: SourcingRequest[];
      meta: SourcingPagination;
    }>
  >("/api/sourcing", { params });

  return {
    requests: response.data.data.requests,
    pagination: response.data.data.meta,
  };
}

// ============================================================
// DETAIL
// ============================================================

export async function getMySourcingRequest(
  id: string,
): Promise<SourcingRequest> {
  const response = await api.get<ApiEnvelope<SourcingRequest>>(
    `/api/sourcing/${id}`,
  );

  return response.data.data;
}
