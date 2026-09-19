import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getAdminProducts,
  type AdminListParams,
} from "../../../../api/product/products.api";
import { adminProductKeys } from "./useAdminProduct";

export function useAdminProducts(params?: AdminListParams) {
  return useQuery({
    queryKey: adminProductKeys.list(params),
    queryFn: () => getAdminProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
