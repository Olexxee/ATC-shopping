import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveAdminVariant,
  restoreAdminVariant,
} from "../api/adminVariants.api";
import { adminProductKeys } from "./useAdminProduct";

export function useArchiveVariant(productId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) => archiveAdminVariant(variantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(productId) });
    },
  });
}

export function useRestoreVariant(productId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) => restoreAdminVariant(variantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(productId) });
    },
  });
}