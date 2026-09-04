import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import type { Product } from "../../../types/product.types";

export interface AdminProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
  };
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
  context: string;
}

export const adminProductListKeys = {
  all: ["admin-products-list"] as const,

  list: (page: number, limit: number) =>
    [...adminProductListKeys.all, page, limit] as const,
};

async function getAdminProducts(
  page: number,
  limit: number,
): Promise<AdminProductsResponse> {
  const response = await api.get<AdminProductsResponse>("/api/products", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}

export function useAdminProducts(page: number, limit = 20) {
  return useQuery({
    queryKey: adminProductListKeys.list(page, limit),
    queryFn: () => getAdminProducts(page, limit),
    placeholderData: keepPreviousData,
  });
}
