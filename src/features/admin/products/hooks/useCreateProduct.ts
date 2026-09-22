import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  type CreateProductForm,
} from "../api/product.api";
import { adminProductKeys } from "./useAdminProduct";

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (form: CreateProductForm) => createProduct(form),
    onSuccess: (product) => {
      qc.setQueryData(adminProductKeys.detail(product.id), product);
      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}