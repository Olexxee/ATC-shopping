import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createReview,
  getMyReviews,
  getVariantReviewStats,
  getVariantReviews,
} from "../../api/review/review.api";

import type { CreateReviewData } from "../../api/review/review.api";

export const reviewKeys = {
  all: ["reviews"] as const,

  variant: (variantId: string) =>
    [...reviewKeys.all, "variant", variantId] as const,

  variantStats: (variantId: string) =>
    [...reviewKeys.all, "variant", variantId, "stats"] as const,

  mine: () =>
    [...reviewKeys.all, "mine"] as const,
};

export function useVariantReviews(
  variantId: string,
  limit = 10,
) {
  return useInfiniteQuery({
    queryKey: reviewKeys.variant(variantId),

    queryFn: ({ pageParam }) =>
      getVariantReviews(variantId, {
        page: pageParam,
        limit,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;

      if (!pagination) return undefined;
      if (!pagination.hasNextPage) return undefined;

      return pagination.nextPage ?? undefined;
    },

    enabled: Boolean(variantId),
  });
}

export function useVariantReviewStats(
  variantId: string,
) {
  return useQuery({
    queryKey: reviewKeys.variantStats(variantId),

    queryFn: () =>
      getVariantReviewStats(variantId),

    enabled: Boolean(variantId),
  });
}

export function useMyReviews(
  page = 1,
  limit = 100,
) {
  return useQuery({
    queryKey: [
      ...reviewKeys.mine(),
      { page, limit },
    ],

    queryFn: () =>
      getMyReviews({
        page,
        limit,
      }),

    enabled: true,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) =>
      createReview(data),

    onSuccess: async (review) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: reviewKeys.variant(
            review.variantId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: reviewKeys.variantStats(
            review.variantId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: reviewKeys.mine(),
        }),
      ]);
    },
  });
}