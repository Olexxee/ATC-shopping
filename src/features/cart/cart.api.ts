import { api } from "../../lib/api";

import type {
  AddCartItemPayload,
  Cart,
  CartSummary,
  CartValidation,
  UpdateCartItemPayload,
} from "./cart.types";

export const getCart = async (): Promise<Cart> => {
  const response = await api.get("/api/cart");

  return response.data.data;
};

export const getCartSummary = async (): Promise<CartSummary> => {
  const response = await api.get("/api/cart/summary");

  return response.data.data;
};

export const validateCart = async (): Promise<CartValidation> => {
  const response = await api.get("/api/cart/validate");

  return response.data.data;
};

export const addCartItem = async (
  payload: AddCartItemPayload,
): Promise<Cart> => {
  const response = await api.post("/api/cart/items", payload);

  return response.data.data;
};

export const updateCartItem = async (
  variantId: string,
  payload: UpdateCartItemPayload,
): Promise<Cart> => {
  const response = await api.patch(`/api/cart/items/${variantId}`, payload);

  return response.data.data;
};

export const removeCartItem = async (variantId: string): Promise<Cart> => {
  const response = await api.delete(`/api/cart/items/${variantId}`);

  return response.data.data;
};

export const clearCart = async (): Promise<Cart> => {
  const response = await api.delete("/api/cart/clear");

  return response.data.data;
};
