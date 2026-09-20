import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Search,
  Star,
  X,
} from "lucide-react";
import {
  useAdminReviews,
  useAddReviewResponse,
  useModerateReview,
} from "../../features/admin/reviews/useAdminReviews"
import type { Review } from "../../api/review/review.contract";


const PAGE_SIZE = 20;

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "" | "PENDING" | "APPROVED" | "REJECTED"
  >("");

  const [activeReviewId, setActiveReviewId] = useState<string | null>(
    null,
  );

  const [responseReviewId, setResponseReviewId] = useState<
    string | null
  >(null);

  const [responseText, setResponseText] = useState("");

  const reviewsQuery = useAdminReviews({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
    status: status || undefined,
  });

  const moderateMutation = useModerateReview();
  const responseMutation = useAddReviewResponse();

  const reviews = reviewsQuery.data?.data ?? [];
  const pagination = reviewsQuery.data?.pagination;

  const moderate = async (
    review: Review,
    nextStatus: "APPROVED" | "REJECTED",
  ) => {
    const response =
      nextStatus === "APPROVED"
        ? window.prompt(
            "Optional response to the customer:",
          )
        : null;

    await moderateMutation.mutateAsync({
      reviewId: review.id,
      data: {
        status: nextStatus,
        ...(response?.trim()
          ? { response: response.trim() }
          : {}),
      },
    });

    setActiveReviewId(null);
  };

  const submitResponse = async (reviewId: string) => {
    const comment = responseText.trim();

    if (!comment) return;

    await responseMutation.mutateAsync({
      reviewId,
      data: {
        comment,
      },
    });

    setResponseText("");
    setResponseReviewId(null);
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setStatus(
      event.target.value as
        | ""
        | "PENDING"
        | "APPROVED"
        | "REJECTED",
    );
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reviews
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review, moderate, and respond to customer reviews.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search reviews..."
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400"
              />
            </div>

            <select
              value={status}
              onChange={handleStatusChange}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-gray-400"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {reviewsQuery.isLoading ? (
          <ReviewsSkeleton />
        ) : reviewsQuery.isError ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            Unable to load reviews. Please try again.
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />

            <h2 className="mt-4 font-semibold text-gray-900">
              No reviews found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or status filter.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <AdminReviewCard
                key={review.id}
                review={review}
                isActive={activeReviewId === review.id}
                isModerating={moderateMutation.isPending}
                isResponding={
                  responseMutation.isPending &&
                  responseReviewId === review.id
                }
                responseOpen={
                  responseReviewId === review.id
                }
                responseText={responseText}
                onToggle={() =>
                  setActiveReviewId((current) =>
                    current === review.id
                      ? null
                      : review.id,
                  )
                }
                onApprove={() =>
                  moderate(
                    review,
                    "APPROVED",
                  )
                }
                onReject={() =>
                  moderate(
                    review,
                    "REJECTED",
                  )
                }
                onOpenResponse={() => {
                  setResponseReviewId(review.id);
                  setResponseText("");
                }}
                onCloseResponse={() => {
                  setResponseReviewId(null);
                  setResponseText("");
                }}
                onResponseTextChange={setResponseText}
                onSubmitResponse={() =>
                  submitResponse(review.id)
                }
              />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!pagination.hasPrevPage}
                onClick={() =>
                  setPage(
                    pagination.prevPage ??
                      Math.max(1, page - 1),
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  setPage(
                    pagination.nextPage ??
                      page + 1,
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

interface AdminReviewCardProps {
  review: Review;
  isActive: boolean;
  isModerating: boolean;
  isResponding: boolean;
  responseOpen: boolean;
  responseText: string;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
  onOpenResponse: () => void;
  onCloseResponse: () => void;
  onResponseTextChange: (value: string) => void;
  onSubmitResponse: () => void;
}

function AdminReviewCard({
  review,
  isActive,
  isModerating,
  isResponding,
  responseOpen,
  responseText,
  onToggle,
  onApprove,
  onReject,
  onOpenResponse,
  onCloseResponse,
  onResponseTextChange,
  onSubmitResponse,
}: AdminReviewCardProps) {
  const productName =
    review.variant?.product?.name ?? "Unknown product";

  const variant = review.variant;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={review.status} />

                {review.isVerified && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    Verified purchase
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={
                      index < review.rating
                        ? "h-4 w-4 fill-amber-400 text-amber-400"
                        : "h-4 w-4 text-gray-300"
                    }
                  />
                ))}
              </div>

              {review.title && (
                <h2 className="mt-3 font-semibold text-gray-900">
                  {review.title}
                </h2>
              )}

              {review.comment && (
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                  {review.comment}
                </p>
              )}
            </div>

            <div className="shrink-0 lg:text-right">
              <p className="text-sm font-medium text-gray-900">
                {review.user?.fullName ?? "Unknown customer"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {new Date(
                  review.createdAt,
                ).toLocaleDateString()}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                {productName}
              </p>

              {variant?.id && (
                <p className="mt-1 text-xs text-gray-400">
                  Variant: {variant.id}
                </p>
              )}
            </div>
          </div>
        </div>
      </button>

      {isActive && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          {review.images.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-gray-900">
                Customer photos
              </p>

              <div className="flex flex-wrap gap-3">
                {review.images.map((image) => (
                  <a
                    key={image.id}
                    href={image.url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <img
                      src={image.url}
                      alt="Customer review"
                      className="h-full w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Customer
              </p>

              <p className="mt-2 text-sm font-medium text-gray-900">
                {review.user?.fullName ?? "Unknown customer"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                User ID: {review.userId}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Product
              </p>

              <p className="mt-2 text-sm font-medium text-gray-900">
                {productName}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Variant ID: {review.variantId}
              </p>
            </div>
          </div>

          {review.responses.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-medium text-gray-900">
                Admin responses
              </p>

              <div className="space-y-3">
                {review.responses.map((response) => (
                  <div
                    key={response.id}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {response.user?.fullName ??
                            "Admin"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(
                            response.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {response.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {review.status === "PENDING" && (
              <>
                <button
                  type="button"
                  onClick={onApprove}
                  disabled={isModerating}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {isModerating
                    ? "Processing..."
                    : "Approve"}
                </button>

                <button
                  type="button"
                  onClick={onReject}
                  disabled={isModerating}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onOpenResponse}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white"
            >
              <MessageSquare className="h-4 w-4" />
              Respond
            </button>
          </div>

          {responseOpen && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  Respond to review
                </p>

                <button
                  type="button"
                  onClick={onCloseResponse}
                  className="text-sm text-gray-400 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>

              <textarea
                value={responseText}
                onChange={(event) =>
                  onResponseTextChange(
                    event.target.value,
                  )
                }
                rows={4}
                maxLength={1000}
                placeholder="Write a response to the customer..."
                className="mt-3 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
              />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {responseText.length}/1000
                </span>

                <button
                  type="button"
                  onClick={onSubmitResponse}
                  disabled={
                    !responseText.trim() ||
                    isResponding
                  }
                  className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isResponding
                    ? "Sending..."
                    : "Send response"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: Review["status"];
}) {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5"
        >
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
            </div>

            <div className="h-12 w-32 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
