import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Search,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { Container } from "../../components/layout/Container";
import { useMySourcingRequests } from "../../features/sourcing/sourcing.queries";
import type {
  SourcingRequest,
  SourcingRequestStatus,
} from "../../features/sourcing/sourcing.types";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: Array<{
  value: SourcingRequestStatus | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "All requests" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "RESPONDED", label: "Responded" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function SourcingAccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const statusParam = searchParams.get("status");

  const status = STATUS_OPTIONS.some(
    (option) => option.value === statusParam,
  )
    ? (statusParam as SourcingRequestStatus | "ALL")
    : "ALL";

  const query = useMySourcingRequests({
    page,
    limit: PAGE_SIZE,
    status: status === "ALL" ? undefined : status,
  });

  const requests = query.data?.requests ?? [];

  const pagination = query.data?.pagination ?? {
    page,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  const handleStatusChange = (value: SourcingRequestStatus | "ALL") => {
    const next = new URLSearchParams(searchParams);

    if (value === "ALL") {
      next.delete("status");
    } else {
      next.set("status", value);
    }

    // Always start from page 1 when changing filters.
    next.delete("page");

    setSearchParams(next);
  };

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === page
    ) {
      return;
    }

    const next = new URLSearchParams(searchParams);

    if (nextPage === 1) {
      next.delete("page");
    } else {
      next.set("page", String(nextPage));
    }

    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <Container>
        <div className="py-8 sm:py-10">
          {/* Back */}
          <Link
            to="/account"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
          >
            <ArrowLeft size={16} />
            Account
          </Link>

          {/* Header */}
          <div className="flex flex-col gap-5 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">
                My Account
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                Sourcing Requests
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                Track products you've asked Keplex to find for you.
              </p>
            </div>

            <Link
              to="/sourcing"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              <Plus size={17} />
              Find a product
            </Link>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => {
              const active = status === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  className={[
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Results */}
          <div className="mt-6">
            {query.isLoading ? (
              <SourcingListSkeleton />
            ) : query.isError ? (
              <SourcingError onRetry={() => query.refetch()} />
            ) : requests.length === 0 ? (
              <SourcingEmptyState filtered={status !== "ALL"} />
            ) : (
              <>
                <div className="space-y-3">
                  {requests.map((request) => (
                    <SourcingRequestCard
                      key={request.id}
                      request={request}
                    />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <SourcingPagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    limit={pagination.limit}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

function SourcingRequestCard({
  request,
}: {
  request: SourcingRequest;
}) {
  const primaryImage = request.referenceImages?.[0]?.url;
  const responseCount = request.responses?.length ?? 0;

  return (
    <Link
      to={`/sourcing/${request.id}`}
      className="group block rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm sm:p-5"
    >
      <div className="flex gap-4">
        {/* Reference image */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-24 sm:w-24">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              <ImageIcon size={22} strokeWidth={1.7} />
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-neutral-950">
                {request.title}
              </p>

              <p className="mt-1 text-xs font-medium text-neutral-400">
                {request.requestNumber}
              </p>
            </div>

            <SourcingStatusBadge status={request.status} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(request.createdAt)}
            </span>

            <span>
              {responseCount}{" "}
              {responseCount === 1 ? "response" : "responses"}
            </span>
          </div>
        </div>

        {/* Desktop arrow */}
        <div className="hidden shrink-0 items-center sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-all group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-white">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Mobile action */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 sm:hidden">
        <span className="text-sm font-medium text-neutral-600">
          View request
        </span>

        <ChevronRight size={17} className="text-neutral-400" />
      </div>
    </Link>
  );
}

function SourcingStatusBadge({
  status,
}: {
  status: SourcingRequestStatus;
}) {
  const styles: Record<
    SourcingRequestStatus,
    { label: string; className: string }
  > = {
    SUBMITTED: {
      label: "Submitted",
      className: "bg-blue-50 text-blue-700",
    },
    IN_REVIEW: {
      label: "In review",
      className: "bg-amber-50 text-amber-700",
    },
    RESPONDED: {
      label: "Product found",
      className: "bg-emerald-50 text-emerald-700",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-neutral-100 text-neutral-700",
    },
    DECLINED: {
      label: "Declined",
      className: "bg-red-50 text-red-700",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-neutral-100 text-neutral-500",
    },
  };

  const config = styles[status];

  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function SourcingPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}) {
  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-500">
        Showing{" "}
        <span className="font-medium text-neutral-700">
          {firstItem}–{lastItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-neutral-700">
          {total}
        </span>{" "}
        requests
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-neutral-950 px-3 text-sm font-medium text-white">
          {page}
        </div>

        <span className="text-sm text-neutral-400">
          of {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function SourcingEmptyState({
  filtered,
}: {
  filtered: boolean;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Search size={21} />
      </div>

      <h2 className="mt-5 text-base font-semibold text-neutral-950">
        {filtered ? "No matching requests" : "No sourcing requests yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
        {filtered
          ? "There are no sourcing requests with this status."
          : "Can't find something you want? Send us a product and we'll try to find it for you."}
      </p>

      {!filtered && (
        <Link
          to="/sourcing"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          <Plus size={17} />
          Find a product
        </Link>
      )}
    </div>
  );
}

function SourcingError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
      <h2 className="text-base font-semibold text-neutral-950">
        We couldn't load your requests
      </h2>

      <p className="mt-2 text-sm text-neutral-500">
        Something went wrong while loading your sourcing history.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Try again
      </button>
    </div>
  );
}

function SourcingListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5"
        >
          <div className="flex gap-4">
            <div className="h-20 w-20 shrink-0 rounded-xl bg-neutral-100 sm:h-24 sm:w-24" />

            <div className="flex-1">
              <div className="h-4 w-2/3 rounded bg-neutral-100" />
              <div className="mt-2 h-3 w-28 rounded bg-neutral-100" />
              <div className="mt-6 h-3 w-40 rounded bg-neutral-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
