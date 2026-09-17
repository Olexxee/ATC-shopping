// src/features/admin/fulfillment/components/FulfillmentsTable.tsx

import { Eye, PackageCheck, Truck } from "lucide-react";
import type {
  Fulfillment,
  FulfillmentStatus,
  FulfillmentType,
} from "../fulfillment.types";

interface FulfillmentsTableProps {
  fulfillments: Fulfillment[];
  onView: (fulfillment: Fulfillment) => void;
  onStatusChange: (fulfillment: Fulfillment, status: FulfillmentStatus) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function getTypeClass(type: FulfillmentType) {
  const classes: Record<FulfillmentType, string> = {
    LOCAL: "bg-blue-50 text-blue-700",
    IMPORT: "bg-purple-50 text-purple-700",
    PREORDER: "bg-amber-50 text-amber-700",
    DIGITAL: "bg-emerald-50 text-emerald-700",
  };

  return classes[type];
}

function getStatusClass(status: FulfillmentStatus) {
  const classes: Record<FulfillmentStatus, string> = {
    PENDING: "bg-slate-100 text-slate-700",
    PROCESSING: "bg-blue-50 text-blue-700",
    SHIPPED: "bg-purple-50 text-purple-700",
    DELIVERED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-red-50 text-red-700",
  };

  return classes[status];
}

function getNextStatuses(status: FulfillmentStatus): FulfillmentStatus[] {
  const transitions: Record<FulfillmentStatus, FulfillmentStatus[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  return transitions[status];
}

export function FulfillmentsTable({
  fulfillments,
  onView,
  onStatusChange,
}: FulfillmentsTableProps) {
  if (fulfillments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <PackageCheck className="mx-auto mb-3 h-10 w-10 text-slate-400" />

        <h3 className="text-base font-semibold text-slate-900">
          No fulfillments found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Fulfillments matching your filters will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1050px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Fulfillment</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Warehouse</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Items</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {fulfillments.map((fulfillment) => {
              const nextStatuses = getNextStatuses(fulfillment.status);

              const itemTotal = fulfillment.items.reduce(
                (total, item) => total + item.quantity * Number(item.unitPrice),
                0,
              );

              return (
                <tr
                  key={fulfillment.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">
                      #{fulfillment.id.slice(-8).toUpperCase()}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(fulfillment.createdAt).toLocaleDateString(
                        "en-NG",
                      )}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">
                      {fulfillment.order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {fulfillment.orderId}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">
                      {fulfillment.order.customerName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {fulfillment.order.customerEmail}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getTypeClass(
                        fulfillment.type,
                      )}`}
                    >
                      {fulfillment.type}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {fulfillment.warehouse ? (
                      <>
                        <p className="font-medium text-slate-900">
                          {fulfillment.warehouse.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {fulfillment.warehouse.code}
                        </p>
                      </>
                    ) : (
                      <span className="text-slate-400">No warehouse</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        fulfillment.status,
                      )}`}
                    >
                      {fulfillment.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">
                      {fulfillment.items.length} line
                      {fulfillment.items.length === 1 ? "" : "s"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatCurrency(itemTotal)}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onView(fulfillment)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>

                      {nextStatuses.length > 0 && (
                        <select
                          value=""
                          aria-label="Update fulfillment status"
                          onChange={(event) => {
                            const nextStatus = event.target
                              .value as FulfillmentStatus;

                            if (nextStatus) {
                              onStatusChange(fulfillment, nextStatus);
                            }
                          }}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">
                            <Truck className="inline" />
                            Update
                          </option>

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
