import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateVariant,
  type VariantUpdatePayload,
} from "../../../../api/product/variants.api";
import { adminProductKeys } from "./useAdminProduct";

export function useUpdateVariant(productId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      payload,
      media = [],
    }: {
      variantId: string;
      payload: VariantUpdatePayload;
      media?: File[];
    }) => updateVariant(variantId, payload, media),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(productId) });
    },
  });
}
