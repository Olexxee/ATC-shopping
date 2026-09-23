import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminProduct,
  type CreateAdminProductInput,
} from "../api/adminProducts.api";
import { adminProductKeys } from "./useAdminProduct";

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      product,
      images = [],
    }: {
      product: CreateAdminProductInput;
      images?: File[];
    }) => createAdminProduct(product, images),

    onSuccess: (product) => {
      // Safe: the backend returns `toAdminDetail(product)` on create, so
      // the seeded entry has the exact shape `useAdminProduct` reads.
      qc.setQueryData(adminProductKeys.detail(product.id), product);
      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
