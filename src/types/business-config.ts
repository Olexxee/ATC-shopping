export interface HeroSlideApi {
  id: string;
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  image: string;
  mobileImage?: string | null;
  href: string;
  actionLabel?: string | null;
  alignment?: "left" | "center" | "right" | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface StoreSettingsApi {
  companyName?: string | null;
  logo?: string | null;
  phone?: string | null;
  email?: string | null;
  socialLinks?: Record<string, string>;
  address?: string | null;

  heroSlides?: HeroSlideApi[];

  showImportedCategory?: boolean;
  featuredCategories?: string[];
}
