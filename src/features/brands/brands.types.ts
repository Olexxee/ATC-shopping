export interface BrandMedia {
  id: string;
  url: string;
  publicId: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  format: string | null;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface BrandApi {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  media: BrandMedia[];
  _count?: {
    products: number;
  };
}
