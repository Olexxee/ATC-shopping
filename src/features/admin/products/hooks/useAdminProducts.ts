import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  listAdminProducts,
  type AdminListParams,
} from "../api/adminProducts.api";
import { adminProductKeys } from "./useAdminProduct";

export function useAdminProducts(params?: AdminListParams) {
  return useQuery({
    queryKey: adminProductKeys.list(params),
    queryFn: () => listAdminProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
