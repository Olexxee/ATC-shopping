import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAdminProductStatus,
  type ProductStatus,
} from "../api/adminProducts.api";
import { adminProductKeys } from "./useAdminProduct";

export function useUpdateProductStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      status,
    }: {
      productId: string;
      status: ProductStatus;
    }) => updateAdminProductStatus(productId, status),
    onSuccess: (product, { productId }) => {
      qc.setQueryData(adminProductKeys.detail(productId), product);
      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
