import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAdminVariant,
  type UpdateVariantInput,
} from "../api/adminVariants.api";
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
      payload: UpdateVariantInput;
      media?: File[];
    }) => updateAdminVariant(variantId, payload, media),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(productId) });
    },
  });
}
