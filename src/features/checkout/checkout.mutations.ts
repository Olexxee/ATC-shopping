import { useMutation } from "@tanstack/react-query";

import {
  createCheckoutOrder,
  createFlexPayPlan,
  initializeFlexPayPayment,
} from "./checkout.api";

import type {
  CheckoutPayload,
  CreateFlexPayPlanPayload,
  InitializeFlexPayPaymentPayload,
} from "./checkout.types";

export const useCheckout = () => {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => createCheckoutOrder(payload),
  });
};

export const useCreateFlexPayPlan = () => {
  return useMutation({
    mutationFn: (payload: CreateFlexPayPlanPayload) =>
      createFlexPayPlan(payload),
  });
};

export const useInitializeFlexPayPayment = () => {
  return useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: string;
      payload: InitializeFlexPayPaymentPayload;
    }) => initializeFlexPayPayment(planId, payload),
  });
};
