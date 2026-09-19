// src/features/admin/category/category.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getCategoryById,
  updateCategory,
} from "./category.api";
import type { CategoryFilters, CategoryFormValues } from "./category.types";

// ============================================================================
// KEYS
// ============================================================================

export const adminCategoryKeys = {
  all: ["admin", "categories"] as const,

  lists: () => [...adminCategoryKeys.all, "list"] as const,

  list: (filters: CategoryFilters) =>
    [...adminCategoryKeys.lists(), filters] as const,

  details: () => [...adminCategoryKeys.all, "detail"] as const,

  detail: (id: string) => [...adminCategoryKeys.details(), id] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

export function useAdminCategories(filters: CategoryFilters = {}) {
  return useQuery({
    queryKey: adminCategoryKeys.list(filters),
    queryFn: () => getAdminCategories(filters),
  });
}

export function useAdminCategory(id: string | undefined) {
  return useQuery({
    queryKey: adminCategoryKeys.detail(id ?? ""),
    queryFn: () => getCategoryById(id!),
    enabled: Boolean(id),
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      values,
      image,
    }: {
      values: CategoryFormValues;
      image?: File | null;
    }) => createCategory(values, image),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.lists(),
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
      image,
    }: {
      id: string;
      values: CategoryFormValues;
      image?: File | null;
    }) => updateCategory(id, values, image),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.lists(),
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: (_, id) => {
      // Remove the detail entry — nothing should refetch a deleted row.
      queryClient.removeQueries({
        queryKey: adminCategoryKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.lists(),
      });
    },
  });
}
