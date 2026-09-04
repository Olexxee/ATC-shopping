import {api} from "../../../lib/api";

import type {
  BrandFilters,
  BrandFormValues,
  BrandListResponse,
  BrandResponse,
} from "./brand.types";

const BRAND_BASE = "/api/brands";

export async function getAdminBrands(
  filters: BrandFilters = {},
): Promise<BrandListResponse> {
  const response = await api.get(BRAND_BASE, {
    params: {
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,

      ...(filters.isActive !== undefined && {
        isActive: filters.isActive,
      }),

      ...(filters.search?.trim() && {
        search: filters.search.trim(),
      }),
    },
  });

  const payload = response.data;

  return {
    ...payload,
    data: payload.data.map((brand: any) => ({
      ...brand,
      media: brand.media ?? [],
      productCount: brand._count?.products ?? 0,
    })),
  };
}

export async function getAdminBrand(id: string): Promise<BrandResponse> {
  const response = await api.get(`${BRAND_BASE}/${id}`);

  const brand = response.data.data;

  return {
    ...response.data,
    data: {
      ...brand,
      media: brand.media ?? [],
      productCount: brand.products?.length ?? 0,
    },
  };
}

export async function createBrand(
  values: BrandFormValues,
  image?: File | null,
): Promise<BrandResponse> {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("slug", values.slug);
  formData.append("description", values.description);
  formData.append("isActive", String(values.isActive));
  formData.append("sortOrder", String(values.sortOrder));

  if (image) {
    formData.append("image", image);
  }

  const response = await api.post(BRAND_BASE, formData);

  return response.data;
}

export async function updateBrand(
  id: string,
  values: BrandFormValues,
  image?: File | null,
): Promise<BrandResponse> {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("slug", values.slug);
  formData.append("description", values.description);
  formData.append("isActive", String(values.isActive));
  formData.append("sortOrder", String(values.sortOrder));

  if (image) {
    formData.append("image", image);
  }

  const response = await api.patch(`${BRAND_BASE}/${id}`, formData);

  return response.data;
}

export async function updateBrandLogo(
  id: string,
  image: File,
): Promise<BrandResponse> {
  const formData = new FormData();

  formData.append("image", image);

  const response = await api.patch(`${BRAND_BASE}/${id}/logo`, formData);

  return response.data;
}

export async function deleteBrand(id: string): Promise<void> {
  await api.delete(`${BRAND_BASE}/${id}`);
}
