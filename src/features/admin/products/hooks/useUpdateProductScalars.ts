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

    onSuccess: (product, { id }) => {
      // Backend returns the full admin detail; trust it, don't merge.
      qc.setQueryData(adminProductKeys.detail(id), product);
      qc.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
