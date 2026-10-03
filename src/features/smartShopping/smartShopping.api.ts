import {api} from "../../lib/api";

import type {
  SmartShoppingRequest,
  SmartShoppingResult,
} from "./smartShopping.types";

export async function smartShop(
  payload: SmartShoppingRequest,
): Promise<SmartShoppingResult> {
  const response = await api.post(
    "/api/smart-shopping",
    payload,
  );

  console.log("SMART SHOPPING RAW RESPONSE:", response);
  console.log(
    "SMART SHOPPING RESPONSE DATA:",
    response.data,
  );

  return response.data.data;
}