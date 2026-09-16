import { api } from "../../lib/api";

import type { CheckoutPayload, CheckoutResponse } from "./checkout.types";

export const createCheckoutOrder = async (
  payload: CheckoutPayload,
): Promise<CheckoutResponse> => {
  const response = await api.post<CheckoutResponse>(
    "/api/orders/checkout",
    payload,
  );

  return response.data;
};
