import { useMutation } from "@tanstack/react-query";

import { createCheckoutOrder } from "./checkout.api";

import type { CheckoutPayload } from "./checkout.types";

export const useCheckout = () => {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) =>
      createCheckoutOrder(payload),
  });
};
