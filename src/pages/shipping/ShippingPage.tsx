import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../components/layout/Container";
import { Section } from "../../components/layout/Section";
import { useStorefrontShipping } from "../../features/shipping/shipping.queries";
import type {
  ShippingType,
  StorefrontShipping,
  StorefrontShippingRule,
} from "../../features/shipping/shipping.types";

// ============================================================================
// HELPERS
// ============================================================================

const currency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return "—";

  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";

  return `₦${n.toLocaleString()}`;
};

const typeLabels: Record<ShippingType, string> = {
  DEFAULT: "Standard",
  LOCAL: "Local delivery",
  IMPORT: "Import delivery",
  SEA: "Sea freight",
  AIR: "Air freight",
  DIGITAL: "Digital delivery",
};

const typeOrder: ShippingType[] = [
  "LOCAL",
  "IMPORT",
  "SEA",
  "AIR",
  "DIGITAL",
  "DEFAULT",
];

// ============================================================================
// PAGE
// ============================================================================

export function ShippingPage() {
  const query = useStorefrontShipping();
  const shipping = query.data ?? null;

  const rulesByType = useMemo(() => {
    if (!shipping) return [];

    const groups = new Map<ShippingType, StorefrontShippingRule[]>();

    for (const rule of shipping.rules) {
      const list = groups.get(rule.type) ?? [];
      list.push(rule);
      groups.set(rule.type, list);
    }

    return typeOrder
      .filter((type) => groups.has(type))
      .map((type) => ({ type, rules: groups.get(type)! }));
  }, [shipping]);

  return (
    <main className="min-h-screen bg-white">
      <Section>
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Delivery
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Shipping & delivery
            </h1>

            <p className="mt-4 text-sm leading-6 text-neutral-500 sm:text-base">
              Every order is prepared, packed and dispatched with care. Below
              you'll find the rates and options that apply to your delivery.
            </p>
          </div>

          <div className="mt-12">
            {query.isLoading && <ShippingSkeleton />}

            {query.isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
                <p className="text-sm font-medium text-red-700">
                  We couldn't load shipping information right now.
                </p>

                <p className="mt-1 text-sm text-red-600">
                  Please try again later or contact support.
                </p>
              </div>
            )}

            {!query.isLoading && !query.isError && !shipping && (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center">
                <p className="text-sm text-neutral-600">
                  Shipping information isn't available at the moment. Please
                  reach out to our team for details.
                </p>
              </div>
            )}

            {shipping && (
              <ShippingContent
                shipping={shipping}
                rulesByType={rulesByType}
              />
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-neutral-950">
                  Have a question about shipping?
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Our team can help you plan a delivery or quote a special
                  shipment.
                </p>
              </div>

              <Link
                to="/contact"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

// ============================================================================
// CONTENT
// ============================================================================

interface ShippingContentProps {
  shipping: StorefrontShipping;
  rulesByType: Array<{
    type: ShippingType;
    rules: StorefrontShippingRule[];
  }>;
}

function ShippingContent({ shipping, rulesByType }: ShippingContentProps) {
  const freeThreshold = shipping.freeShippingThreshold;
  const hasFreeThreshold =
    freeThreshold !== null && freeThreshold !== undefined;

  return (
    <div className="space-y-12">
      {/* Base rates */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-950">Base rates</h2>

        <p className="mt-2 text-sm text-neutral-500">
          Applied to every order before any rule-specific adjustments.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RateCard label="Per kilogram" value={currency(shipping.pricePerKg)} />
          <RateCard label="Per cubic meter" value={currency(shipping.pricePerCBM)} />
          <RateCard label="Handling fee" value={currency(shipping.handlingFee)} />
          <RateCard label="Minimum charge" value={currency(shipping.minCharge)} />
        </div>

        {hasFreeThreshold && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              ₦
            </span>

            <div>
              <p className="text-sm font-medium text-emerald-900">
                Free shipping available
              </p>

              <p className="mt-1 text-sm text-emerald-800">
                Orders above{" "}
                <span className="font-semibold">
                  {currency(freeThreshold)}
                </span>{" "}
                qualify for free delivery.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Rules */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-950">
          Shipping methods
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Rates and conditions by delivery type. The applicable rule is chosen
          based on your order's weight, subtotal and destination.
        </p>

        <div className="mt-6 space-y-6">
          {rulesByType.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
              <p className="text-sm text-neutral-500">
                No shipping rules are configured at the moment.
              </p>
            </div>
          )}

          {rulesByType.map(({ type, rules }) => (
            <div
              key={type}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
            >
              <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-3">
                <h3 className="text-sm font-semibold text-neutral-950">
                  {typeLabels[type]}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
                    <tr>
                      <th className="px-5 py-3 font-medium">Rule</th>
                      <th className="px-5 py-3 font-medium">Applies when</th>
                      <th className="px-5 py-3 font-medium">Base rate</th>
                      <th className="px-5 py-3 font-medium">Per kg</th>
                      <th className="px-5 py-3 font-medium">Per CBM</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-100">
                    {rules.map((rule) => (
                      <tr key={rule.id}>
                        <td className="px-5 py-4 font-medium text-neutral-900">
                          {rule.name}
                        </td>

                        <td className="px-5 py-4 text-neutral-600">
                          {describeCondition(rule)}
                        </td>

                        <td className="px-5 py-4 text-neutral-900">
                          {currency(rule.baseRate)}
                        </td>

                        <td className="px-5 py-4 text-neutral-900">
                          {currency(rule.ratePerKg)}
                        </td>

                        <td className="px-5 py-4 text-neutral-900">
                          {currency(rule.ratePerCBM)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function RateCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>

      <p className="mt-3 text-xl font-semibold text-neutral-950">{value}</p>
    </div>
  );
}

function describeCondition(rule: StorefrontShippingRule): string {
  const parts: string[] = [];

  const num = (v: number | string | null): number | null => {
    if (v === null) return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const minSubtotal = num(rule.minSubtotal);
  const maxSubtotal = num(rule.maxSubtotal);
  const minWeight = num(rule.minWeight);
  const maxWeight = num(rule.maxWeight);

  if (minSubtotal !== null && maxSubtotal !== null) {
    parts.push(
      `subtotal between ${currency(minSubtotal)} and ${currency(maxSubtotal)}`,
    );
  } else if (minSubtotal !== null) {
    parts.push(`subtotal above ${currency(minSubtotal)}`);
  } else if (maxSubtotal !== null) {
    parts.push(`subtotal below ${currency(maxSubtotal)}`);
  }

  if (minWeight !== null && maxWeight !== null) {
    parts.push(`weight between ${minWeight}kg and ${maxWeight}kg`);
  } else if (minWeight !== null) {
    parts.push(`weight above ${minWeight}kg`);
  } else if (maxWeight !== null) {
    parts.push(`weight below ${maxWeight}kg`);
  }

  return parts.length ? parts.join(", ") : "All orders";
}

// ============================================================================
// SKELETON
// ============================================================================

function ShippingSkeleton() {
  return (
    <div className="space-y-12">
      <div>
        <div className="h-6 w-32 animate-pulse rounded bg-neutral-100" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white p-5"
            >
              <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
              <div className="mt-3 h-6 w-24 animate-pulse rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="h-6 w-40 animate-pulse rounded bg-neutral-100" />

        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-3">
            <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
          </div>

          <div className="space-y-4 p-5">
            <div className="h-10 animate-pulse rounded bg-neutral-100" />
            <div className="h-10 animate-pulse rounded bg-neutral-100" />
            <div className="h-10 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  );
}