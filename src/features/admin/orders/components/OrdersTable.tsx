// src/features/admin/orders/components/OrdersTable.tsx

import { Eye, Package } from "lucide-react";

import type { Order, OrderStatus } from "../order.types";

import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrdersTableProps {
  orders: Order[];
  onView: (order: Order) => void;
  onStatusChange: (order: Order, status: OrderStatus) => void;
}

const transitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function OrdersTable({
  orders,
  onView,
  onStatusChange,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <Package className="mx-auto mb-3 h-10 w-10 text-slate-400" />

        <h3 className="text-base font-semibold text-slate-900">
          No orders found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Orders matching your filters will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Order</th>

              <th className="px-4 py-3 font-semibold">Customer</th>

              <th className="px-4 py-3 font-semibold">Items</th>

              <th className="px-4 py-3 font-semibold">Total</th>

              <th className="px-4 py-3 font-semibold">Payment</th>

              <th className="px-4 py-3 font-semibold">Fulfillment</th>

              <th className="px-4 py-3 font-semibold">Status</th>

              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const nextStatuses = transitions[order.status];

              const payment = order.payments?.[0];

              const fulfillmentCount = order.fulfillments?.length ?? 0;

              return (
                <tr key={order.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("en-NG")}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">
                      {order.customerName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {order.customerEmail || "No email"}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">
                      {order.items.length} line
                      {order.items.length === 1 ? "" : "s"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {order.items.reduce(
                        (sum, item) => sum + Number(item.quantity),
                        0,
                      )}{" "}
                      units
                    </p>
                  </td>

                  <td className="px-4 py-4 font-semibold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </td>

                  <td className="px-4 py-4">
                    {payment ? (
                      <div>
                        <p className="font-medium text-slate-900">
                          {payment.status}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {payment.provider}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400">No payment</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {fulfillmentCount > 0 ? (
                      <span className="font-medium text-slate-700">
                        {fulfillmentCount} fulfillment
                        {fulfillmentCount === 1 ? "" : "s"}
                      </span>
                    ) : (
                      <span className="text-slate-400">Not generated</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onView(order)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>

                      {nextStatuses.length > 0 && (
                        <select
                          value=""
                          aria-label={`Update status for ${order.orderNumber}`}
                          onChange={(event) => {
                            const status = event.target.value as OrderStatus;

                            if (status) {
                              onStatusChange(order, status);
                            }
                          }}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Update</option>

                          {nextStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
