import { Route, Routes } from "react-router-dom";

/* ============================================================
 * AUTH
 * ========================================================== */

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

/* ============================================================
 * PAYMENT
 * ========================================================== */

import PaymentCallbackPage from "./pages/payment/PaymentCallbackPage";

/* ============================================================
 * STOREFRONT
 * ========================================================== */

import { HomePage } from "./pages/home/HomePage";
import AccountPage from "./pages/account/AccountPage";

import { ProductsPage } from "./pages/products/ProductsPage";
import { ProductPage } from "./pages/products/ProductPage";

import { BrandsPage } from "./pages/brands/BrandsPage";
import { BrandPage } from "./pages/brands/BrandPage";

import { CategoriesPage } from "./pages/categories/CategoriesPage";
import { CategoryPage } from "./pages/categories/CategoryPage";

import { ShippingPage } from "./pages/shipping/ShippingPage";
import CartPage from "./pages/Cart/CartPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import { SmartShoppingPage } from "./pages/smartShopping/SmartShoppingPage";

import InstallmentsPage from "./pages/account/InstallmentsPage";
import InstallmentDetailPage from "./pages/account/InstallmentDetailPage";

import OrdersPage from "./pages/orders/OrdersPage";
import OrderPage from "./pages/orders/OrderPage";

import AddressesPage from "./pages/address/AddressesPage";

/* ============================================================
 * SOURCING — CUSTOMER
 * ========================================================== */

import SourcingPage from "./pages/sourcing/SourcingPage";
import SourcingDetailPage from "./pages/sourcing/SourcingDetailPage";
import SourcingAccountPage from "./pages/account/SourcingAccountPage";

/* ============================================================
 * ADMIN — AUTH
 * ========================================================== */

import { AdminLoginPage } from "./pages/admin/AdminLoginPage";

/* ============================================================
 * ADMIN — PAGES
 * ========================================================== */

// import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";

import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminCreateProductPage } from "./pages/admin/AdminCreateProductPage";
import { AdminEditProductPage } from "./pages/admin/AdminEditProductPage";

import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminCreateCategoryPage } from "./pages/admin/AdminCreateCategoryPage";
import { AdminEditCategoryPage } from "./pages/admin/AdminEditCategoryPage";

import { AdminBrandsPage } from "./pages/admin/AdminBrandsPage";
import { AdminCreateBrandPage } from "./pages/admin/AdminCreateBrandPage";
import { AdminEditBrandPage } from "./pages/admin/AdminEditBrandPage";

import AdminReviewsPage from "./pages/admin/AdminReviewsPage";

import { AdminFlexPayPage } from "./pages/admin/AdminFlexPayPage";
import { AdminFlexPayDetailPage } from "./pages/admin/AdminFlexPayDetailPage";

import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminFulfillmentsPage from "./pages/admin/AdminFulfillmentsPage";

import { AdminWarehousesPage } from "./pages/admin/AdminWarehousesPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminShippingPage } from "./pages/admin/AdminShippingPage";

/* ============================================================
 * ADMIN — SOURCING
 * ========================================================== */

import AdminSourcingPage from "./pages/admin/sourcing/AdminSourcingPage";
import AdminSourcingDetailPage from "./pages/admin/sourcing/AdminSourcingDetailPage";

/* ============================================================
 * GUARDS & LAYOUT
 * ========================================================== */

import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./routes/AdminRoute";
import { AdminLayout } from "./components/admin/AdminLayout";

/* ============================================================
 * ROUTES
 * ========================================================== */

export function AppRoutes() {
  return (
    <Routes>
      {/* ============================================================
       * AUTH
       * ========================================================== */}

      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="/payment/success" element={<PaymentCallbackPage />} />

      {/* ============================================================
       * PUBLIC STOREFRONT
       * ========================================================== */}

      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/:slug" element={<CategoryPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/brands/:slug" element={<BrandPage />} />
      <Route path="/shipping" element={<ShippingPage />} />
      <Route path="/smart-shopping" element={<SmartShoppingPage />} />
      
      {/* ============================================================
       * PROTECTED STOREFRONT
       * ========================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route path="/account" element={<AccountPage />} />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/addresses" element={<AddressesPage />} />

        <Route path="/account/installments" element={<InstallmentsPage />} />
        <Route
          path="/account/installments/:planId"
          element={<InstallmentDetailPage />}
        />

        {/* ------------------------------------------------------------
         * Sourcing (customer)
         *
         * `POST /api/sourcing` requires auth, so the form itself is
         * gated. Detail + history naturally sit behind the same guard.
         * ---------------------------------------------------------- */}

        <Route path="/sourcing" element={<SourcingPage />} />
        <Route path="/sourcing/:id" element={<SourcingDetailPage />} />
        <Route path="/account/sourcing" element={<SourcingAccountPage />} />
      </Route>

      {/* ============================================================
       * ADMIN — AUTH
       * ========================================================== */}

      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ============================================================
       * ADMIN — PROTECTED
       *
       * Every child path is RELATIVE to "/admin" so the layout wraps
       * them consistently. Do not prefix children with "/admin/".
       * ========================================================== */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* ------------------------------------------------------------
           * OVERVIEW
           * ---------------------------------------------------------- */}

          {/* <Route path="dashboard" element={<AdminDashboardPage />} /> */}

          <Route
            path="dashboard"
            element={<AdminComingSoonPage title="Dashboard" />}
          />

          {/* ------------------------------------------------------------
           * CATALOG
           * ---------------------------------------------------------- */}

          <Route path="sourcing" element={<AdminSourcingPage />} />
          <Route path="sourcing/:id" element={<AdminSourcingDetailPage />} />

          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminCreateProductPage />} />
          <Route path="products/:id/edit" element={<AdminEditProductPage />} />

          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="categories/new" element={<AdminCreateCategoryPage />} />
          <Route
            path="categories/:id/edit"
            element={<AdminEditCategoryPage />}
          />

          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="brands/new" element={<AdminCreateBrandPage />} />
          <Route path="brands/:id/edit" element={<AdminEditBrandPage />} />

          <Route
            path="collections"
            element={<AdminComingSoonPage title="Collections" />}
          />

          <Route
            path="inventory"
            element={<AdminComingSoonPage title="Inventory" />}
          />

          <Route path="reviews" element={<AdminReviewsPage />} />

          {/* ------------------------------------------------------------
           * SALES
           * ---------------------------------------------------------- */}

          <Route path="orders" element={<AdminOrdersPage />} />

          <Route path="flexpay" element={<AdminFlexPayPage />} />
          <Route path="flexpay/:planId" element={<AdminFlexPayDetailPage />} />

          <Route
            path="customers"
            element={<AdminComingSoonPage title="Customers" />}
          />

          <Route path="fulfillments" element={<AdminFulfillmentsPage />} />

          {/* ------------------------------------------------------------
           * SYSTEM
           * ---------------------------------------------------------- */}

          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="shipping" element={<AdminShippingPage />} />
          <Route path="warehouses" element={<AdminWarehousesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

/* ============================================================
 * ADMIN COMING SOON
 * ========================================================== */

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
