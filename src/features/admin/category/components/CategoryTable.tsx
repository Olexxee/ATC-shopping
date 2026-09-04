import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { AdminCategory } from "../category.types";

interface CategoryTableProps {
  categories: AdminCategory[];
  onDelete: (category: AdminCategory) => void;
}

export function CategoryTable({ categories, onDelete }: CategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Products
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Parent
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr key={category.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {category.image?.url ? (
                        <img
                          src={category.image.url}
                          alt={category.image.alt ?? category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {category.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        /{category.slug}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="text-xs font-medium text-slate-600">
                    {category.type}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {category.productCount.toLocaleString()}
                </td>

                <td className="px-5 py-4">
                  {category.parent ? (
                    <div>
                      <p className="text-sm text-slate-700">
                        {category.parent.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        /{category.parent.slug}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge active={category.isActive} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      to={`/admin/categories/${category.id}/edit`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                      title="Edit category"
                    >
                      <Pencil size={15} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete category"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                      title="More"
                    >
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
