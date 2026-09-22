import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../../products/api/product.api";
import type { UpdateProductPayload } from "../../../../api/product/products.api";
import type { AdminProductDetail } from "../../../../api/product/product.contract";
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
    }) => updateProduct(id, { product: payload, images: [] }),

    onSuccess: (product) => {
      qc.setQueryData<AdminProductDetail>(
        adminProductKeys.detail(product.id),
        (prev) => {
          // First load — nothing cached yet, take the response as-is.
          if (!prev) return product as AdminProductDetail;

          // Merge: server wins for scalars; keep the cached variants and
          // metadata when the PATCH response omits them.
          return {
            ...prev,
            ...product,
            metadata: (product as Partial<AdminProductDetail>).metadata ?? prev.metadata,
            variants:
              (product as Partial<AdminProductDetail>).variants ?? prev.variants,
          } as AdminProductDetail;
        },
      );

      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
