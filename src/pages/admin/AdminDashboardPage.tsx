import { Link } from "react-router-dom";
import { ArrowRight, Package, Plus } from "lucide-react";

import { useAdminProducts } from "../../features/admin/products/useAdminProducts";

export function AdminDashboardPage() {
  const productsQuery = useAdminProducts(1, 100);

  const products = productsQuery.data?.data.products ?? [];

  const totalProducts = productsQuery.data?.meta.total ?? 0;

  const activeProducts = products.filter(
    (product) => product.status === "ACTIVE",
  ).length;

  const draftProducts = products.filter(
    (product) => product.status === "DRAFT",
  ).length;

  const lowStockProducts = products.filter(
    (product) =>
      product.variants.length > 0 &&
      product.variants.every((variant) => variant.stock <= 5),
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Overview
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your Keplex store from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total products"
          value={productsQuery.isLoading ? "—" : totalProducts.toLocaleString()}
          icon={<Package size={18} />}
        />

        <StatCard
          label="Active"
          value={
            productsQuery.isLoading ? "—" : activeProducts.toLocaleString()
          }
          icon={<Package size={18} />}
        />

        <StatCard
          label="Drafts"
          value={productsQuery.isLoading ? "—" : draftProducts.toLocaleString()}
          icon={<Package size={18} />}
        />

        <StatCard
          label="Low stock"
          value={
            productsQuery.isLoading ? "—" : lowStockProducts.toLocaleString()
          }
          icon={<Package size={18} />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Quick actions
          </h2>

          <div className="mt-5 space-y-3">
            <Link
              to="/admin/products/new"
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:border-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <Plus size={17} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Add product
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Create a new catalog product
                  </p>
                </div>
              </div>

              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              to="/admin/products"
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:border-slate-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <Package size={17} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Manage products
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    View and manage the catalog
                  </p>
                </div>
              </div>

              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">Catalog</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Categories, brands and collections will be managed from this
            administration area as those modules are added.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <PlaceholderLink label="Categories" />
            <PlaceholderLink label="Brands" />
            <PlaceholderLink label="Collections" />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>

        <span className="text-slate-400">{icon}</span>
      </div>

      <p className="mt-4 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function PlaceholderLink({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center">
      <p className="text-xs font-medium text-slate-400">{label}</p>

      <p className="mt-1 text-[11px] text-slate-400">Coming soon</p>
    </div>
  );
}
