import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  activateWarehouse,
  createWarehouse,
  deactivateWarehouse,
  deleteWarehouse,
  updateWarehouse,
} from "./warehouse.api";

import { warehouseKeys } from "./warehouse.queries";

import type {
  CreateWarehousePayload,
  UpdateWarehousePayload,
} from "./warehouse.types";

export function useCreateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWarehousePayload) => createWarehouse(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: warehouseKeys.all,
      });
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateWarehousePayload;
    }) => updateWarehouse(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: warehouseKeys.all,
      });
    },
  });
}

export function useActivateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateWarehouse,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: warehouseKeys.all,
      });
    },
  });
}

export function useDeactivateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateWarehouse,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: warehouseKeys.all,
      });
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWarehouse,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: warehouseKeys.all,
      });
    },
  });
}
