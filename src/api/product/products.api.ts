// products.api.ts (trimmed — createProduct/CreateProductPayload removed)
import { api } from "../../lib/api";
import type {
  StorefrontCard,
  StorefrontDetail,
  AdminListRow,
  AdminProductDetail,
} from "./product.contract";

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
  context?: string;
}

// ── Storefront reads ─────────────────────────────────────────────────

export interface GetProductsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
  collectionId?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export const getProducts = async (params?: GetProductsParams) => {
  const res = await api.get<Envelope<{ products: StorefrontCard[] }>>(
    "/api/products",
    { params },
  );
  return {
    products: res.data.data.products,
    pagination: res.data.meta?.pagination,
  };
};

export const getFeaturedProducts = async (params?: { limit?: number }) => {
  const res = await api.get<Envelope<StorefrontCard[]>>(
    "/api/products/featured",
    { params },
  );
  return res.data.data;
};

export const getNewArrivals = async (params?: { limit?: number }) => {
  const res = await api.get<Envelope<StorefrontCard[]>>(
    "/api/products/new-arrivals",
    { params },
  );
  return res.data.data;
};

export const getBestSellers = async (params?: { limit?: number }) => {
  const res = await api.get<Envelope<StorefrontCard[]>>(
    "/api/products/best-sellers",
    { params },
  );
  return res.data.data;
};

export const getProductBySlug = async (slug: string) => {
  const res = await api.get<Envelope<StorefrontDetail>>(
    `/api/products/slug/${slug}`,
  );
  return res.data.data;
};

export const getRelatedProducts = async (
  productId: string,
  params?: { limit?: number },
) => {
  const res = await api.get<Envelope<StorefrontCard[]>>(
    `/api/products/${productId}/related`,
    { params },
  );
  return res.data.data;
};

// ── Admin reads ──────────────────────────────────────────────────────

export interface AdminListParams {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  search?: string;
}

export const getAdminProducts = async (params?: AdminListParams) => {
  const res = await api.get<Envelope<{ products: AdminListRow[] }>>(
    "/api/products",
    { params },
  );
  return {
    products: res.data.data.products,
    pagination: res.data.meta?.pagination,
  };
};

export const getAdminProduct = async (id: string) => {
  const res = await api.get<Envelope<AdminProductDetail>>(
    `/api/products/admin/${id}`,
  );
  return res.data.data;
};

// ── Admin writes ─────────────────────────────────────────────────────
// NOTE: createProduct now lives in ./product.api.ts (multipart, carries
// variants) — that's the endpoint the backend actually validates against.
// Do not re-add a JSON-only createProduct here.

export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  brandId?: string | null;
  categoryId?: string;
  collectionId?: string | null;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  metadata?: Record<string, unknown> | null;
}

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
) => {
  const res = await api.patch<Envelope<AdminProductDetail>>(
    `/api/products/${id}`,
    payload,
  );
  return res.data.data;
};

export const archiveProduct = async (id: string, reason?: string) => {
  const res = await api.delete<Envelope<{ archived: boolean }>>(
    `/api/products/${id}`,
    { data: { reason } },
  );
  return res.data.data;
};
