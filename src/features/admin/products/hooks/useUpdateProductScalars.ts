import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAdminProduct,
  type UpdateAdminProductInput,
} from "../api/adminProducts.api";
import { adminProductKeys } from "./useAdminProduct";

export function useUpdateProductScalars() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAdminProductInput;
    }) => updateAdminProduct(id, payload),

    onSuccess: (_product, { id }) => {
      // Refetch instead of trusting the PATCH response: scalar updates must
      // never be able to overwrite the variants the detail query holds.
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(id) });
      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
