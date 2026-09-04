import { Link } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";

import type { AdminBrand } from "../brand.types";

interface BrandTableProps {
  brands: AdminBrand[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function BrandTable({
  brands,
  onDelete,
  isDeleting = false,
}: BrandTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Brand
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Products
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sort order
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {brands.map((brand) => {
            const image =
              brand.media?.find((media) => media.isPrimary) ??
              brand.media?.[0] ??
              null;

            return (
              <tr key={brand.id} className="transition hover:bg-slate-50/60">
                {/* Brand */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {image?.url ? (
                        <img
                          src={image.url}
                          alt={brand.name}
                          className="h-full w-full object-contain p-1.5"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          {getInitials(brand.name)}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <Link
                        to={`/admin/brands/${brand.id}/edit`}
                        className="block truncate text-sm font-semibold text-slate-900 hover:text-slate-600"
                      >
                        {brand.name}
                      </Link>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        /{brand.slug}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Products */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-700">
                    {brand.productCount}
                  </span>
                </td>

                {/* Sort */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {brand.sortOrder}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      brand.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {brand.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/admin/brands/${brand.id}/edit`}
                      title="Edit brand"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Edit3 size={16} />
                    </Link>

                    <button
                      type="button"
                      title="Delete brand"
                      disabled={isDeleting}
                      onClick={() => onDelete(brand.id)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
