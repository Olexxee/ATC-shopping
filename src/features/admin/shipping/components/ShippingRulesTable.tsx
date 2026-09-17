import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ShippingRule } from "../shipping.types";

interface ShippingRulesTableProps {
  rules: ShippingRule[];
  onCreate: () => void;
  onEdit: (rule: ShippingRule) => void;
  onDelete: (rule: ShippingRule) => void;
}

function formatMoney(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return `₦${Number(value).toLocaleString()}`;
}

function formatRange(min: number | string | null, max: number | string | null) {
  if (min == null && max == null) return "Any";

  if (min != null && max != null) {
    return `${min} – ${max}`;
  }

  if (min != null) return `≥ ${min}`;

  return `≤ ${max}`;
}

export function ShippingRulesTable({
  rules,
  onCreate,
  onEdit,
  onDelete,
}: ShippingRulesTableProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950">
            Shipping Rules
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Rules override the base configuration when their conditions match.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus size={16} />
          Add rule
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-neutral-50">
              <tr className="border-b border-neutral-200 text-left">
                <th className="px-4 py-3 font-medium text-neutral-600">Rule</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Type</th>
                <th className="px-4 py-3 font-medium text-neutral-600">
                  Subtotal
                </th>
                <th className="px-4 py-3 font-medium text-neutral-600">
                  Weight
                </th>
                <th className="px-4 py-3 font-medium text-neutral-600">
                  Rates
                </th>
                <th className="px-4 py-3 font-medium text-neutral-600">
                  Priority
                </th>
                <th className="px-4 py-3 font-medium text-neutral-600">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-neutral-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-neutral-500"
                  >
                    No shipping rules configured.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-neutral-950">
                        {rule.name}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                        {rule.type}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-neutral-600">
                      {formatRange(rule.minSubtotal, rule.maxSubtotal)}
                    </td>

                    <td className="px-4 py-4 text-neutral-600">
                      {formatRange(rule.minWeight, rule.maxWeight)}
                    </td>

                    <td className="px-4 py-4 text-neutral-600">
                      <div className="space-y-0.5 text-xs">
                        <p>Base: {formatMoney(rule.baseRate)}</p>
                        <p>KG: {formatMoney(rule.ratePerKg)}</p>
                        <p>CBM: {formatMoney(rule.ratePerCBM)}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-neutral-600">
                      {rule.priority}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          rule.isActive
                            ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
                            : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                        }
                      >
                        {rule.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(rule)}
                          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
                          title="Edit rule"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(rule)}
                          className="rounded-lg p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete rule"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
