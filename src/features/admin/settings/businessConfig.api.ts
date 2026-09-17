import { api } from "../../../lib/api";
import type {
  BusinessConfig,
  BusinessConfigRecord,
  BusinessConfigResponse,
} from "./businessConfig.types";


const BUSINESS_CONFIG_URL = "/api/business-config";

export async function getBusinessConfigs(): Promise<BusinessConfig> {
  const response = await api.get<BusinessConfigResponse<BusinessConfig>>(
    BUSINESS_CONFIG_URL,
  );

  return response.data.data;
}

export async function getBusinessConfigByKey<T>(
  key: keyof BusinessConfig,
): Promise<BusinessConfigRecord<T>> {
  const response = await api.get<BusinessConfigResponse<BusinessConfigRecord<T>>>(
    `${BUSINESS_CONFIG_URL}/${key}`,
  );

  return response.data.data;
}

export async function updateBusinessConfig<T>(
  key: keyof BusinessConfig,
  value: T,
): Promise<BusinessConfigRecord<T>> {
  const response = await api.patch<BusinessConfigResponse<BusinessConfigRecord<T>>>(
    `${BUSINESS_CONFIG_URL}/${key}`,
    { value },
  );

  return response.data.data;
}
