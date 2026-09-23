import { api } from "../../../../lib/api";
import type {
  AdminListRow,
  AdminProductDetail,
} from "../../../../api/product/product.contract";
import { compressImages } from "../../../../lib/imageCompression";

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { pagination?: PaginationMeta };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================================
// TYPES
// ============================================================================

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export type ProductFulfillmentType =
  | "LOCAL"
  | "IMPORT"
  | "PREORDER"
  | "DIGITAL";
export type ProductShippingType =
  | "LOCAL"
  | "IMPORT"
  | "SEA"
  | "AIR"
  | "DIGITAL";

export interface AdminVariantInput {
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

  fulfillmentType?: ProductFulfillmentType;
  shippingType?: ProductShippingType;

  isActive?: boolean;
  attributes?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;

  /** Indices into the multipart `variantImages` file array. */
  imageIndexes?: number[];
}

export interface CreateAdminProductInput {
  name: string;
  slug: string;
  description?: string | null;

  brandId?: string | null;
  categoryId: string;
  collectionId?: string | null;

  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;

  status?: ProductStatus;
  metadata?: Record<string, unknown> | null;

  variants: AdminVariantInput[];
}

export type UpdateAdminProductInput = Partial<
  Omit<CreateAdminProductInput, "variants">
>;

// ============================================================================
// FORM DATA BUILDER
// ============================================================================

const appendField = (fd: FormData, key: string, value: unknown) => {
  if (value === undefined) return;
  if (value === null) {
    fd.append(key, "");
    return;
  }
  if (typeof value === "boolean") {
    fd.append(key, value ? "true" : "false");
    return;
  }
  if (typeof value === "object") {
    fd.append(key, JSON.stringify(value));
    return;
  }
  fd.append(key, String(value));
};

const buildProductFormData = (
  data: Partial<CreateAdminProductInput>,
  images: File[],
): FormData => {
  const fd = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (key === "variants") continue;
    appendField(fd, key, value);
  }

  if (Array.isArray(data.variants)) {
    fd.append("variants", JSON.stringify(data.variants));
  }

  for (const file of images) {
    fd.append("variantImages", file);
  }

  return fd;
};

// ============================================================================
// READS
// ============================================================================

export interface AdminListParams {
  page?: number;
  limit?: number;
  status?: ProductStatus;
  search?: string;
  categoryId?: string;
  brandId?: string;
  collectionId?: string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export const listAdminProducts = async (params?: AdminListParams) => {
  const res = await api.get<Envelope<{ products: AdminListRow[] }>>(
    "/api/admin/products",
    { params },
  );
  return {
    products: res.data.data.products,
    pagination: res.data.meta?.pagination,
  };
};

export const getAdminProduct = async (
  id: string,
): Promise<AdminProductDetail> => {
  const res = await api.get<Envelope<AdminProductDetail>>(
    `/api/admin/products/${id}`,
  );
  return res.data.data;
};

// ============================================================================
// WRITES
// ============================================================================

export const createAdminProduct = async (
  data: CreateAdminProductInput,
  images: File[] = [],
): Promise<AdminProductDetail> => {
  const compressed = await compressImages(images);
  const fd = buildProductFormData(data, compressed);

  const res = await api.post<Envelope<AdminProductDetail>>(
    "/api/admin/products",
    fd,
  );
  return res.data.data;
};

export const updateAdminProduct = async (
  id: string,
  data: UpdateAdminProductInput,
): Promise<AdminProductDetail> => {
  const fd = buildProductFormData(data, []);
  const res = await api.patch<Envelope<AdminProductDetail>>(
    `/api/admin/products/${id}`,
    fd,
  );
  return res.data.data;
};

export const updateAdminProductStatus = async (
  id: string,
  status: ProductStatus,
): Promise<AdminProductDetail> => {
  const res = await api.patch<Envelope<AdminProductDetail>>(
    `/api/admin/products/${id}/status`,
    { status },
  );
  return res.data.data;
};

export const archiveAdminProduct = async (
  id: string,
  reason?: string,
): Promise<{ archived: boolean }> => {
  const res = await api.delete<Envelope<{ archived: boolean }>>(
    `/api/admin/products/${id}`,
    { data: { reason } },
  );
  return res.data.data;
};
