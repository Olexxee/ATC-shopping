import type { BrandCardData } from "./brand-ui";
import type { CategoryCardData } from "./category-ui";
import type { ProductCardData } from "./product-ui";

export interface HeroSlideData {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  mobileImage?: string;
  href: string;
  actionLabel?: string;
  alignment?: "left" | "center" | "right";
}

export interface HomepageViewData {
  hero: HeroSlideData[];

  categories: CategoryCardData[];

  brands: BrandCardData[];

  featuredProducts: ProductCardData[];

  newArrivals: ProductCardData[];

  bestSellers: ProductCardData[];
}
