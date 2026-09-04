import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "./category.api";
import type { CategoryFilters, CategoryFormValues } from "./category.types";



export const adminCategoryKeys = {
  all: ["admin", "categories"] as const,

  lists: () => [...adminCategoryKeys.all, "list"] as const,

  list: (filters: CategoryFilters) =>
    [...adminCategoryKeys.lists(), filters] as const,

  detail: (id: string) => [...adminCategoryKeys.all, "detail", id] as const,
};

export function useAdminCategories(filters: CategoryFilters = {}) {
  return useQuery({
    queryKey: adminCategoryKeys.list(filters),
    queryFn: () => getAdminCategories(filters),
  });
}

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
        queryKey: adminCategoryKeys.all,
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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.all,
      });
    },
  });
}