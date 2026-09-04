import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "../../features/admin/products/components/ProductForm";


export function AdminCreateProductPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Catalog
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Create product
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add a new product to the Keplex catalog.
          </p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
