import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  type CreateProductPayload,
} from "../../../../api/product/products.api";
import { adminProductKeys } from "./useAdminProduct";

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: (product) => {
      qc.setQueryData(adminProductKeys.detail(product.id), product);
      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
