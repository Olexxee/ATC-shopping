import { api } from "../../../lib/api";
import type {
  ApiResponse,
  CreateShippingConfigurationPayload,
  CreateShippingRulePayload,
  ShippingConfiguration,
  ShippingRule,
  UpdateShippingConfigurationPayload,
  UpdateShippingRulePayload,
} from "./shipping.types";

const BASE_URL = "/api/shipping";

export async function getShippingConfigurations(): Promise<
  ShippingConfiguration[]
> {
  const response = await api.get<ApiResponse<ShippingConfiguration[]>>(
    `${BASE_URL}/configurations`,
  );

  return response.data.data;
}

export async function getShippingConfiguration(
  id: string,
): Promise<ShippingConfiguration> {
  const response = await api.get<ApiResponse<ShippingConfiguration>>(
    `${BASE_URL}/configurations/${id}`,
  );

  return response.data.data;
}

export async function createShippingConfiguration(
  payload: CreateShippingConfigurationPayload,
): Promise<ShippingConfiguration> {
  const response = await api.post<ApiResponse<ShippingConfiguration>>(
    `${BASE_URL}/configurations`,
    payload,
  );

  return response.data.data;
}

export async function updateShippingConfiguration(
  id: string,
  payload: UpdateShippingConfigurationPayload,
): Promise<ShippingConfiguration> {
  const response = await api.patch<ApiResponse<ShippingConfiguration>>(
    `${BASE_URL}/configurations/${id}`,
    payload,
  );

  return response.data.data;
}

export async function getShippingRules(
  configurationId?: string,
): Promise<ShippingRule[]> {
  const response = await api.get<ApiResponse<ShippingRule[]>>(
    `${BASE_URL}/rules`,
    {
      params: configurationId ? { configurationId } : undefined,
    },
  );

  return response.data.data;
}

export async function getShippingRule(id: string): Promise<ShippingRule> {
  const response = await api.get<ApiResponse<ShippingRule>>(
    `${BASE_URL}/rules/${id}`,
  );

  return response.data.data;
}

export async function createShippingRule(
  payload: CreateShippingRulePayload,
): Promise<ShippingRule> {
  const response = await api.post<ApiResponse<ShippingRule>>(
    `${BASE_URL}/rules`,
    payload,
  );

  return response.data.data;
}

export async function updateShippingRule(
  id: string,
  payload: UpdateShippingRulePayload,
): Promise<ShippingRule> {
  const response = await api.patch<ApiResponse<ShippingRule>>(
    `${BASE_URL}/rules/${id}`,
    payload,
  );

  return response.data.data;
}

export async function deleteShippingRule(id: string): Promise<void> {
  await api.delete(`${BASE_URL}/rules/${id}`);
}
