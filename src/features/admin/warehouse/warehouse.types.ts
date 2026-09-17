export type WarehouseType = "LOCAL" | "IMPORT" | "PREORDER" | "DIGITAL";

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: WarehouseType;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface WarehouseListResponse {
  warehouses: Warehouse[];
}

export interface WarehouseResponse {
  warehouse: Warehouse;
}

export interface CreateWarehousePayload {
  name: string;
  code: string;
  type?: WarehouseType;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  isActive?: boolean;
}

export type UpdateWarehousePayload = Partial<CreateWarehousePayload>;

export interface WarehouseQueryParams {
  type?: WarehouseType;
  isActive?: boolean;
}
