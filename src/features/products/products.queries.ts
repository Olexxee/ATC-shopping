import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getBestSellers,
  getFeaturedProducts,
  getNewArrivals,
  getProductById,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
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

  detail: (id: string) => [...productKeys.all, "detail", id] as const,

  slug: (slug: string) => [...productKeys.all, "slug", slug] as const,

  related: (id: string) => [...productKeys.all, "related", id] as const,
};

/**
 * Standard paginated products query.
 */
export function useProducts(params?: Parameters<typeof getProducts>[0]) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
  });
}

/**
 * Infinite product discovery query.
 *
 * Used by the main product listing page.
 */
export function useInfiniteProducts(
  params?: Omit<NonNullable<Parameters<typeof getProducts>[0]>, "page">,
) {
  return useInfiniteQuery({
    queryKey: productKeys.infinite(params),

    queryFn: ({ pageParam }) =>
      getProducts({
        ...params,
        page: pageParam,
        limit: params?.limit ?? 20,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;

      if (page >= totalPages) {
        return undefined;
      }

      return page + 1;
    },
  });
}

/**
 * Featured products.
 */
export function useFeaturedProducts(
  params?: Parameters<typeof getFeaturedProducts>[0],
) {
  return useQuery({
    queryKey: productKeys.featured(params),
    queryFn: () => getFeaturedProducts(params),
  });
}

/**
 * New arrivals.
 */
export function useNewArrivals(params?: Parameters<typeof getNewArrivals>[0]) {
  return useQuery({
    queryKey: productKeys.newArrivals(params),
    queryFn: () => getNewArrivals(params),
  });
}

/**
 * Best sellers.
 */
export function useBestSellers(params?: Parameters<typeof getBestSellers>[0]) {
  return useQuery({
    queryKey: productKeys.bestSellers(params),
    queryFn: () => getBestSellers(params),
  });
}

/**
 * Product by ID.
 */
export function useProductById(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}

/**
 * Product by slug.
 */
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

/**
 * Related products.
 */
export function useRelatedProducts(productId: string, limit = 4) {
  return useQuery({
    queryKey: productKeys.related(productId),
    queryFn: () => getRelatedProducts(productId, { limit }),
    enabled: Boolean(productId),
  });
}
