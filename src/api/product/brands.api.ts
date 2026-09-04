// brands.api.ts
import { api } from "../../lib/api";
import type { Brand } from "../../types/brand.types";

export interface GetBrandsParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

export interface BrandsResponse {
  data: Brand[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getBrands = async (
  params?: GetBrandsParams,
): Promise<BrandsResponse> => {
  const response = await api.get("/api/brands", { params });
  return response.data;
};

export const getBrandBySlug = async (slug: string): Promise<Brand> => {
  const response = await api.get(`/api/brands/slug/${slug}`);
  return response.data.data;
};

export const getBrandById = async (id: string): Promise<Brand> => {
  const response = await api.get(`/api/brands/${id}`);
  return response.data.data;
};
