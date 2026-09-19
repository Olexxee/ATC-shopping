import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createVariant,
  type VariantPayload,
} from "../../../../api/product/variants.api";
import { adminProductKeys } from "./useAdminProduct";

export function useCreateVariant(productId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      media,
    }: {
      payload: VariantPayload;
      media?: File[];
    }) => createVariant(productId, payload, media ?? []),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(productId) });
    },
  });
}
