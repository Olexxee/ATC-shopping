import { Link } from "react-router-dom";

const navigation = [
  {
    label: "Shop",
    href: "/products",
  },
  {
    label: "Categories",
    href: "/products",
  },
  {
    label: "Brands",
    href: "/products",
  },
  {
    label: "New Arrivals",
    href: "/products?sort=newest",
  },
  {
    label: "Importation",
    href: "/importation",
  },
];

interface MobileNavigationProps {
  open: boolean;
}

export function MobileNavigation({ open }: MobileNavigationProps) {
  if (!open) return null;

  return (
    <div className="border-t border-neutral-200 bg-white lg:hidden">
      <nav aria-label="Mobile navigation" className="px-4 py-4 sm:px-6">
        <ul>
          {navigation.map((item) => (
            <li key={`${item.label}-${item.href}`}>
              <Link
                to={item.href}
                className="block border-b border-neutral-100 py-4 text-sm font-medium text-neutral-800 last:border-b-0"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
