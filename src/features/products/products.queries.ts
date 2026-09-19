import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getBestSellers,
  getFeaturedProducts,
  getNewArrivals,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  type GetProductsParams,
} from "../../api/product/products.api";

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: unknown) => [...productKeys.lists(), params] as const,

  infinite: (params?: unknown) =>
    [...productKeys.all, "infinite", params] as const,

  featured: (params?: unknown) =>
    [...productKeys.all, "featured", params] as const,

  newArrivals: (params?: unknown) =>
    [...productKeys.all, "new-arrivals", params] as const,

  bestSellers: (params?: unknown) =>
    [...productKeys.all, "best-sellers", params] as const,

  slug: (slug: string) => [...productKeys.all, "slug", slug] as const,

  related: (id: string) => [...productKeys.all, "related", id] as const,
};

/**
 * Infinite product discovery for the main listing page.
 */
export function useInfiniteProducts(params?: Omit<GetProductsParams, "page">) {
  return useInfiniteQuery({
    queryKey: productKeys.infinite(params),

    queryFn: ({ pageParam }) =>
      getProducts({
        ...params,
        page: pageParam as number,
        limit: params?.limit ?? 20,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;
      if (pagination.page >= pagination.totalPages) return undefined;
      return pagination.page + 1;
    },
  });
}

export function useFeaturedProducts(params?: { limit?: number }) {
  return useQuery({
    queryKey: productKeys.featured(params),
    queryFn: () => getFeaturedProducts(params),
  });
}

export function useNewArrivals(params?: { limit?: number }) {
  return useQuery({
    queryKey: productKeys.newArrivals(params),
    queryFn: () => getNewArrivals(params),
  });
}

export function useBestSellers(params?: { limit?: number }) {
  return useQuery({
    queryKey: productKeys.bestSellers(params),
    queryFn: () => getBestSellers(params),
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useRelatedProducts(productId: string, limit = 4) {
  return useQuery({
    queryKey: productKeys.related(productId),
    queryFn: () => getRelatedProducts(productId, { limit }),
    enabled: Boolean(productId),
  });
}
