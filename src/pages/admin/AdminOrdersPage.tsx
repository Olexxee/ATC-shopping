import { useState } from "react";
import { AlertCircle, Loader2, ShoppingCart } from "lucide-react";
import { OrderFilters } from "../../features/admin/orders/components/OrderFilters";
import { OrdersTable } from "../../features/admin/orders/components/OrdersTable";
import { OrderDetailsModal } from "../../features/admin/orders/components/OrderDetailsModal";
import { useOrders } from "../../features/admin/orders/order.queries";
import { useUpdateOrderStatus } from "../../features/admin/orders/order.mutations";
import type {
  Order,
  OrderFilters as OrderFiltersType,
  OrderStatus,
} from "../../features/admin/orders/order.types";



export default function AdminOrdersPage() {
  const [filters, setFilters] = useState<OrderFiltersType>({
    page: 1,
    limit: 20,
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const ordersQuery = useOrders(filters);

  const updateStatusMutation = useUpdateOrderStatus();

  const orders = ordersQuery.data?.data ?? [];

  const pagination = ordersQuery.data?.meta;

  function handleStatusChange(order: Order, status: OrderStatus) {
    const confirmed = window.confirm(
      `Change ${order.orderNumber} to ${status}?`,
    );

    if (!confirmed) {
      return;
    }

    updateStatusMutation.mutate({
      orderId: order.id,
      payload: {
        status,
      },
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
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-slate-700" />

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Orders
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders, payments, fulfillment, and order status.
          </p>
        </div>

        {pagination && (
          <div className="text-sm text-slate-500">
            {pagination.total} order
            {pagination.total === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {/* FILTERS */}
      <OrderFilters filters={filters} onChange={setFilters} />

      {/* LOADING */}
      {ordersQuery.isLoading && (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading orders...
          </div>
        </div>
      )}

      {/* ERROR */}
      {ordersQuery.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">Failed to load orders</p>

              <p className="mt-1 text-sm">
                Please refresh the page and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!ordersQuery.isLoading && !ordersQuery.isError && (
        <>
          <OrdersTable
            orders={orders}
            onView={setSelectedOrder}
            onStatusChange={handleStatusChange}
          />

          {/* PAGINATION */}
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
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => goToPage(pagination.page + 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* DETAILS */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* STATUS UPDATE */}
      {updateStatusMutation.isPending && (
        <div className="fixed bottom-5 right-5 z-40 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          Updating order status...
        </div>
      )}
    </div>
  );
}
