import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveVariant, restoreVariant } from "../../../../api/product/variants.api";
import { adminProductKeys } from "./useAdminProduct";

export function useArchiveVariant(productId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) => archiveVariant(variantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(productId) });
    },
  });
}

export function useRestoreVariant(productId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) => restoreVariant(variantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(productId) });
    },
  });
}
