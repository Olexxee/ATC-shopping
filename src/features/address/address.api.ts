import { api } from "../../lib/api";

import type {
  Address,
  AddressesResponse,
  AddressResponse,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "./address.types";

export const getMyAddresses = async (): Promise<Address[]> => {
  const response = await api.get<AddressesResponse>("/api/addresses");

  return response.data.data;
};

export const createAddress = async (
  payload: CreateAddressPayload,
): Promise<Address> => {
  const response = await api.post<AddressResponse>("/api/addresses", payload);

  return response.data.data;
};

export const updateAddress = async (
  id: string,
  payload: UpdateAddressPayload,
): Promise<Address> => {
  const response = await api.patch<AddressResponse>(
    `/api/addresses/${id}`,
    payload,
  );

  return response.data.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api.delete(`/api/addresses/${id}`);
};

export const setDefaultAddress = async (id: string): Promise<Address> => {
  const response = await api.patch<AddressResponse>(
    `/api/addresses/${id}/default`,
  );

  return response.data.data;
};
