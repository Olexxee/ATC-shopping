import { api } from "../../lib/api";
import type {
  CheckoutPayload,
  CheckoutResponse,
  CreateFlexPayPlanPayload,
  CreateFlexPayPlanResponse,
  InitializeFlexPayPaymentPayload,
  InitializeFlexPayPaymentResponse,
} from "./checkout.types";

export const createCheckoutOrder = async (
  payload: CheckoutPayload,
): Promise<CheckoutResponse> => {
  const response = await api.post<CheckoutResponse>(
    "/api/orders/checkout",
    payload,
  );

  return response.data;
};

export const createFlexPayPlan = async (
  payload: CreateFlexPayPlanPayload,
): Promise<CreateFlexPayPlanResponse> => {
  const response = await api.post<CreateFlexPayPlanResponse>(
    "/api/installments/plans",
    payload,
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
