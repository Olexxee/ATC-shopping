// src/components/review/ReviewSummary.tsx

import type { ReviewStats } from "../../api/review/review.contract";
import { ReviewStars } from "./ReviewStars";

interface ReviewSummaryProps {
  stats: ReviewStats;
}

export function ReviewSummary({ stats }: ReviewSummaryProps) {
  const total = stats.totalReviews;

  return (
    <div className="grid gap-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      {/* Average */}
      <div className="flex flex-col justify-center">
        <p className="text-5xl font-semibold tracking-tight text-neutral-950">
          {stats.averageRating.toFixed(1)}
        </p>

        <div className="mt-3">
          <ReviewStars rating={stats.averageRating} size="md" />
        </div>

        <p className="mt-3 text-sm text-neutral-500">
          {total.toLocaleString()} {total === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Distribution */}
      <div className="flex flex-col justify-center gap-2.5">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count =
            stats.ratingDistribution[
              rating as keyof typeof stats.ratingDistribution
            ];

          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3 text-sm">
              <span className="w-10 shrink-0 text-neutral-500">
                {rating} star
              </span>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-neutral-950 transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <span className="w-8 shrink-0 text-right text-xs text-neutral-400">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
