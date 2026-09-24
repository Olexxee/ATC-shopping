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

    onSuccess: (product, { productId }) => {
      queryClient.setQueryData(adminProductKeys.detail(productId), product);
      queryClient.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
