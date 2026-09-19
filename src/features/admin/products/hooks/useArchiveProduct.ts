import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveProduct } from "../../../../api/product/products.api";
import { adminProductKeys } from "./useAdminProduct";

export function useArchiveProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      archiveProduct(id, reason),
    onSuccess: (_result, { id }) => {
      qc.removeQueries({ queryKey: adminProductKeys.detail(id) });
      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
