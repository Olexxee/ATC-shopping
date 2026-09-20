// src/components/review/ReviewCard.tsx

import { CheckCircle2, ThumbsUp } from "lucide-react";
import type { Review } from "../../api/review/review.contract";
import { ReviewStars } from "./ReviewStars";

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  helpfulPending?: boolean;
}

export function ReviewCard({
  review,
  onHelpful,
  helpfulPending = false,
}: ReviewCardProps) {
  const reviewerName = review.user?.fullName?.trim() || "Anonymous customer";

  const date = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="border-b border-neutral-200 py-7 last:border-b-0">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm font-medium text-neutral-950">{reviewerName}</p>

        {review.isVerified && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600">
            <CheckCircle2 size={14} />
            Verified purchase
          </span>
        )}

        <span className="text-xs text-neutral-400">{date}</span>
      </div>

      {/* Rating */}
      <div className="mt-3">
        <ReviewStars rating={review.rating} size="sm" />
      </div>

      {/* Title */}
      {review.title && (
        <h3 className="mt-4 text-sm font-semibold text-neutral-950">
          {review.title}
        </h3>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-neutral-600">
          {review.comment}
        </p>
      )}

      {/* Images */}
      {review.images.length > 0 && (
        <div className="mt-5 flex gap-3 overflow-x-auto">
          {review.images.map((image) => (
            <a
              key={image.id}
              href={image.url}
              target="_blank"
              rel="noreferrer"
              className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100"
            >
              <img
                src={image.url}
                alt="Customer review"
                loading="lazy"
                className="h-full w-full object-cover transition hover:scale-105"
              />
            </a>
          ))}
        </div>
      )}

      {/* Helpful */}
      {onHelpful && (
        <button
          type="button"
          onClick={() => onHelpful(review.id)}
          disabled={helpfulPending}
          className="mt-5 inline-flex items-center gap-2 text-xs text-neutral-500 transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ThumbsUp size={14} />
          Helpful
          {review.helpfulCount > 0 && <span>({review.helpfulCount})</span>}
        </button>
      )}

      {/* Seller response */}
      {review.responses.length > 0 && (
        <div className="mt-5 rounded-xl bg-neutral-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
            Seller response
          </p>

          <div className="mt-2 space-y-2">
            {review.responses.map((response) => (
              <p
                key={response.id}
                className="text-sm leading-6 text-neutral-600"
              >
                {response.comment}
              </p>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
