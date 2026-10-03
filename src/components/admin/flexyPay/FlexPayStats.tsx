import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  PackageCheck,
  Wallet,
} from "lucide-react";

import type { FlexPayStats as Stats } from "../../../features/admin/flexpay/flexpay.types";

interface Props {
  stats?: Stats;
  isLoading: boolean;
}

const money = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);

export function FlexPayStats({ stats, isLoading }: Props) {
  const cards = [
    {
      label: "Active Plans",
      value: stats?.counts.active ?? 0,
      icon: CreditCard,
    },
    {
      label: "Shipping Due",
      value: stats?.counts.shippingDue ?? 0,
      icon: PackageCheck,
    },
    {
      label: "Completed",
      value: stats?.counts.completed ?? 0,
      icon: CheckCircle2,
    },
    {
      label: "Order Failed",
      value: stats?.counts.orderFailed ?? 0,
      icon: AlertTriangle,
    },
    {
      label: "Collected",
      value: stats ? money(stats.financials.amountPaid) : "—",
      icon: Wallet,
    },
    {
      label: "Outstanding",
      value: stats ? money(stats.financials.balanceDue) : "—",
      icon: Wallet,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-xl border border-[#1A1F2E] bg-[#11151C] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{card.label}</p>

              <Icon className="h-4 w-4 text-gray-500" />
            </div>

            <p className="mt-3 text-2xl font-semibold text-white">
              {isLoading ? "—" : card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
