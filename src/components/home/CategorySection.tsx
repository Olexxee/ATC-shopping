import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { CategoryCard } from "../category/CategoryCard";
import type { CategoryCardData } from "../../types/category-ui";


interface CategorySectionProps {
  categories: CategoryCardData[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  if (!categories.length) return null;

  return (
    <Section>
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Explore
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Shop by category
            </h2>
          </div>

          <Link
            to="/categories"
            className="
              hidden
              items-center
              gap-2
              text-sm
              font-medium
              text-neutral-700
              transition-colors
              hover:text-neutral-950
              sm:flex
            "
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <Link
          to="/categories"
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-medium
            text-neutral-700
            sm:hidden
          "
        >
          View all categories
          <ArrowRight size={16} />
        </Link>
      </Container>
    </Section>
  );
}
