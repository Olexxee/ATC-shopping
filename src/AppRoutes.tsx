import { Route, Routes } from "react-router-dom";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

//Payment
import PaymentCallbackPage from "./pages/payment/PaymentCallbackPage";

// Storefront
import { HomePage } from "./pages/home/HomePage";
import AccountPage from "./pages/account/AccountPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { ProductPage } from "./pages/products/ProductPage";
import { BrandsPage } from "./pages/brands/BrandsPage";
import { BrandPage } from "./pages/brands/BrandPage";
import { CategoriesPage } from "./pages/categories/CategoriesPage";
import { CategoryPage } from "./pages/categories/CategoryPage";
import CartPage from "./pages/Cart/CartPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderPage from "./pages/orders/OrderPage";
import AddressesPage from "./pages/address/AddressesPage";
import OrdersPage from "./pages/orders/OrdersPage";

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
import ProtectedRoute from "./components/auth/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* ================================================================
          AUTH
      ================================================================ */}

      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* ================================================================
          PROTECTED STOREFRONT
      ================================================================ */}

      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders/:id" element={<OrderPage />} />
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="/payment/callback" element={<PaymentCallbackPage />} />
      </Route>

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
          <Route path="dashboard" element={<AdminDashboardPage />} />

          <Route path="products" element={<AdminProductsPage />} />

          <Route path="products/new" element={<AdminCreateProductPage />} />

          <Route path="categories" element={<AdminCategoriesPage />} />

          <Route path="categories/new" element={<AdminCreateCategoryPage />} />

          <Route
            path="categories/:id/edit"
            element={<AdminEditCategoryPage />}
          />

          <Route path="brands/new" element={<AdminCreateBrandPage />} />

          <Route path="brands/:id/edit" element={<AdminEditBrandPage />} />

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
