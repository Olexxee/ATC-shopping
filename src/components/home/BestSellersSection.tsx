import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { ProductGrid } from "../product/ProductGrid";
import type { ProductCardData } from "../../types/product-ui";



interface BestSellersSectionProps {
  products: ProductCardData[];
}

export function BestSellersSection({ products }: BestSellersSectionProps) {
  if (!products.length) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Popular
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Best sellers
            </h2>
          </div>

          <Link
            to="/products?isBestSeller=true"
            className="flex items-center gap-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8">
          <ProductGrid products={products} />
        </div>

        <Link
          to="/products?isBestSeller=true"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 sm:hidden"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </Container>
    </Section>
  );
}
