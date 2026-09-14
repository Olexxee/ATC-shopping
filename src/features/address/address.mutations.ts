import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "./address.api";
import { addressKeys } from "./address.queries";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
} from "./address.types";



export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => createAddress(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressKeys.mine(),
      });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAddressPayload;
    }) => updateAddress(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressKeys.mine(),
      });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressKeys.mine(),
      });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultAddress(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressKeys.mine(),
      });
    },
  });
};
