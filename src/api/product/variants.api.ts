// variant.api.ts
import { api } from "../../lib/api";
import type { AdminVariant } from "./product.contract";

// ============================================================================
// TYPES
// ============================================================================

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

/**
 * Same shape, but every field optional. Used for PATCH.
 * Derived so the two can't drift apart.
 */
export type VariantUpdatePayload = Partial<VariantPayload>;

export interface VariantMediaPayload {
  url: string;
  publicId: string;
  mimeType?: string | null;
  bytes?: number | null;
  format?: string | null;
  width?: number | null;
  height?: number | null;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Must match the field name in `upload.array("variantImages", 5)`
 * on the backend. Changing this without changing the backend produces
 * `MulterError: Unexpected field`.
 */
const VARIANT_IMAGES_FIELD = "variantImages";

/**
 * Fields sent as JSON strings. The backend's multipart parser must
 * JSON.parse these back before Joi sees them. If you add a field here,
 * add it to `parseProductMultipart` (or a variant-specific parser) too.
 *
 * Note: `attributes` is *not* currently handled by the backend's
 * `parseProductMultipart`, so this is a gap to close on the server side
 * before these fields will validate.
 */
const JSON_FIELDS = new Set(["attributes", "metadata"]);

/**
 * Fields sent as strings from FormData but validated as numbers.
 * `convert: true` on the Joi side handles these, but listing them here
 * means we can format them consistently (no trailing spaces, no scientific
 * notation surprises).
 */
const NUMERIC_FIELDS = new Set([
  "price",
  "compareAtPrice",
  "stock",
  "weight",
  "actualWeight",
  "length",
  "width",
  "height",
]);

// ============================================================================
// FORM DATA BUILDER
// ============================================================================

/**
 * Serializes a variant payload (full or partial) into multipart form data.
 *
 * Rules:
 *   - `undefined` — field is not sent. On PATCH this means "leave alone".
 *   - `null`      — field is sent as an empty string. The backend's parser
 *                   converts `""` to `null` for nullable columns.
 *   - `""`        — skip; we never intend to send empty strings from this
 *                   layer. Use `null` explicitly for "clear".
 *   - `false` / `0` — send; they're meaningful values, not "absent".
 */
const buildVariantFormData = (
  payload: Partial<VariantPayload>,
  media: File[] = [],
): FormData => {
  const fd = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    // Absent — never touch the field on the wire.
    if (value === undefined) continue;

    // Explicit clear.
    if (value === null) {
      fd.append(key, "");
      continue;
    }

    // Booleans — send "true" / "false" (Multer/Joi-friendly).
    if (typeof value === "boolean") {
      fd.append(key, value ? "true" : "false");
      continue;
    }

    // Numbers — guard against NaN / Infinity silently leaking through.
    if (typeof value === "number") {
      if (!Number.isFinite(value)) continue;
      fd.append(key, String(value));
      continue;
    }

    // Nested objects — stringify for JSON_FIELDS, skip otherwise.
    if (typeof value === "object") {
      if (JSON_FIELDS.has(key)) {
        fd.append(key, JSON.stringify(value));
      }
      // Silent-skip: an object on a non-JSON field is a programming error.
      // Sending "[object Object]" would be worse than sending nothing.
      continue;
    }

    // Plain strings — skip empties; caller should use null to clear.
    const str = String(value);
    if (str === "") continue;
    fd.append(key, str);
  }

  // Files must use the exact field name Multer is configured for.
  for (const file of media) {
    fd.append(VARIANT_IMAGES_FIELD, file);
  }

  return fd;
};

// ============================================================================
// CREATE
// ============================================================================

export const createVariant = async (
  productId: string,
  payload: VariantPayload,
  media: File[] = [],
): Promise<AdminVariant> => {
  const fd = buildVariantFormData(payload, media);

  // The productId travels in the URL — the backend's createVariantSchema
  // reads it from there, not from the body.
  const res = await api.post<Envelope<AdminVariant>>(
    `/api/products/${productId}/variants`,
    fd,
  );

  return res.data.data;
};

// ============================================================================
// UPDATE
// ============================================================================

export const updateVariant = async (
  variantId: string,
  payload: VariantUpdatePayload,
  media: File[] = [],
): Promise<AdminVariant> => {
  const fd = buildVariantFormData(payload, media);

  const res = await api.patch<Envelope<AdminVariant>>(
    `/api/variants/${variantId}`,
    fd,
  );

  return res.data.data;
};

// ============================================================================
// ARCHIVE / RESTORE
// ============================================================================

export const archiveVariant = async (
  variantId: string,
  reason?: string,
): Promise<{ archived: boolean }> => {
  const res = await api.delete<Envelope<{ archived: boolean }>>(
    `/api/variants/${variantId}`,
    { data: { reason } },
  );

  return res.data.data;
};

export const restoreVariant = async (
  variantId: string,
): Promise<AdminVariant> => {
  const res = await api.post<Envelope<AdminVariant>>(
    `/api/variants/${variantId}/restore`,
  );

  return res.data.data;
};
