import type { HomepageViewData } from "../types/homepage-ui";
import { heroSlides } from "./hero";

export const homepageData: HomepageViewData = {
  hero: heroSlides,

  categories: [
    {
      id: "electronics",
      name: "Electronics",
      slug: "electronics",
      image: "/images/categories/electronics.jpg",
    },
    {
      id: "fashion",
      name: "Fashion",
      slug: "fashion",
      image: "/images/categories/fashion.jpg",
    },
    {
      id: "home",
      name: "Home & Living",
      slug: "home-living",
      image: "/images/categories/home.jpg",
    },
    {
      id: "beauty",
      name: "Beauty",
      slug: "beauty",
      image: "/images/categories/beauty.jpg",
    },
  ],

  brands: [
    {
      id: "apple",
      name: "Apple",
      slug: "apple",
    },
    {
      id: "samsung",
      name: "Samsung",
      slug: "samsung",
    },
    {
      id: "nike",
      name: "Nike",
      slug: "nike",
    },
    {
      id: "sony",
      name: "Sony",
      slug: "sony",
    },
  ],

  featuredProducts: [],

  newArrivals: [],

  bestSellers: [],
};
