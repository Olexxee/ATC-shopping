import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProduct,
  type UpdateProductForm,
} from "../api/adminProducts.api";
import { adminProductKeys } from "./useAdminProduct";

interface UpdateProductVars {
  productId: string;
  form: UpdateProductForm;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, form }: UpdateProductVars) =>
      updateProduct(productId, form),

    onSuccess: (product, { productId }) => {
      queryClient.setQueryData(adminProductKeys.detail(productId), product);
      queryClient.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
