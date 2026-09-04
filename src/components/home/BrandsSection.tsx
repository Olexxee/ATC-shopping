import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { BrandCard } from "../brand/BrandCard";
import type { BrandCardData } from "../../types/brand-ui";

interface BrandsSectionProps {
  brands: BrandCardData[];
}

export function BrandsSection({ brands }: BrandsSectionProps) {
  if (!brands.length) return null;

  return (
    <Section>
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Discover
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Shop by brand
            </h2>
          </div>

          <Link
            to="/products"
            className="flex items-center gap-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-neutral-200 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
