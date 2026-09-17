import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteFulfillment,
  generateFulfillmentsForOrder,
  updateFulfillmentStatus,
  updateFulfillmentTracking,
} from "./fulfillment.api";
import { fulfillmentKeys } from "./fulfillment.queries";
import type {
  UpdateFulfillmentStatusPayload,
  UpdateFulfillmentTrackingPayload,
} from "./fulfillment.types";

export function useUpdateFulfillmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fulfillmentId,
      payload,
    }: {
      fulfillmentId: string;
      payload: UpdateFulfillmentStatusPayload;
    }) => updateFulfillmentStatus(fulfillmentId, payload),

    onSuccess: (fulfillment) => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentKeys.all,
      });

      queryClient.setQueryData(
        fulfillmentKeys.detail(fulfillment.id),
        fulfillment,
      );
    },
  });
}

export function useUpdateFulfillmentTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fulfillmentId,
      payload,
    }: {
      fulfillmentId: string;
      payload: UpdateFulfillmentTrackingPayload;
    }) => updateFulfillmentTracking(fulfillmentId, payload),

    onSuccess: (fulfillment) => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentKeys.all,
      });

      queryClient.setQueryData(
        fulfillmentKeys.detail(fulfillment.id),
        fulfillment,
      );
    },
  });
}

export function useGenerateFulfillmentsForOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => generateFulfillmentsForOrder(orderId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });
    },
  });
}

export function useDeleteFulfillment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fulfillmentId: string) => deleteFulfillment(fulfillmentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentKeys.all,
      });
    },
  });
}
