import { api } from "../../../lib/api";

export interface CatalogItem {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: {
    products: number;
  };
}

interface CatalogResponse {
  success: boolean;
  message: string;
  data: CatalogItem[];
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

export const getBrands = async (): Promise<CatalogItem[]> => {
  const response = await api.get<CatalogResponse>("/api/brands");
  return response.data.data;
};

export const getCategories = async (): Promise<CatalogItem[]> => {
  const response = await api.get<CatalogResponse>("/api/category");

  return response.data.data;
};

export const getCollections = async (): Promise<CatalogItem[]> => {
  const response = await api.get<CatalogResponse>("/api/collections");
  return response.data.data;
};
