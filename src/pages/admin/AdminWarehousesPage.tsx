import { useState } from "react";
import {
  AlertCircle,
  Plus,
  RefreshCw,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import {
  useActivateWarehouse,
  useDeactivateWarehouse,
  useDeleteWarehouse,
} from "../../features/admin/warehouse/warehouse.mutations";
import { useWarehouses } from "../../features/admin/warehouse/warehouse.queries";
import type { Warehouse } from "../../features/admin/warehouse/warehouse.types";
import { WarehouseForm } from "../../features/admin/warehouse/components/WarehouseForm";
import { WarehousesTable } from "../../features/admin/warehouse/components/WarehousesTable";



export function AdminWarehousesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null,
  );

  const warehousesQuery = useWarehouses();

  const activateMutation = useActivateWarehouse();
  const deactivateMutation = useDeactivateWarehouse();
  const deleteMutation = useDeleteWarehouse();

  const warehouses = warehousesQuery.data ?? [];

  const isActionPending =
    activateMutation.isPending ||
    deactivateMutation.isPending ||
    deleteMutation.isPending;

  function handleCreate() {
    setEditingWarehouse(null);
    setIsFormOpen(true);
  }

  function handleEdit(warehouse: Warehouse) {
    setEditingWarehouse(warehouse);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    if (isActionPending) {
      return;
    }

    setIsFormOpen(false);
    setEditingWarehouse(null);
  }

  async function handleActivate(warehouse: Warehouse) {
    await activateMutation.mutateAsync(warehouse.id);
  }

  async function handleDeactivate(warehouse: Warehouse) {
    await deactivateMutation.mutateAsync(warehouse.id);
  }

  async function handleDelete(warehouse: Warehouse) {
    const confirmed = window.confirm(
      `Delete "${warehouse.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(warehouse.id);
  }

  function handleRefresh() {
    warehousesQuery.refetch();
  }

  const error =
    warehousesQuery.error ||
    activateMutation.error ||
    deactivateMutation.error ||
    deleteMutation.error;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <WarehouseIcon size={20} className="text-neutral-700" />

            <h1 className="text-2xl font-semibold text-neutral-950">
              Warehouses
            </h1>
          </div>

          <p className="mt-1 text-sm text-neutral-500">
            Manage the warehouses used for inventory and order fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={warehousesQuery.isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={warehousesQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            <Plus size={17} />
            Add warehouse
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-medium">Something went wrong.</p>

            <p className="mt-1 text-red-600">
              Unable to complete the warehouse operation. Please try again.
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      {!warehousesQuery.isLoading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total warehouses" value={warehouses.length} />

          <SummaryCard
            label="Active warehouses"
            value={warehouses.filter((warehouse) => warehouse.isActive).length}
          />

          <SummaryCard
            label="Inactive warehouses"
            value={warehouses.filter((warehouse) => !warehouse.isActive).length}
          />
        </div>
      )}

      {/* Content */}
      {warehousesQuery.isLoading ? (
        <WarehousesTableSkeleton />
      ) : warehousesQuery.isError ? (
        <div className="rounded-xl border border-neutral-200 bg-white px-6 py-12 text-center">
          <AlertCircle size={28} className="mx-auto text-neutral-400" />

          <h2 className="mt-3 text-sm font-semibold text-neutral-900">
            Unable to load warehouses
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Check your connection and try again.
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-4 rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Try again
          </button>
        </div>
      ) : (
        <WarehousesTable
          warehouses={warehouses}
          onEdit={handleEdit}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          onDelete={handleDelete}
        />
      )}

      {/* Form */}
      {isFormOpen && (
        <WarehouseForm warehouse={editingWarehouse} onClose={handleCloseForm} />
      )}
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4">
      <p className="text-sm text-neutral-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold text-neutral-950">{value}</p>
    </div>
  );
}

function WarehousesTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="space-y-0">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-6 border-b border-neutral-100 px-4 py-5 last:border-0"
          >
            <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />

            <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />

            <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />

            <div className="h-4 w-32 animate-pulse rounded bg-neutral-100" />

            <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-100" />

            <div className="ml-auto h-8 w-24 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
