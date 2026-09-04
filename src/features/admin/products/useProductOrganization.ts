import { useQuery } from "@tanstack/react-query";
import { getBrands, getCategories, getCollections } from "./adminCatalog.api";

export const productOrganizationKeys = {
  all: ["product-organization"] as const,

  brands: () => [...productOrganizationKeys.all, "brands"] as const,

  categories: () => [...productOrganizationKeys.all, "categories"] as const,

  collections: () => [...productOrganizationKeys.all, "collections"] as const,
};

export function useProductBrands() {
  return useQuery({
    queryKey: productOrganizationKeys.brands(),
    queryFn: getBrands,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: productOrganizationKeys.categories(),
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductCollections() {
  return useQuery({
    queryKey: productOrganizationKeys.collections(),
    queryFn: getCollections,
    staleTime: 5 * 60 * 1000,
  });
}
