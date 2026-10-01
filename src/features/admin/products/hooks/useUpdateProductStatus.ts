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

    onSuccess: (_product, { productId }) => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(productId) });
      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
