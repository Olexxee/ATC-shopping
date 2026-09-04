import { api } from "../../lib/api";
import type { BrandApi } from "./brands.types";

interface BrandsResponse {
  success: boolean;
  message: string;
  data: BrandApi[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export async function getBrands(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}): Promise<BrandsResponse> {
  const response = await api.get<BrandsResponse>("/api/brands", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      isActive: params?.isActive ?? true,
      ...(params?.search ? { search: params.search } : {}),
    },
  });

  return response.data;
}

export async function getBrandBySlug(slug: string): Promise<BrandApi> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: BrandApi;
  }>(`/api/brands/slug/${slug}`);

  return response.data.data;
}
