import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateOrderCBM,
  updateOrderStatus,
} from "./order.api";

import { orderKeys } from "./order.queries";

import type {
  UpdateOrderCBMPayload,
  UpdateOrderStatusPayload,
} from "./order.types";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: UpdateOrderStatusPayload;
    }) =>
      updateOrderStatus(orderId, payload),

    onSuccess: (order) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      queryClient.setQueryData(
        orderKeys.detail(order.id),
        order,
      );
    },
  });
}

export function useUpdateOrderCBM() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: UpdateOrderCBMPayload;
    }) =>
      updateOrderCBM(orderId, payload),

    onSuccess: (order) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      queryClient.setQueryData(
        orderKeys.detail(order.id),
        order,
      );
    },
  });
}