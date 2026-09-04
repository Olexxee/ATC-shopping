// collections.api.ts
import { api } from "../../lib/api";
import type { Collection } from "../../types/collection.types";

export interface GetCollectionsParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

export interface CollectionsResponse {
  data: Collection[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getCollections = async (
  params?: GetCollectionsParams,
): Promise<CollectionsResponse> => {
  const response = await api.get("/api/collections", { params });
  return response.data;
};

export const getCollectionBySlug = async (
  slug: string,
): Promise<Collection> => {
  const response = await api.get(`/api/collections/slug/${slug}`);
  return response.data.data;
};

export const getCollectionById = async (id: string): Promise<Collection> => {
  const response = await api.get(`/api/collections/${id}`);
  return response.data.data;
};
