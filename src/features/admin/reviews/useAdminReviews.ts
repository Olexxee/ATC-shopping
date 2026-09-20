import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addReviewResponse,
  deleteReviewResponse,
  getAdminReviews,
  moderateReview,
} from "./adminReview.api";
import type {
  AdminReviewQueryParams,
  AddReviewResponseData,
  ModerateReviewData,
} from "./adminReview.api";

export const adminReviewKeys = {
  all: ["admin-reviews"] as const,

  list: (params?: AdminReviewQueryParams) =>
    [...adminReviewKeys.all, "list", params] as const,
};

export function useAdminReviews(
  params: AdminReviewQueryParams = {},
) {
  return useQuery({
    queryKey: adminReviewKeys.list(params),
    queryFn: () => getAdminReviews(params),
    placeholderData: keepPreviousData,
  });
}

export function useModerateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: ModerateReviewData;
    }) => moderateReview(reviewId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminReviewKeys.all,
      });
    },
  });
}

export function useAddReviewResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: AddReviewResponseData;
    }) => addReviewResponse(reviewId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminReviewKeys.all,
      });
    },
  });
}

export function useDeleteReviewResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responseId: string) =>
      deleteReviewResponse(responseId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminReviewKeys.all,
      });
    },
  });
}
