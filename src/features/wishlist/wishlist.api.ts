import { api } from "../../lib/api";

import type {
  AddToWishlistPayload,
  BatchWishlistCheckResult,
  WishlistItem,
  WishlistListParams,
  WishlistListResult,
} from "./wishlist.types";

export const getWishlist = async (
  params?: WishlistListParams,
): Promise<WishlistListResult> => {
  const response = await api.get("/api/wishlist", { params });
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
};

export const addToWishlist = async (
  payload: AddToWishlistPayload,
): Promise<WishlistItem> => {
  const response = await api.post("/api/wishlist", payload);

  return response.data.data;
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  await api.delete(`/api/wishlist/${productId}`);
};

export const clearWishlist = async (): Promise<void> => {
  await api.delete("/api/wishlist/clear");
};

export const checkInWishlist = async (productId: string): Promise<boolean> => {
  const response = await api.get(`/api/wishlist/${productId}/check`);

  return response.data.data.inWishlist;
};

export const batchCheckWishlist = async (
  productIds: string[],
): Promise<BatchWishlistCheckResult> => {
  const response = await api.post("/api/wishlist/batch-check", {
    productIds,
  });

  return response.data.data;
};
