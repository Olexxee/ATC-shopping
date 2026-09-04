import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import {
  useAdminBrands,
  useDeleteBrand,
} from "../../features/admin/brands/brand.queries";
import { BrandFilters } from "../../features/admin/brands/components/BrandFilters";
import { BrandTable } from "../../features/admin/brands/components/BrandTable";
import {
  BrandPagination,
  BrandTableSkeleton, EmptyBrands
} from "../../utils/utilities";
import type { BrandFilters as BrandFilterValues } from "../../features/admin/brands/brand.types";

export function AdminBrandsPage() {
  const [filters, setFilters] = useState<BrandFilterValues>({
    page: 1,
    limit: 20,
  });

  const brandsQuery = useAdminBrands(filters);
  const deleteMutation = useDeleteBrand();

  const brands = brandsQuery.data?.data ?? [];
  const meta = brandsQuery.data?.meta;

  const hasFilters = useMemo(
    () => Boolean(filters.search || filters.isActive !== undefined),
    [filters],
  );

  const handleFiltersChange = (nextFilters: BrandFilterValues) => {
    setFilters({
      ...nextFilters,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  const handleDelete = (id: string) => {
    const brand = brands.find((item) => item.id === id);

    if (!brand) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${brand.name}"?`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(id);
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Catalog
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Brands</h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the brands available throughout the Keplex catalog.
          </p>
        </div>

        <Link
          to="/admin/brands/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Create brand
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5">
        <BrandFilters filters={filters} onChange={handleFiltersChange} />
      </div>

      {/* Results */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">
              {meta?.total ?? 0} {meta?.total === 1 ? "brand" : "brands"}
            </p>

            {hasFilters && (
              <p className="mt-0.5 text-xs text-slate-500">
                Showing filtered results
              </p>
            )}
          </div>

          {brandsQuery.isFetching && !brandsQuery.isLoading && (
            <div className="inline-flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw size={14} className="animate-spin" />
              Updating...
            </div>
          )}
        </div>

        {/* Loading */}
        {brandsQuery.isLoading && <BrandTableSkeleton />}

        {/* Error */}
        {brandsQuery.isError && (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
            <h3 className="text-sm font-semibold text-slate-900">
              Failed to load brands
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Something went wrong while loading the brand list.
            </p>

            <button
              type="button"
              onClick={() => brandsQuery.refetch()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!brandsQuery.isLoading &&
          !brandsQuery.isError &&
          brands.length === 0 && <EmptyBrands hasFilters={hasFilters} />}

        {/* Table */}
        {!brandsQuery.isLoading &&
          !brandsQuery.isError &&
          brands.length > 0 && (
            <>
              <BrandTable
                brands={brands}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />

              <BrandPagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                total={meta?.total ?? 0}
                limit={meta?.limit ?? filters.limit ?? 20}
                onPageChange={handlePageChange}
              />
            </>
          )}
      </section>
    </div>
  );
}
