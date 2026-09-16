import { X } from "lucide-react";
import {
  BarChart3,
  Boxes,
  FolderTree,
  Layers3,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navigation = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        to: "/admin/dashboard",
        icon: BarChart3,
      },
    ],
  },
  {
    section: "Catalog",
    items: [
      {
        label: "Products",
        to: "/admin/products",
        icon: Package,
      },
      {
        label: "Categories",
        to: "/admin/categories",
        icon: FolderTree,
      },
      {
        label: "Brands",
        to: "/admin/brands",
        icon: Store,
      },
      {
        label: "Collections",
        to: "/admin/collections",
        icon: Layers3,
      },
      {
        label: "Inventory",
        to: "/admin/inventory",
        icon: Boxes,
      },
    ],
  },
  {
    section: "Sales",
    items: [
      {
        label: "Orders",
        to: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        label: "Customers",
        to: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    section: "System",
    items: [
      {
        label: "Settings",
        to: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export function AdminSidebar({
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* ============================================================
DESKTOP SIDEBAR
============================================================ */}{" "}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        {" "}
        <div className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto p-4">
          {" "}
          <SidebarNavigation />{" "}
        </div>{" "}
      </aside>
      ```
      {/* ============================================================
      MOBILE SIDEBAR
  ============================================================ */}
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onMobileClose}
          className={[
            "absolute inset-0 bg-slate-900/40 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Drawer */}
        <aside
          className={[
            "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl",
            "transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          {/* Mobile drawer header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
            <div>
              <span className="font-semibold tracking-tight text-slate-900">
                Keplex
              </span>

              <span className="ml-2 text-sm text-slate-400">Admin</span>
            </div>

            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <SidebarNavigation onNavigate={onMobileClose} />
          </div>
        </aside>
      </div>
    </>
  );
}

interface SidebarNavigationProps {
  onNavigate?: () => void;
}

function SidebarNavigation({ onNavigate }: SidebarNavigationProps) {
  return (
    <nav className="space-y-6">
      {navigation.map((group) => (
        <div key={group.section}>
          {" "}
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {group.section}{" "}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                      isActive
                        ? "bg-slate-100 font-medium text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon size={17} />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
