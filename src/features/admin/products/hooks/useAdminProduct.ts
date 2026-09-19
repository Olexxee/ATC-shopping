import { useQuery } from "@tanstack/react-query";
import { getAdminProduct } from "../../../../api/product/products.api";

export const adminProductKeys = {
  all: ["admin-product"] as const,
  detail: (productId: string) =>
    [...adminProductKeys.all, "detail", productId] as const,
  lists: () => [...adminProductKeys.all, "list"] as const,
  list: (params?: unknown) =>
    [...adminProductKeys.lists(), params ?? {}] as const,
};

interface UseAdminProductOptions {
  id: string | undefined;
  enabled?: boolean;
}

export function useAdminProduct({
  id,
  enabled = true,
}: UseAdminProductOptions) {
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
