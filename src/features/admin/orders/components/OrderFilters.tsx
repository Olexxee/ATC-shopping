// src/features/admin/orders/components/OrderFilters.tsx

import type {
  OrderFilters as OrderFiltersType,
  OrderStatus,
} from "../order.types";

interface OrderFiltersProps {
  filters: OrderFiltersType;
  onChange: (filters: OrderFiltersType) => void;
}

const statuses: Array<{
  label: string;
  value: OrderStatus;
}> = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function OrderFilters({ filters, onChange }: OrderFiltersProps) {
  function updateFilter(key: keyof OrderFiltersType, value: string) {
    onChange({
      ...filters,
      page: 1,
      [key]: value || undefined,
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label
            htmlFor="order-search"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Search
          </label>

          <input
            id="order-search"
            type="text"
            value={filters.search ?? ""}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Order number, customer name, email or phone"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="order-status"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="order-status"
            value={filters.status ?? ""}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All statuses</option>

            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="order-user-id"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Customer ID
          </label>

          <input
            id="order-user-id"
            type="text"
            value={filters.userId ?? ""}
            onChange={(event) => updateFilter("userId", event.target.value)}
            placeholder="Customer ID"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label
            htmlFor="order-start-date"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            From
          </label>

          <input
            id="order-start-date"
            type="date"
            value={filters.startDate ?? ""}
            onChange={(event) => updateFilter("startDate", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="order-end-date"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            To
          </label>

          <input
            id="order-end-date"
            type="date"
            value={filters.endDate ?? ""}
            onChange={(event) => updateFilter("endDate", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
}
