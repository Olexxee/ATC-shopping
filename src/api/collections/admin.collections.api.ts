// admin/admin.collections.api.ts
import { api } from "../../lib/api";
import type { Collection } from "../../types/collection.types";

export interface CreateCollectionPayload {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCollectionPayload extends Partial<CreateCollectionPayload> {}

export const createCollection = async (
  payload: CreateCollectionPayload,
): Promise<Collection> => {
  const response = await api.post("/api/admin/collections", payload);
  return response.data.data;
};

export const updateCollection = async (
  id: string,
  payload: UpdateCollectionPayload,
): Promise<Collection> => {
  const response = await api.patch(`/api/admin/collections/${id}`, payload);
  return response.data.data;
};

export const deleteCollection = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/collections/${id}`);
};
