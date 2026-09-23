import { api } from "../../../../lib/api";
import type { AdminVariant } from "../../../../api/product/product.contract";
import { compressImages } from "../../../../lib/imageCompression";

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============================================================================
// TYPES
// ============================================================================

export interface VariantMediaInput {
  url: string;
  publicId: string;
  mimeType?: string | null;
  bytes?: number | null;
  format?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface CreateVariantInput {
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
  attributes?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}

export type UpdateVariantInput = Partial<CreateVariantInput>;

// ============================================================================
// FORM DATA
// ============================================================================

const VARIANT_IMAGES_FIELD = "variantImages";

const buildVariantFormData = (
  data: Partial<CreateVariantInput>,
  media: File[] = [],
): FormData => {
  const fd = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;

    if (value === null) {
      fd.append(key, "");
      continue;
    }
    if (typeof value === "boolean") {
      fd.append(key, value ? "true" : "false");
      continue;
    }
    if (typeof value === "number") {
      if (!Number.isFinite(value)) continue;
      fd.append(key, String(value));
      continue;
    }
    if (typeof value === "object") {
      fd.append(key, JSON.stringify(value));
      continue;
    }
    const str = String(value);
    if (str === "") continue;
    fd.append(key, str);
  }

  for (const file of media) {
    fd.append(VARIANT_IMAGES_FIELD, file);
  }

  return fd;
};

// ============================================================================
// READS
// ============================================================================

export const getAdminVariant = async (id: string): Promise<AdminVariant> => {
  const res = await api.get<Envelope<AdminVariant>>(
    `/api/admin/variants/${id}`,
  );
  return res.data.data;
};

// ============================================================================
// WRITES
// ============================================================================

export const createVariantForProduct = async (
  productId: string,
  data: CreateVariantInput,
  media: File[] = [],
): Promise<AdminVariant> => {
  const compressed = await compressImages(media);
  const fd = buildVariantFormData(data, compressed);

  const res = await api.post<Envelope<AdminVariant>>(
    `/api/admin/products/${productId}/variants`,
    fd,
  );
  return res.data.data;
};

export const updateAdminVariant = async (
  id: string,
  data: UpdateVariantInput,
  media: File[] = [],
): Promise<AdminVariant> => {
  const compressed = await compressImages(media);
  const fd = buildVariantFormData(data, compressed);

  const res = await api.patch<Envelope<AdminVariant>>(
    `/api/admin/variants/${id}`,
    fd,
  );
  return res.data.data;
};

export const archiveAdminVariant = async (
  id: string,
  reason?: string,
): Promise<{ archived: boolean }> => {
  const res = await api.delete<Envelope<{ archived: boolean }>>(
    `/api/admin/variants/${id}`,
    { data: { reason } },
  );
  return res.data.data;
};

export const restoreAdminVariant = async (
  id: string,
): Promise<AdminVariant> => {
  const res = await api.post<Envelope<AdminVariant>>(
    `/api/admin/variants/${id}/restore`,
  );
  return res.data.data;
};
