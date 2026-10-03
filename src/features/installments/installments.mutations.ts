import { useMutation } from "@tanstack/react-query";
import { initializeFlexPayPayment } from "./installments.api";
import type { InitializeFlexPayPaymentPayload } from "./installments.types";

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
