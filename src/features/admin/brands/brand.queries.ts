import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBrand,
  deleteBrand,
  getAdminBrand,
  getAdminBrands,
  updateBrand,
  updateBrandLogo,
} from "./brand.api";
import type { BrandFilters, BrandFormValues } from "./brand.types";

export const adminBrandKeys = {
  all: ["admin", "brands"] as const,

  lists: () => [...adminBrandKeys.all, "list"] as const,

  list: (filters: BrandFilters) =>
    [...adminBrandKeys.lists(), filters] as const,

  detail: (id: string) => [...adminBrandKeys.all, "detail", id] as const,
};

export function useAdminBrands(filters: BrandFilters = {}) {
  return useQuery({
    queryKey: adminBrandKeys.list(filters),
    queryFn: () => getAdminBrands(filters),
  });
}

export function useAdminBrand(id: string) {
  return useQuery({
    queryKey: adminBrandKeys.detail(id),
    queryFn: () => getAdminBrand(id),
    enabled: Boolean(id),
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      values,
      image,
    }: {
      values: BrandFormValues;
      image?: File | null;
    }) => createBrand(values, image),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminBrandKeys.all,
      });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
      image,
    }: {
      id: string;
      values: BrandFormValues;
      image?: File | null;
    }) => updateBrand(id, values, image),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminBrandKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: adminBrandKeys.detail(variables.id),
      });
    },
  });
}

export function useUpdateBrandLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: File }) =>
      updateBrandLogo(id, image),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminBrandKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: adminBrandKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBrand,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminBrandKeys.all,
      });
    },
  });
}
