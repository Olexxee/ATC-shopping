import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductStatus, type ProductStatus } from "../api/product.api";
import { adminProductKeys } from "./useAdminProduct";

interface Vars {
  productId: string;
  status: ProductStatus;
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, status }: Vars) =>
      updateProductStatus(productId, status),

    onSuccess: (product, { productId }) => {
      queryClient.setQueryData(adminProductKeys.detail(productId), product);
      queryClient.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
