import { CheckCircle2, Pencil, Power, Trash2 } from "lucide-react";
import type { Warehouse } from "../warehouse.types";


interface WarehousesTableProps {
  warehouses: Warehouse[];
  onEdit: (warehouse: Warehouse) => void;
  onActivate: (warehouse: Warehouse) => void;
  onDeactivate: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
}

export function WarehousesTable({
  warehouses,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
}: WarehousesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-neutral-50">
            <tr className="border-b border-neutral-200 text-left">
              <th className="px-4 py-3 font-medium text-neutral-600">
                Warehouse
              </th>

              <th className="px-4 py-3 font-medium text-neutral-600">Code</th>

              <th className="px-4 py-3 font-medium text-neutral-600">Type</th>

              <th className="px-4 py-3 font-medium text-neutral-600">
                Location
              </th>

              <th className="px-4 py-3 font-medium text-neutral-600">Status</th>

              <th className="px-4 py-3 text-right font-medium text-neutral-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {warehouses.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-neutral-500"
                >
                  No warehouses found.
                </td>
              </tr>
            ) : (
              warehouses.map((warehouse) => (
                <tr
                  key={warehouse.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-neutral-950">
                      {warehouse.name}
                    </p>

                    {warehouse.address && (
                      <p className="mt-1 max-w-xs truncate text-xs text-neutral-500">
                        {warehouse.address}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs font-medium text-neutral-700">
                      {warehouse.code}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                      {warehouse.type}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-neutral-600">
                    {[warehouse.city, warehouse.state, warehouse.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        warehouse.isActive
                          ? "inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
                          : "inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                      }
                    >
                      {warehouse.isActive && <CheckCircle2 size={13} />}

                      {warehouse.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(warehouse)}
                        className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
                        title="Edit warehouse"
                      >
                        <Pencil size={16} />
                      </button>

                      {warehouse.isActive ? (
                        <button
                          type="button"
                          onClick={() => onDeactivate(warehouse)}
                          className="rounded-lg p-2 text-neutral-500 hover:bg-amber-50 hover:text-amber-700"
                          title="Deactivate warehouse"
                        >
                          <Power size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onActivate(warehouse)}
                          className="rounded-lg p-2 text-neutral-500 hover:bg-green-50 hover:text-green-700"
                          title="Activate warehouse"
                        >
                          <Power size={16} />
                        </button>
                      )}

                      {!warehouse.isActive && (
                        <button
                          type="button"
                          onClick={() => onDelete(warehouse)}
                          className="rounded-lg p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete warehouse"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
