import { useSearchParams } from "react-router-dom";

import { Container } from "../../../components/layout/Container";

import { AdminSourcingPagination } from "../../../features/admin/sourcing/components/AdminSourcingPagination";
import { AdminSourcingRow } from "../../../features/admin/sourcing/components/AdminSourcingRow";
import {
  AdminSourcingEmptyState,
  AdminSourcingError,
  AdminSourcingSkeleton,
} from "../../../features/admin/sourcing/components/AdminSourcingStates";
import { useAdminSourcingRequests } from "../../../features/admin/sourcing/admin-sourcing.queries";
import type { AdminSourcingRequestStatus } from "../../../features/admin/sourcing/admin-sourcing.types";

import {
  ADMIN_SOURCING_PAGE_SIZE,
  SOURCING_STATUS_OPTIONS,
} from "../../../features/sourcing/sourcing.constants";

export default function AdminSourcingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const statusParam = searchParams.get("status");

  const status = SOURCING_STATUS_OPTIONS.some(
    (option) => option.value === statusParam,
  )
    ? (statusParam as AdminSourcingRequestStatus | "ALL")
    : "ALL";

  const query = useAdminSourcingRequests({
    page,
    limit: ADMIN_SOURCING_PAGE_SIZE,
    status: status === "ALL" ? undefined : status,
  });

  /*
   * Backend now returns `{ requests, meta }` from the API layer.
   * No more `.pagination` vs `.meta` guessing.
   */
  const requests = query.data?.requests ?? [];

  const pagination = query.data?.meta ?? {
    page,
    limit: ADMIN_SOURCING_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  const handleStatusChange = (value: AdminSourcingRequestStatus | "ALL") => {
    const next = new URLSearchParams(searchParams);

    if (value === "ALL") {
      next.delete("status");
    } else {
      next.set("status", value);
    }

    next.delete("page");

    setSearchParams(next);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === page) {
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
    <main className="min-h-full bg-neutral-50">
      <Container>
        <div className="py-8 sm:py-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-neutral-500">Admin</p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                  Sourcing Requests
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Review customer requests and source products for the catalog.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  Total requests
                </p>

                <p className="mt-1 text-lg font-semibold text-neutral-950">
                  {pagination.total}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {SOURCING_STATUS_OPTIONS.map((option) => {
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

          <div className="mt-6">
            {query.isLoading ? (
              <AdminSourcingSkeleton />
            ) : query.isError ? (
              <AdminSourcingError onRetry={() => query.refetch()} />
            ) : requests.length === 0 ? (
              <AdminSourcingEmptyState />
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <div className="hidden border-b border-neutral-200 bg-neutral-50 px-5 py-3 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(160px,1fr)_140px_110px] lg:gap-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Request
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Customer
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Status
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      Date
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {requests.map((request) => (
                      <AdminSourcingRow key={request.id} request={request} />
                    ))}
                  </div>
                </div>

                {pagination.totalPages > 1 && (
                  <AdminSourcingPagination
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
