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

export function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-8">
        {navigation.map((item) => (
          <li key={`${item.label}-${item.href}`}>
            <Link
              to={item.href}
              className="text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}