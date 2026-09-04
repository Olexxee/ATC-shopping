import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryBySlug,
  type GetCategoriesParams,
} from "./categories.api";

export const categoryKeys = {
  all: ["categories"] as const,

  lists: () => [...categoryKeys.all, "list"] as const,

  list: (params?: GetCategoriesParams) =>
    [...categoryKeys.lists(), params] as const,
  detail: (slug: string) => [...categoryKeys.all, "detail", slug] as const,
};

export function useCategories(params?: GetCategoriesParams) {
  return useQuery({
    queryKey: categoryKeys.list(params),

    queryFn: () => getCategories(params),

    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),

    queryFn: () => getCategoryBySlug(slug),

    enabled: Boolean(slug),

    staleTime: 5 * 60 * 1000,
  });
}
