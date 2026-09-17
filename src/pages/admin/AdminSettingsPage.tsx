import { CircleDollarSign, Download, ImageIcon, Store } from "lucide-react";
import { StoreSettingsForm } from "../../features/admin/settings/components/StoreSettingsForm";
import { ImportationSettingsForm } from "../../features/admin/settings/components/ImportationSettingsForm";
import { HeroSlidesForm } from "../../features/admin/settings/components/HeroSlidesForm";
import { PricingRulesForm } from "../../features/admin/settings/components/PricingRulesForm";
import { useBusinessConfigs } from "../../features/admin/settings/businessConfig.queries";

import type {
  ImportationSettings,
  PricingRules,
  StoreSettings,
} from "../../features/admin/settings/businessConfig.types";

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  companyName: "Keplex",
  logo: null,
  phone: null,
  email: null,
  socialLinks: {},
  address: null,
  heroSlides: [],
  showImportedCategory: false,
  featuredCategories: [],
};

const DEFAULT_IMPORTATION_SETTINGS: ImportationSettings = {
  enabled: false,
  showOnLandingPage: false,
  showInStore: false,
};

const DEFAULT_PRICING_RULES: PricingRules = {
  globalDiscount: 0,
  trainingPromo: {
    active: false,
    percent: 0,
  },
};

export function AdminSettingsPage() {
  const configsQuery = useBusinessConfigs();

  if (configsQuery.isLoading) {
    return <SettingsSkeleton />;
  }

  if (configsQuery.isError) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        {" "}
        <PageHeader />
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            Unable to load business settings.
          </p>

          <button
            type="button"
            onClick={() => configsQuery.refetch()}
            className="mt-3 text-sm font-medium text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const configs = configsQuery.data;

  const storeSettings = configs?.store_settings ?? DEFAULT_STORE_SETTINGS;

  const importationSettings =
    configs?.importation_settings ?? DEFAULT_IMPORTATION_SETTINGS;

  const pricingRules = configs?.pricing_rules ?? DEFAULT_PRICING_RULES;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {" "}
      <PageHeader />
      <div className="space-y-6">
        <SettingsSection
          icon={<Store size={18} />}
          title="Store Settings"
          description="Manage your store identity, contact information, and social links."
        >
          <StoreSettingsForm settings={storeSettings} />
        </SettingsSection>

        <SettingsSection
          icon={<ImageIcon size={18} />}
          title="Homepage Hero"
          description="Configure the content and images displayed in the homepage hero."
        >
          <HeroSlidesForm settings={storeSettings} />
        </SettingsSection>

        <SettingsSection
          icon={<Download size={18} />}
          title="Importation Settings"
          description="Control imported products and how importation content appears in the store."
        >
          <ImportationSettingsForm settings={importationSettings} />
        </SettingsSection>

        <SettingsSection
          icon={<CircleDollarSign size={18} />}
          title="Pricing Rules"
          description="Manage global discounts and training promotions."
        >
          <PricingRulesForm settings={pricingRules} />
        </SettingsSection>
      </div>
    </div>
  );
}

interface SettingsSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {" "}
      <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-4">
        {" "}
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          {icon}{" "}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function PageHeader() {
  return (
    <div>
      {" "}
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Settings{" "}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage your store configuration and business rules.
      </p>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {" "}
      <div>
        {" "}
        <div className="h-7 w-28 animate-pulse rounded bg-slate-200" />{" "}
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200" />{" "}
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-72 animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}
