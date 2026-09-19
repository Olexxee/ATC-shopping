import { api } from "../../lib/api";
import type { AdminVariant } from "./product.contract";

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface VariantPayload {
  sku?: string;
  color?: string;
  size?: string;
  price: number;
  compareAtPrice?: number | null;
  stock?: number;
  weight: number;
  actualWeight: number;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  fulfillmentType?: string;
  shippingType?: string;
  isActive?: boolean;
  attributes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface VariantMediaPayload {
  url: string;
  publicId: string;
  mimeType?: string | null;
  bytes?: number | null;
  format?: string | null;
  width?: number | null;
  height?: number | null;
}

const buildVariantFormData = (
  payload: VariantPayload,
  media: File[] = [],
): FormData => {
  const fd = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "object") {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, String(value));
    }
  }

  for (const file of media) {
    fd.append("images", file);
  }

  return fd;
};

export const createVariant = async (
  productId: string,
  payload: VariantPayload,
  media: File[] = [],
) => {
  const fd = buildVariantFormData(payload, media);
  const res = await api.post<Envelope<AdminVariant>>(
    `/api/products/${productId}/variants`,
    fd,
  );
  return res.data.data;
};

export const updateVariant = async (
  variantId: string,
  payload: Partial<VariantPayload>,
  media: File[] = [],
) => {
  const fd = buildVariantFormData(payload as VariantPayload, media);
  const res = await api.patch<Envelope<AdminVariant>>(
    `/api/variants/${variantId}`,
    fd,
  );
  return res.data.data;
};

export const archiveVariant = async (variantId: string, reason?: string) => {
  const res = await api.delete<Envelope<{ archived: boolean }>>(
    `/api/variants/${variantId}`,
    { data: { reason } },
  );
  return res.data.data;
};

export const restoreVariant = async (variantId: string) => {
  const res = await api.post<Envelope<AdminVariant>>(
    `/api/variants/${variantId}/restore`,
  );
  return res.data.data;
};
