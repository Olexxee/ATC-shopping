import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, type CreateProductForm } from "./admin.products.api";
import { deleteProduct } from "./admin.products.api";

export const adminProductKeys = {
  all: ["admin-products"] as const,
};

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductForm) => createProduct(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminProductKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["homepage-products"],
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminProductKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["homepage-products"],
      });
    },
  });
}
