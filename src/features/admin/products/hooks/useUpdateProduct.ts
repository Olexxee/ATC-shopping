import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAdminProduct,
  type UpdateAdminProductInput,
} from "../api/adminProducts.api";
import { adminProductKeys } from "./useAdminProduct";

interface UpdateProductVars {
  productId: string;
  payload: UpdateAdminProductInput;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: UpdateProductVars) =>
      updateAdminProduct(productId, payload),

    onSuccess: (_product, { productId }) => {
      // Do NOT seed the detail cache from the PATCH response. Variants are
      // owned by their own endpoints, so this response can be missing or
      // stale on variants. Refetch the detail so the UI shows what the
      // server actually has.
      queryClient.invalidateQueries({
        queryKey: adminProductKeys.detail(productId),
      });
      queryClient.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
