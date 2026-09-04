export interface CategoryMedia {
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
  type: "PRODUCT" | "SERVICE" | "CONTENT";
  isActive: boolean;
  sortOrder: number;
}

export interface CategoryApi {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: "PRODUCT" | "SERVICE" | "CONTENT";
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;

  parent: CategoryParent | null;
  children: CategoryChild[];

  media: CategoryMedia[];

  image: CategoryMedia | null;

  productCount: number;
  childCount: number;

  createdAt: string;
  updatedAt: string;
}