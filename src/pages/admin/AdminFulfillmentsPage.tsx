// src/pages/admin/AdminFulfillmentsPage.tsx

import { useState } from "react";
import { AlertCircle, Loader2, PackageCheck } from "lucide-react";
import { FulfillmentFilters } from "../../features/admin/fulfillment/components/FulfillmentFilters";
import { FulfillmentsTable } from "../../features/admin/fulfillment/components/FulfillmentsTable";
import { FulfillmentDetailsModal } from "../../features/admin/fulfillment/components/FulfillmentDetailsModal";
import { useFulfillments } from "../../features/admin/fulfillment/fulfillment.queries";
import { useUpdateFulfillmentStatus } from "../../features/admin/fulfillment/fulfillment.mutations";
import type {
  Fulfillment,
  FulfillmentFilters as FulfillmentFiltersType,
  FulfillmentStatus,
} from "../../features/admin/fulfillment/fulfillment.types";

export default function AdminFulfillmentsPage() {
  const [filters, setFilters] =
    useState<FulfillmentFiltersType>({
      page: 1,
      limit: 20,
    });

  const [selectedFulfillment, setSelectedFulfillment] =
    useState<Fulfillment | null>(null);

  const fulfillmentsQuery = useFulfillments(filters);
  const updateStatusMutation = useUpdateFulfillmentStatus();

  const fulfillments = fulfillmentsQuery.data?.data ?? [];
  const pagination = fulfillmentsQuery.data?.meta;

  function handleStatusChange(
    fulfillment: Fulfillment,
    status: FulfillmentStatus,
  ) {
    const confirmed = window.confirm(
      `Change fulfillment status to ${status}?`,
    );

    if (!confirmed) return;

    updateStatusMutation.mutate({
      fulfillmentId: fulfillment.id,
      payload: { status },
    });
  }

  function goToPage(page: number) {
    setFilters((current) => ({
      ...current,
      page,
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck className="h-6 w-6 text-slate-700" />

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Fulfillments
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage order fulfillment, warehouse allocation,
            shipping, and delivery progress.
          </p>
        </div>

        {pagination && (
          <div className="text-sm text-slate-500">
            {pagination.total} fulfillment
            {pagination.total === 1 ? "" : "s"}
          </div>
        )}
      </div>

      <FulfillmentFilters
        filters={filters}
        onChange={setFilters}
      />

      {fulfillmentsQuery.isLoading && (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading fulfillments...
          </div>
        </div>
      )}

      {fulfillmentsQuery.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Failed to load fulfillments
              </p>

              <p className="mt-1 text-sm">
                Please refresh the page and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {!fulfillmentsQuery.isLoading &&
        !fulfillmentsQuery.isError && (
          <>
            <FulfillmentsTable
              fulfillments={fulfillments}
              onView={setSelectedFulfillment}
              onStatusChange={handleStatusChange}
            />

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => goToPage(pagination.page - 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-500">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    pagination.page >= pagination.totalPages
                  }
                  onClick={() => goToPage(pagination.page + 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      {selectedFulfillment && (
        <FulfillmentDetailsModal
          fulfillment={selectedFulfillment}
          onClose={() => setSelectedFulfillment(null)}
        />
      )}

      {updateStatusMutation.isPending && (
        <div className="fixed bottom-5 right-5 z-40 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          Updating fulfillment status...
        </div>
      )}
    </div>
  );
}