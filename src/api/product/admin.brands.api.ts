// admin/admin.brands.api.ts
import { api } from "../../lib/api";
import type { Brand } from "../../types/brand.types";

export interface CreateBrandPayload {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateBrandPayload extends Partial<CreateBrandPayload> {}

export const createBrand = async (
  payload: CreateBrandPayload,
): Promise<Brand> => {
  const response = await api.post("/api/admin/brands", payload);
  return response.data.data;
};

export const updateBrand = async (
  id: string,
  payload: UpdateBrandPayload,
): Promise<Brand> => {
  const response = await api.patch(`/api/admin/brands/${id}`, payload);
  return response.data.data;
};

export const deleteBrand = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/brands/${id}`);
};
