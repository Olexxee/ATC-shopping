import { Navigate, Route, Routes } from "react-router-dom";

// Storefront
import { HomePage } from "./pages/home/HomePage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { ProductPage } from "./pages/products/ProductPage";
import { BrandsPage } from "./pages/brands/BrandsPage";
import { BrandPage } from "./pages/brands/BrandPage";
import { CategoriesPage } from "./pages/categories/CategoriesPage";
import { CategoryPage } from "./pages/categories/CategoryPage";

// Admin
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminCreateProductPage } from "./pages/admin/AdminCreateProductPage";
import { AdminEditCategoryPage } from "./pages/admin/AdminEditCategoryPage";
import { AdminCreateCategoryPage } from "./pages/admin/AdminCreateCategoryPage";
import { AdminCreateBrandPage } from "./pages/admin/AdminCreateBrandPage";
import { AdminEditBrandPage } from "./pages/admin/AdminEditBrandPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminBrandsPage } from "./pages/admin/AdminBrandsPage";

import { AdminRoute } from "./routes/AdminRoute";
import { AdminLayout } from "./components/admin/AdminLayout";

export function AppRoutes() {
  return (
    <Routes>
      {/* ================================================================
          STOREFRONT
      ================================================================ */}

      <Route path="/" element={<HomePage />} />

      <Route path="/products" element={<ProductsPage />} />

      <Route path="/products/:slug" element={<ProductPage />} />

      <Route path="/categories" element={<CategoriesPage />} />

      <Route path="/categories/:slug" element={<CategoryPage />} />

      <Route path="/brands" element={<BrandsPage />} />

      <Route path="/brands/:slug" element={<BrandPage />} />

      {/* ================================================================
          ADMIN AUTH
      ================================================================ */}

      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ================================================================
          ADMIN
      ================================================================ */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>

          {/* Dashboard */}
          <Route path="dashboard" element={<AdminDashboardPage />} />

          {/* Products */}
          <Route path="products" element={<AdminProductsPage />} />

          {/* Create product */}
          <Route path="products/new" element={<AdminCreateProductPage />} />

          <Route path="categories" element={<AdminCategoriesPage />} />

          <Route path="categories/new" element={<AdminCreateCategoryPage />} />
          <Route
            path="categories/:id/edit"
            element={<AdminEditCategoryPage />}
          />

          {/* Edit product */}
          <Route
            path="products/:id/edit"
            element={
              <div className="p-6">
                <h1 className="text-xl font-semibold text-slate-900">
                  Edit product
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Product editing will be implemented next.
                </p>
              </div>
            }
          />

          {/* Future admin modules */}
          <Route
            path="categories"
            element={<AdminComingSoonPage title="Categories" />}
          />

          <Route path="/admin/brands/new" element={<AdminCreateBrandPage />} />

          <Route
            path="/admin/brands/:id/edit"
            element={<AdminEditBrandPage />}
          />
          <Route path="brands" element={<AdminBrandsPage />} />

          <Route
            path="collections"
            element={<AdminComingSoonPage title="Collections" />}
          />

          <Route
            path="inventory"
            element={<AdminComingSoonPage title="Inventory" />}
          />

          <Route
            path="orders"
            element={<AdminComingSoonPage title="Orders" />}
          />

          <Route
            path="customers"
            element={<AdminComingSoonPage title="Customers" />}
          />

          <Route
            path="settings"
            element={<AdminComingSoonPage title="Settings" />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

function AdminComingSoonPage({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Administration
      </p>

      <h1 className="mt-2 text-xl font-semibold text-slate-900">{title}</h1>

      <p className="mt-2 text-sm text-slate-500">
        This section is not available yet.
      </p>
    </div>
  );
}
