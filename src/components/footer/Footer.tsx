import { Container } from "../layout/Container";

const shopLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "New arrivals", href: "/shop?sort=newest" },
];

const informationLinks = [
  { label: "About us", href: "/about" },
  { label: "Importation", href: "/importation" },
  { label: "How it works", href: "/how-it-works" },
];

const supportLinks = [
  { label: "Contact us", href: "/contact" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <Container>
        <div className="grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-16">
          {/* Brand */}
          <div className="max-w-xs">
            <a
              href="/"
              className="text-xl font-bold tracking-tight text-neutral-950"
            >
              STORE
            </a>

            <p className="mt-4 text-sm leading-6 text-neutral-500">
              Discover products from around the world, or let us help you source
              what you need.
            </p>
          </div>

          {/* Shop */}
          <FooterColumn title="Shop" links={shopLinks} />

          {/* Information */}
          <FooterColumn title="Information" links={informationLinks} />

          {/* Support */}
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        <div className="flex flex-col gap-4 border-t border-neutral-200 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 STORE. All rights reserved.</p>

          <div className="flex gap-6">
            <a
              href="/privacy"
              className="transition-colors hover:text-neutral-950"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition-colors hover:text-neutral-950"
            >
              Terms
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-950">{title}</h2>

      <nav className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="w-fit text-sm text-neutral-500 transition-colors hover:text-neutral-950"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
