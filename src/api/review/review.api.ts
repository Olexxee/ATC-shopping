import { api } from "../../lib/api";
import type {
  Review,
  ReviewListPage,
  ReviewPagination,
  ReviewStats,
} from "./review.contract";

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: ReviewPagination;
  };
  context?: string;
}

export interface GetVariantReviewsParams {
  page?: number;
  limit?: number;
}

export interface GetMyReviewsParams {
  page?: number;
  limit?: number;
}

export interface CreateReviewData {
  variantId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: File[];
}

export const getVariantReviews = async (
  variantId: string,
  params?: GetVariantReviewsParams,
): Promise<ReviewListPage> => {
  const res = await api.get<Envelope<Review[]>>(
    `/api/reviews/variant/${variantId}`,
    { params },
  );

  return {
    data: res.data.data,
    pagination: res.data.meta?.pagination,
  };
};

export const getVariantReviewStats = async (
  variantId: string,
): Promise<ReviewStats> => {
  const res = await api.get<Envelope<ReviewStats>>(
    `/api/reviews/variant/${variantId}/stats`,
  );

  return res.data.data;
};

export const getMyReviews = async (
  params?: GetMyReviewsParams,
): Promise<ReviewListPage> => {
  const res = await api.get<Envelope<Review[]>>(
    "/api/reviews/me",
    { params },
  );

  return {
    data: res.data.data,
    pagination: res.data.meta?.pagination,
  };
};

export const createReview = async (
  data: CreateReviewData,
): Promise<Review> => {
  const formData = new FormData();

  formData.append("variantId", data.variantId);
  formData.append("rating", String(data.rating));

  if (data.orderId) {
    formData.append("orderId", data.orderId);
  }

  if (data.title?.trim()) {
    formData.append("title", data.title.trim());
  }

  if (data.comment?.trim()) {
    formData.append("comment", data.comment.trim());
  }

  data.images?.forEach((image) => {
    formData.append("images", image);
  });

  const res = await api.post<Envelope<Review>>(
    "/api/reviews",
    formData,
  );

  return res.data.data;
};
