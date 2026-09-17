import { api } from "../../../lib/api";

import type {
  ApiResponse,
  CreateWarehousePayload,
  UpdateWarehousePayload,
  Warehouse,
  WarehouseQueryParams,
  WarehouseListResponse,
  WarehouseResponse,
} from "./warehouse.types";

const BASE_URL = "/api/warehouses";

export async function getWarehouses(
  params?: WarehouseQueryParams,
): Promise<Warehouse[]> {
  const response = await api.get<ApiResponse<WarehouseListResponse>>(BASE_URL, {
    params,
  });

  return response.data.data.warehouses;
}

export async function getWarehouse(id: string): Promise<Warehouse> {
  const response = await api.get<ApiResponse<WarehouseResponse>>(
    `${BASE_URL}/${id}`,
  );

  return response.data.data.warehouse;
}

export async function createWarehouse(
  payload: CreateWarehousePayload,
): Promise<Warehouse> {
  const response = await api.post<ApiResponse<WarehouseResponse>>(
    BASE_URL,
    payload,
  );

  return response.data.data.warehouse;
}

export async function updateWarehouse(
  id: string,
  payload: UpdateWarehousePayload,
): Promise<Warehouse> {
  const response = await api.patch<ApiResponse<WarehouseResponse>>(
    `${BASE_URL}/${id}`,
    payload,
  );

  return response.data.data.warehouse;
}

export async function activateWarehouse(id: string): Promise<Warehouse> {
  const response = await api.patch<ApiResponse<WarehouseResponse>>(
    `${BASE_URL}/${id}/activate`,
  );

  return response.data.data.warehouse;
}

export async function deactivateWarehouse(id: string): Promise<Warehouse> {
  const response = await api.patch<ApiResponse<WarehouseResponse>>(
    `${BASE_URL}/${id}/deactivate`,
  );

  return response.data.data.warehouse;
}

export async function deleteWarehouse(id: string): Promise<Warehouse> {
  const response = await api.delete<ApiResponse<WarehouseResponse>>(
    `${BASE_URL}/${id}`,
  );

  return response.data.data.warehouse;
}
