import {
  BarChart3,
  Boxes,
  CreditCard,
  FolderTree,
  Layers3,
  MessageSquareText,
  Package,
  PackageSearch,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

/* ============================================================
 * NAVIGATION CONFIG
 *
 * Grouped to match the admin route tree in AppRoutes.tsx.
 * Section labels are cosmetic; ordering mirrors the route file.
 * ========================================================== */

interface NavItem {
  label: string;
  to: string;
  icon: typeof BarChart3;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
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
        label: "Sourcing",
        to: "/admin/sourcing",
        icon: PackageSearch,
      },
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
        label: "Reviews",
        to: "/admin/reviews",
        icon: MessageSquareText,
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
        label: "FlexPay",
        to: "/admin/flexpay",
        icon: CreditCard,
      },
      {
        label: "Customers",
        to: "/admin/customers",
        icon: Users,
      },
      {
        label: "Fulfillments",
        to: "/admin/fulfillments",
        icon: Truck,
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
      {
        label: "Shipping",
        to: "/admin/shipping",
        icon: Truck,
      },
      {
        label: "Warehouses",
        to: "/admin/warehouses",
        icon: Warehouse,
      },
    ],
  },
];

/* ============================================================
 * SIDEBAR
 * ========================================================== */

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* ============================================================
       * DESKTOP
       * ========================================================== */}

      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto p-4">
          <SidebarNavigation />
        </div>
      </aside>

      {/* ============================================================
       * MOBILE
       * ========================================================== */}

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
          {/* Drawer header */}
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
              aria-label="Close navigation menu"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <SidebarNavigation onNavigate={onMobileClose} />
          </div>
        </aside>
      </div>
    </>
  );
}

/* ============================================================
 * NAVIGATION BODY
 * ========================================================== */

interface SidebarNavigationProps {
  onNavigate?: () => void;
}

function SidebarNavigation({ onNavigate }: SidebarNavigationProps) {
  return (
    <nav className="space-y-6">
      {navigation.map((group) => (
        <div key={group.section}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {group.section}
          </p>

          <div className="space-y-1">
            {group.items.map((item) => (
              <SidebarLink key={item.to} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <NavLink
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
}
