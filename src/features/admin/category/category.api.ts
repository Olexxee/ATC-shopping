import {api} from "../../../lib/api";
import type {
  CategoryFilters,
  CategoryFormValues,
  CategoryListResponse,
  CategoryResponse,
} from "./category.types";

const CATEGORY_BASE = "/api/category";

export async function getAdminCategories(
  filters: CategoryFilters = {},
): Promise<CategoryListResponse> {
  const response = await api.get(CATEGORY_BASE, {
    params: {
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
      ...(filters.type && { type: filters.type }),
      ...(filters.isActive !== undefined && {
        isActive: filters.isActive,
      }),
      ...(filters.parentId !== undefined && {
        parentId: filters.parentId || "",
      }),
      ...(filters.search?.trim() && {
        search: filters.search.trim(),
      }),
    },
  });

  return response.data;
}

export async function getAdminCategory(): Promise<CategoryResponse> {
  /*
   * The backend currently exposes lookup by slug publicly,
   * not GET /categories/:id.
   *
   * Therefore this function should not be used until we have
   * an ID lookup endpoint or we obtain the category from the
   * list cache.
   */
  throw new Error(
    "Direct category-by-ID lookup is not currently supported by the API.",
  );
}

export async function createCategory(
  values: CategoryFormValues,
  image?: File | null,
): Promise<CategoryResponse> {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("slug", values.slug);
  formData.append("description", values.description);
  formData.append("type", values.type);
  formData.append("parentId", values.parentId);
  formData.append("isActive", String(values.isActive));
  formData.append("sortOrder", String(values.sortOrder));
  formData.append("alt", values.alt);

  if (image) {
    formData.append("image", image);
  }

  const response = await api.post(CATEGORY_BASE, formData);

  return response.data;
}

export async function updateCategory(
  id: string,
  values: CategoryFormValues,
  image?: File | null,
): Promise<CategoryResponse> {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("slug", values.slug);
  formData.append("description", values.description);
  formData.append("type", values.type);
  formData.append("parentId", values.parentId);
  formData.append("isActive", String(values.isActive));
  formData.append("sortOrder", String(values.sortOrder));
  formData.append("alt", values.alt);

  if (image) {
    formData.append("image", image);
  }

  const response = await api.patch(`${CATEGORY_BASE}/${id}`, formData);

  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`${CATEGORY_BASE}/${id}`);
}
