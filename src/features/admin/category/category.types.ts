export type CategoryType = "PRODUCT" | "SERVICE" | "CONTENT";

export interface CategoryMedia {
  id: string;
  url: string;
  publicId: string;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  format?: string | null;
  alt?: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryParent {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryChild {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  type: CategoryType;
  isActive: boolean;
  sortOrder: number;
  parentId?: string | null;

  parent?: CategoryParent | null;
  children: CategoryChild[];

  media: CategoryMedia[];
  image?: CategoryMedia | null;

  productCount: number;
  childCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  type?: CategoryType;
  isActive?: boolean;
  parentId?: string | null;
  search?: string;
}

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  type: CategoryType;
  parentId: string;
  isActive: boolean;
  sortOrder: number;
  alt: string;
}

export interface CategoryListMeta {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoryListResponse {
  data: AdminCategory[];
  meta: CategoryListMeta;
}

export interface CategoryResponse {
  data: AdminCategory;
}
