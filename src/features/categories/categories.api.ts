import { api } from "../../lib/api";
import type { CategoryApi } from "./categories.types";


export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  type?: "PRODUCT" | "SERVICE" | "CONTENT";
  isActive?: boolean;
  parentId?: string | null;
  search?: string;
}

export interface CategoriesResponse {
  data: CategoryApi[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export async function getCategories(
  params?: GetCategoriesParams,
): Promise<CategoriesResponse> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: CategoryApi[];
    meta: CategoriesResponse["meta"];
  }>("/api/category", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      ...(params?.type ? { type: params.type } : {}),
      ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
      ...(params?.parentId !== undefined ? { parentId: params.parentId } : {}),
      ...(params?.search ? { search: params.search } : {}),
    },
  });

  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

export async function getCategoryBySlug(slug: string): Promise<CategoryApi> {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: CategoryApi;
  }>(`/api/category/slug/${slug}`);

  return response.data.data;
}
