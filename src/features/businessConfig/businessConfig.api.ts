import { api } from "../../lib/api";
import type { StoreSettingsApi } from "../../types/business-config";

interface StorefrontConfigResponse {
  success: boolean;
  message: string;
  data: StoreSettingsApi;
}

export const businessConfigApi = {
  async getStorefrontConfig(): Promise<StoreSettingsApi> {
    const response =
      await api.get<StorefrontConfigResponse>("/api/storefront/config");

    return response.data.data;
  },
};
