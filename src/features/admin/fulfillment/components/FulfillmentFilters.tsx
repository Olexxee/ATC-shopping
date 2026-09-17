// src/features/admin/fulfillment/components/FulfillmentFilters.tsx

import type {
  FulfillmentFilters as FulfillmentFiltersType,
  FulfillmentStatus,
  FulfillmentType,
} from "../fulfillment.types";

interface FulfillmentFiltersProps {
  filters: FulfillmentFiltersType;
  onChange: (filters: FulfillmentFiltersType) => void;
}

const fulfillmentTypes: Array<{
  label: string;
  value: FulfillmentType;
}> = [
  { label: "All types", value: "" as FulfillmentType },
  { label: "Local", value: "LOCAL" },
  { label: "Import", value: "IMPORT" },
  { label: "Preorder", value: "PREORDER" },
  { label: "Digital", value: "DIGITAL" },
];

const fulfillmentStatuses: Array<{
  label: string;
  value: FulfillmentStatus;
}> = [
  { label: "All statuses", value: "" as FulfillmentStatus },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function FulfillmentFilters({
  filters,
  onChange,
}: FulfillmentFiltersProps) {
  function updateFilter(key: keyof FulfillmentFiltersType, value: string) {
    onChange({
      ...filters,
      page: 1,
      [key]: value || undefined,
    });
  }

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
      <div>
        <label
          htmlFor="fulfillment-order-id"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Order ID
        </label>

        <input
          id="fulfillment-order-id"
          type="text"
          value={filters.orderId ?? ""}
          onChange={(event) => updateFilter("orderId", event.target.value)}
          placeholder="Search by order ID"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="fulfillment-type"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Fulfillment type
        </label>

        <select
          id="fulfillment-type"
          value={filters.type ?? ""}
          onChange={(event) => updateFilter("type", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {fulfillmentTypes.map((type) => (
            <option key={type.label} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="fulfillment-status"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Status
        </label>

        <select
          id="fulfillment-status"
          value={filters.status ?? ""}
          onChange={(event) => updateFilter("status", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {fulfillmentStatuses.map((status) => (
            <option key={status.label} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
