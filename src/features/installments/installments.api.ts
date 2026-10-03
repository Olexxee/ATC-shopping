import { api } from "../../lib/api";
import type {
  FlexPayPlanResponse,
  FlexPayPlansResponse,
  InitializeFlexPayPaymentPayload,
  InitializeFlexPayPaymentResponse,
} from "./installments.types";

export const getFlexPayPlans = async (): Promise<FlexPayPlansResponse> => {
  const response = await api.get<FlexPayPlansResponse>(
    "/api/installments/plans",
  );

  return response.data;
};

export const getFlexPayPlan = async (
  planId: string,
): Promise<FlexPayPlanResponse> => {
  const response = await api.get<FlexPayPlanResponse>(
    `/api/installments/plans/${encodeURIComponent(planId)}`,
  );

  return response.data;
};

export const initializeFlexPayPayment = async (
  planId: string,
  payload: InitializeFlexPayPaymentPayload,
): Promise<InitializeFlexPayPaymentResponse> => {
  const response = await api.post<InitializeFlexPayPaymentResponse>(
    `/api/installments/plans/${encodeURIComponent(planId)}/pay`,
    payload,
  );

  return response.data;
};
