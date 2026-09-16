import { api } from "../../lib/api";
import type {
  GetMyOrdersQuery,
  OrderResponse,
  OrdersResponse,
} from "./order.types";

export const getOrderById = async (
  orderId: string,
): Promise<OrderResponse> => {
  const response = await api.get<OrderResponse>(
    `/api/orders/${orderId}`,
  );

  return response.data;
};

export const getMyOrders = async (
  params?: GetMyOrdersQuery,
): Promise<OrdersResponse> => {
  const response = await api.get<OrdersResponse>(
    "/api/orders/me",
    {
      params,
    },
  );

  return response.data;
};
