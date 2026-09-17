export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

export interface HeroSlide {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  mobileImage?: string;
  href: string;
  actionLabel?: string;
  alignment?: "left" | "center" | "right";
  isActive?: boolean;
  sortOrder?: number;
}

export interface StoreSettings {
  companyName: string;
  logo: string | null;
  phone: string | null;
  email: string | null;
  socialLinks: SocialLinks;
  address: string | null;
  heroSlides: HeroSlide[];
  showImportedCategory: boolean;
  featuredCategories: string[];
}

export interface ImportationSettings {
  enabled: boolean;
  showOnLandingPage: boolean;
  showInStore: boolean;
}

export interface TrainingPromo {
  active: boolean;
  percent: number;
}

export interface PricingRules {
  globalDiscount: number;
  trainingPromo: TrainingPromo;
}

export interface BusinessConfig {
  store_settings: StoreSettings;
  importation_settings: ImportationSettings;
  pricing_rules: PricingRules;
  training_programs: unknown[];
  training_faq: unknown[];
}

export interface BusinessConfigRecord<T = unknown> {
  id: string;
  key: string;
  value: T;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessConfigResponse<T> {
  success: boolean;
  message: string;
  data: T;
  context: string;
}
