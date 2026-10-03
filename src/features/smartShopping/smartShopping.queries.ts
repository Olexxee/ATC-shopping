import { useMutation } from "@tanstack/react-query";

import { smartShop } from "./smartShopping.api";
import type { SmartShoppingRequest } from "./smartShopping.types";

export function useSmartShopping() {
  return useMutation({
    mutationFn: (payload: SmartShoppingRequest) => smartShop(payload),
  });
}
