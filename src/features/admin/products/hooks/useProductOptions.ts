import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../lib/api";

export interface ProductOption {
  id: string;
  name: string;
  slug?: string;
}

interface ProductOptionsEnvelope {
  success: boolean;
  data:
    | ProductOption[]
    | {
        brands?: ProductOption[];
        categories?: ProductOption[];
        collections?: ProductOption[];
      };
}

export const productOptionsKeys = {
  all: ["admin-product-options"] as const,
  brands: () => [...productOptionsKeys.all, "brands"] as const,
  categories: () => [...productOptionsKeys.all, "categories"] as const,
  collections: () => [...productOptionsKeys.all, "collections"] as const,
};

const unwrap = (
  envelope: ProductOptionsEnvelope,
  key: "brands" | "categories" | "collections",
): ProductOption[] => {
  const data = envelope.data;
  if (Array.isArray(data)) return data;
  return data[key] ?? [];
};

async function getBrands(): Promise<ProductOption[]> {
  const response = await api.get<ProductOptionsEnvelope>("/api/brands", {
    params: { limit: 100 },
  });
  return unwrap(response.data, "brands");
}

async function getCategories(): Promise<ProductOption[]> {
  // ⚠️ Backend mounts: app.use("/api/category", categoryRouter) — singular.
  const response = await api.get<ProductOptionsEnvelope>("/api/category", {
    params: { limit: 100 },
  });
  return unwrap(response.data, "categories");
}

async function getCollections(): Promise<ProductOption[]> {
  const response = await api.get<ProductOptionsEnvelope>("/api/collections", {
    params: { limit: 100 },
  });
  return unwrap(response.data, "collections");
}

const STALE = 5 * 60 * 1000;

export function useProductBrands() {
  return useQuery({
    queryKey: productOptionsKeys.brands(),
    queryFn: getBrands,
    staleTime: STALE,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: productOptionsKeys.categories(),
    queryFn: getCategories,
    staleTime: STALE,
  });
}

export function useProductCollections() {
  return useQuery({
    queryKey: productOptionsKeys.collections(),
    queryFn: getCollections,
    staleTime: STALE,
  });
}
