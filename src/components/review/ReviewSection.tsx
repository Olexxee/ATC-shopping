// src/components/review/ReviewSection.tsx

import { useMemo } from "react";
import {
  useVariantReviewStats,
  useVariantReviews,
} from "../../features/reviews/review.queries";
import { ReviewCard } from "./ReviewCard";
import { ReviewSectionSkeleton } from "./ReviewSectionSkeleton";
import { ReviewSummary } from "./ReviewSummary";

interface ReviewSectionProps {
  variantId: string;
}

export function ReviewSection({ variantId }: ReviewSectionProps) {
  const statsQuery = useVariantReviewStats(variantId);

  const reviewsQuery = useVariantReviews(variantId, 10);

  const reviews = useMemo(
    () => reviewsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [reviewsQuery.data],
  );

  const stats = statsQuery.data;

  if (statsQuery.isLoading || reviewsQuery.isLoading) {
    return <ReviewSectionSkeleton />;
  }

  if (statsQuery.isError || reviewsQuery.isError) {
    return (
      <section className="mt-20 border-t border-neutral-200 pt-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Customer reviews
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            Reviews
          </h2>

          <p className="mt-4 text-sm text-red-600">Failed to load reviews.</p>

          <button
            type="button"
            onClick={() => {
              statsQuery.refetch();
              reviewsQuery.refetch();
            }}
            className="mt-3 text-sm font-medium text-neutral-950 underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <section className="mt-20 border-t border-neutral-200 pt-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Customer reviews
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            Reviews
          </h2>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 px-6 py-12 text-center">
          <p className="text-sm font-medium text-neutral-950">No reviews yet</p>

          <p className="mt-2 text-sm text-neutral-500">
            Be the first customer to review this product.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20 border-t border-neutral-200 pt-12">
      {/* Heading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Customer reviews
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
          What customers are saying
        </h2>
      </div>

      {/* Summary */}
      <div className="mt-8">
        <ReviewSummary stats={stats} />
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <h3 className="text-sm font-semibold text-neutral-950">
            Customer feedback
          </h3>

          <span className="text-xs text-neutral-400">
            {stats.totalReviews.toLocaleString()}{" "}
            {stats.totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>

        {reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-sm text-neutral-500">
            No reviews are currently available.
          </p>
        )}
      </div>

      {/* Load more */}
      {reviewsQuery.hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => reviewsQuery.fetchNextPage()}
            disabled={reviewsQuery.isFetchingNextPage}
            className="inline-flex h-10 items-center rounded-full border border-neutral-200 px-5 text-sm font-medium text-neutral-900 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {reviewsQuery.isFetchingNextPage
              ? "Loading..."
              : "Load more reviews"}
          </button>
        </div>
      )}
    </section>
  );
}
