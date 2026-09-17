import { useQuery } from "@tanstack/react-query";

import { getWarehouse, getWarehouses } from "./warehouse.api";

import type { WarehouseQueryParams } from "./warehouse.types";

export const warehouseKeys = {
  all: ["admin-warehouses"] as const,

  list: (params?: WarehouseQueryParams) =>
    [...warehouseKeys.all, "list", params ?? {}] as const,

  detail: (id: string) => [...warehouseKeys.all, "detail", id] as const,
};

export function useWarehouses(params?: WarehouseQueryParams) {
  return useQuery({
    queryKey: warehouseKeys.list(params),
    queryFn: () => getWarehouses(params),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useWarehouse(id?: string) {
  return useQuery({
    queryKey: warehouseKeys.detail(id ?? ""),
    queryFn: () => getWarehouse(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
