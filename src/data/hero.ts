import type { HeroSlideData } from "../types/homepage-ui";

export const heroSlides: HeroSlideData[] = [
  {
    id: "import-with-confidence",
    eyebrow: "Global sourcing made simple",
    title: "Import products with confidence.",
    description:
      "Discover products from global suppliers and bring them closer to home.",
    image: "/images/hero/importation-desktop.jpg",
    mobileImage: "/images/hero/importation-mobile.jpg",
    href: "/importation",
    actionLabel: "Explore importation",
    alignment: "left",
  },

  {
    id: "shop-global",
    eyebrow: "Curated from around the world",
    title: "Global products. Local access.",
    description: "Shop a curated selection of products sourced for you.",
    image: "/images/hero/global-shopping-desktop.jpg",
    mobileImage: "/images/hero/global-shopping-mobile.jpg",
    href: "/shop",
    actionLabel: "Shop now",
    alignment: "left",
  },
];
