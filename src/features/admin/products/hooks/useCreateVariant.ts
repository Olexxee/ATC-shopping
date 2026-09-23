import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createVariantForProduct,
  type CreateVariantInput,
} from "../api/adminVariants.api";
import { adminProductKeys } from "./useAdminProduct";

export function useCreateVariant(productId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      media = [],
    }: {
      payload: CreateVariantInput;
      media?: File[];
    }) => createVariantForProduct(productId, payload, media),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(productId) });
    },
  });
}