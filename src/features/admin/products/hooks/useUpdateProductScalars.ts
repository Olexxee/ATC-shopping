import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProduct,
} from "../../products/api/product.api";
import type {UpdateProductPayload} from "../../../../api/product/products.api"
import { adminProductKeys } from "./useAdminProduct";

export function useUpdateProductScalars() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => {
      const requestBody = {
        product: payload,
        images: [],
      } as unknown as Parameters<typeof updateProduct>[1];

      return updateProduct(id, requestBody);
    },
    onSuccess: (product) => {
      qc.setQueryData(adminProductKeys.detail(product.id), product);
      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
