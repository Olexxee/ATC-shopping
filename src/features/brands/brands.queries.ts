import { useQuery } from "@tanstack/react-query";

import { getBrandBySlug, getBrands } from "./brands.api";

export const brandKeys = {
  all: ["brands"] as const,

  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) => ["brands", "list", params] as const,

  detail: (slug: string) => ["brands", "detail", slug] as const,
};

interface UseBrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export function useBrands(params?: UseBrandsParams) {
  const queryParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    isActive: params?.isActive ?? true,
    ...(params?.search ? { search: params.search } : {}),
  };

  return useQuery({
    queryKey: brandKeys.list(queryParams),

    queryFn: () => getBrands(queryParams),

    staleTime: 5 * 60 * 1000,
  });
}

export function useBrandBySlug(slug: string) {
  return useQuery({
    queryKey: brandKeys.detail(slug),

    queryFn: () => getBrandBySlug(slug),

    enabled: Boolean(slug),

    staleTime: 5 * 60 * 1000,
  });
}
