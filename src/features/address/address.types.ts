export interface Address {
  id: string;
  userId?: string;

  fullName: string;
  phone: string;

  label?: string | null;

  addressLine: string;
  city: string;
  state?: string | null;
  country: string;

  isDefault: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressPayload {
  fullName: string;
  phone: string;
  label?: string;
  addressLine: string;
  city: string;
  state?: string;
  country?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  fullName?: string;
  phone?: string;
  label?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  isDefault?: boolean;
}

export interface AddressesResponse {
  success: boolean;
  data: Address[];
}

export interface AddressResponse {
  success: boolean;
  message?: string;
  data: Address;
}
