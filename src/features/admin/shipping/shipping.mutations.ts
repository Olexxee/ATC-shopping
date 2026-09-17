import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createShippingConfiguration,
  createShippingRule,
  deleteShippingRule,
  updateShippingConfiguration,
  updateShippingRule,
} from "./shipping.api";
import { shippingKeys } from "./shipping.queries";
import type {
  CreateShippingConfigurationPayload,
  CreateShippingRulePayload,
  UpdateShippingConfigurationPayload,
  UpdateShippingRulePayload,
} from "./shipping.types";

export function useCreateShippingConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShippingConfigurationPayload) =>
      createShippingConfiguration(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shippingKeys.all,
      });
    },
  });
}

export function useUpdateShippingConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateShippingConfigurationPayload;
    }) => updateShippingConfiguration(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shippingKeys.all,
      });
    },
  });
}

export function useCreateShippingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShippingRulePayload) =>
      createShippingRule(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shippingKeys.all,
      });
    },
  });
}

export function useUpdateShippingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateShippingRulePayload;
    }) => updateShippingRule(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shippingKeys.all,
      });
    },
  });
}

export function useDeleteShippingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShippingRule,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shippingKeys.all,
      });
    },
  });
}
