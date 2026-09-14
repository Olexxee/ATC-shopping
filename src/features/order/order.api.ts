import { api } from "../../lib/api";
import type { OrderResponse } from "./order.types";

export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const response = await api.get<OrderResponse>(`/api/orders/${orderId}`);

  return response.data;
};
