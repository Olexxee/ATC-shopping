export interface ReviewImage {
  id: string;
  url: string;
  publicId: string;
  mimeType: string | null;
  bytes: number | null;
  format: string | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
  createdAt: string;
}

export interface ReviewUser {
  id: string;
  fullName: string;
}

export interface ReviewListPage {
  data: Review[];
  pagination?: ReviewPagination;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

export interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
}

export interface ReviewVariant {
  id: string;
  product: ReviewProduct;
}

export interface Review {
  id: string;
  userId: string;
  variantId: string;
  orderId: string | null;

  rating: number;
  title: string | null;
  comment: string | null;

  isVerified: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";

  helpfulCount: number;
  notHelpfulCount: number;

  createdAt: string;
  updatedAt: string;

  user: ReviewUser;
  variant: ReviewVariant;

  images: ReviewImage[];
  responses: ReviewResponse[];
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ReviewListResponse {
  pagination: any;
  data: Review[];
  meta: {
    pagination: ReviewPagination;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
