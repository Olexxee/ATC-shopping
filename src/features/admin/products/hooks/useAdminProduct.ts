import { useQuery } from "@tanstack/react-query";
import { getAdminProduct } from "../api/adminProducts.api";

export const adminProductKeys = {
  all: ["admin-product"] as const,
  detail: (productId: string) =>
    [...adminProductKeys.all, "detail", productId] as const,
  lists: () => [...adminProductKeys.all, "list"] as const,
  list: (params?: unknown) =>
    [...adminProductKeys.lists(), params ?? {}] as const,
};

export function useAdminProduct({
  id,
  enabled = true,
}: {
  id: string | undefined;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: id
      ? adminProductKeys.detail(id)
      : [...adminProductKeys.all, "empty"],
    queryFn: () => {
      if (!id) throw new Error("Product ID is required");
      return getAdminProduct(id);
    },
    enabled: enabled && Boolean(id),
  });
}
