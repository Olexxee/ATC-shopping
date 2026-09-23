import { api } from "../../lib/api";
import type { StorefrontCard, StorefrontDetail } from "./product.contract";

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { pagination?: PaginationMeta };
  context?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

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
