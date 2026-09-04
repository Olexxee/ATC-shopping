import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../types/product.types";

interface AdminProductTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
  deletingProductId?: string | null;
}

export function AdminProductTable({
  products,
  onDelete,
  deletingProductId,
}: AdminProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Product
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Price
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Stock
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {products.map((product) => {
              const variant = product.variants[0];

              const image =
                variant?.media?.find((media) => media.isPrimary)?.url ??
                variant?.media?.[0]?.url;

              const price =
                product.priceRange?.min ??
                (variant ? Number(variant.price) : null);

              const isDeleting = deletingProductId === product.id;

              return (
                <tr key={product.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {product.brand?.name ?? "No brand"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {product.category?.name ?? "—"}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                    {price != null ? `₦${price.toLocaleString()}` : "—"}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {product.variants.reduce(
                      (total, item) => total + (item.stock ?? 0),
                      0,
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={product.status} />
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
                        title="Edit product"
                      >
                        <Pencil size={15} />
                      </Link>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => onDelete(product)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
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

function StatusBadge({ status }: { status: Product["status"] }) {
  const styles = {
    ACTIVE: "bg-green-50 text-green-700",
    DRAFT: "bg-amber-50 text-amber-700",
    ARCHIVED: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}
