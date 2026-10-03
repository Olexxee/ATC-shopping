import {api} from "../../../lib/api";

import type {
  AdminFlexPayListResponse,
  AdminFlexPayPlan,
  FlexPayPayment,
  FlexPayStats,
} from "./flexpay.types";

interface GetFlexPayParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const getAdminFlexPayPlans = async (
  params: GetFlexPayParams = {},
): Promise<AdminFlexPayListResponse> => {
  const response = await api.get("/admin/flexpay", {
    params,
  });

  return response.data;
};

export const getAdminFlexPayStats = async (): Promise<FlexPayStats> => {
  const response = await api.get("/admin/flexpay/stats");

  return response.data.data;
};

export const getAdminFlexPayPlan = async (
  planId: string,
): Promise<AdminFlexPayPlan> => {
  const response = await api.get(`/admin/flexpay/${planId}`);

  return response.data.data;
};

export const getAdminFlexPayPayments = async (
  planId: string,
): Promise<FlexPayPayment[]> => {
  const response = await api.get(`/admin/flexpay/${planId}/payments`);

  return response.data.data;
};

export const getAdminFlexPayPayment = async (
  paymentId: string,
): Promise<FlexPayPayment> => {
  const response = await api.get(`/admin/flexpay/payments/${paymentId}`);

  return response.data.data;
};

export const cancelAdminFlexPayPlan = async (
  planId: string,
): Promise<AdminFlexPayPlan> => {
  const response = await api.post(`/admin/flexpay/${planId}/cancel`);

  return response.data.data;
};
