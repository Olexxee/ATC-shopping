export interface BrandMedia {
  id: string;
  url: string;
  publicId: string;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  format?: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBrand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  media: BrandMedia[];
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrandFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

export interface BrandFormValues {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

export interface BrandListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BrandListResponse {
  data: AdminBrand[];
  meta: BrandListMeta;
}

export interface BrandResponse {
  data: AdminBrand;
}
