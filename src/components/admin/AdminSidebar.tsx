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

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="sticky top-0 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto p-4">
        <nav className="space-y-6">
          {navigation.map((group) => (
            <div key={group.section}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {group.section}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
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
      </div>
    </aside>
  );
}
