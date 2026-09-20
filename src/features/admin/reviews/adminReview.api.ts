import { api } from "../../../lib/api";
import type {
  Review,
  ReviewPagination,
} from "../../../api/review/review.contract";


interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: ReviewPagination;
  };
}

export interface AdminReviewQueryParams {
  page?: number;
  limit?: number;
  variantId?: string;
  userId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminReviewList {
  data: Review[];
  pagination?: ReviewPagination;
}

export interface ModerateReviewData {
  status: "APPROVED" | "REJECTED";
  response?: string;
}

export interface AddReviewResponseData {
  comment: string;
}

export const getAdminReviews = async (
  params?: AdminReviewQueryParams,
): Promise<AdminReviewList> => {
  const res = await api.get<Envelope<Review[]>>(
    "/api/reviews/admin/all",
    {
      params,
    },
  );

  return {
    data: res.data.data,
    pagination: res.data.meta?.pagination,
  };
};

export const moderateReview = async (
  reviewId: string,
  data: ModerateReviewData,
): Promise<Review> => {
  const res = await api.patch<Envelope<Review>>(
    `/api/reviews/admin/${reviewId}/moderate`,
    data,
  );

  return res.data.data;
};

export const addReviewResponse = async (
  reviewId: string,
  data: AddReviewResponseData,
): Promise<Review> => {
  const res = await api.post<Envelope<Review>>(
    `/api/reviews/admin/${reviewId}/response`,
    data,
  );

  return res.data.data;
};

export const deleteReviewResponse = async (
 responseId: string,
): Promise<unknown> => {
  const res = await api.delete<Envelope<unknown>>(
    `/api/reviews/admin/response/${responseId}`,
  );

  return res.data.data;
};
