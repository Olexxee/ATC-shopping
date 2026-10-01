import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  Loader2,
  PackageOpen,
  Pencil,
  Plus,
  Search,
  TriangleAlert,
} from "lucide-react";
import { useAdminProducts } from "../../features/admin/products/hooks/useAdminProducts";
import { useArchiveProduct } from "../../features/admin/products/hooks/useArchiveProduct";
import type { ProductStatus } from "../../features/admin/products/api/adminProducts.api";

type StatusFilter = ProductStatus | "ALL";

const STATUS_TABS: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  ACTIVE: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  DRAFT: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  ARCHIVED: {
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  },
};

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.ARCHIVED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {titleCase(status)}
    </span>
  );
}

function Monogram({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
      {name.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
}

export function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Debounce search so we don't fire a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminProducts({
      page,
      limit: 20,
      status: status === "ALL" ? undefined : status,
      search: search || undefined,
    });

  const archiveMutation = useArchiveProduct();

  const products = data?.products ?? [];
  const pagination = data?.pagination;
  const isFiltered = status !== "ALL" || search !== "";

  const handleArchive = (id: string, name: string) => {
    if (confirm(`Archive "${name}"? It will be hidden from the storefront.`)) {
      archiveMutation.mutate({ id });
    }
  };

  const archivingId = archiveMutation.isPending
    ? archiveMutation.variables?.id
    : undefined;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage everything in the Keplex catalog.
            {pagination ? ` ${pagination.total} total.` : ""}
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          <Plus size={16} />
          New product
        </Link>
      </header>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filter by status"
          className="inline-flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto"
        >
          {STATUS_TABS.map((tab) => {
            const active = status === tab.value;
            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                className={`flex-1 rounded-lg px-3.5 py-1.5 text-sm font-medium transition sm:flex-none ${
                  active
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="animate-spin text-slate-400" size={24} />
        </div>
      )}

      {isError && (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 text-center">
          <TriangleAlert className="text-red-600" />
          <p className="text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "Couldn't load products."}
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <PackageOpen className="text-slate-300" size={36} />
          <p className="mt-4 text-sm font-medium text-slate-900">
            {isFiltered ? "No products match your filters" : "No products yet"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {isFiltered
              ? "Try a different search or status."
              : "Create your first product to get started."}
          </p>
          {isFiltered ? (
            <button
              type="button"
              onClick={() => {
                setStatus("ALL");
                setSearchInput("");
              }}
              className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          ) : (
            <Link
              to="/admin/products/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus size={14} /> New product
            </Link>
          )}
        </div>
      )}

      {products.length > 0 && (
        <div
          className={`overflow-hidden rounded-2xl border border-slate-200 bg-white transition-opacity ${
            isFetching ? "opacity-70" : ""
          }`}
        >
          {/* Desktop column header */}
          <div className="hidden grid-cols-[minmax(0,2.5fr)_1fr_1fr_0.7fr_auto] items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-medium text-slate-500 md:grid">
            <span>Product</span>
            <span>Status</span>
            <span>Category</span>
            <span>Variants</span>
            <span className="w-[148px] text-right">Actions</span>
          </div>

          <ul className="divide-y divide-slate-100">
            {products.map((product) => {
              const isArchiving = archivingId === product.id;
              return (
                <li
                  key={product.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 px-4 py-4 md:grid-cols-[minmax(0,2.5fr)_1fr_1fr_0.7fr_auto] md:gap-4 md:px-5"
                >
                  {/* Product */}
                  <div className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
                    <Monogram name={product.name} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 md:hidden">
                        {product.category ?? "Uncategorized"} ·{" "}
                        {product.variantCount}{" "}
                        {product.variantCount === 1 ? "variant" : "variants"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 md:col-span-1">
                    <StatusBadge status={product.status} />
                  </div>

                  {/* Category (desktop) */}
                  <div className="hidden truncate text-sm text-slate-600 md:block">
                    {product.category ?? "—"}
                  </div>

                  {/* Variants (desktop) */}
                  <div className="hidden text-sm text-slate-600 md:block">
                    {product.variantCount}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 md:w-[148px]">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil size={13} />
                      Edit
                    </Link>
                    {product.status !== "ARCHIVED" && (
                      <button
                        type="button"
                        disabled={isArchiving}
                        onClick={() => handleArchive(product.id, product.name)}
                        aria-label={`Archive ${product.name}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {isArchiving ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Archive size={13} />
                        )}
                        Archive
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-300 px-3.5 py-1.5 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page >= pagination.totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-300 px-3.5 py-1.5 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}