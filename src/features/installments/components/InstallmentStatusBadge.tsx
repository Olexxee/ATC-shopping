import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  PackageCheck,
  XCircle,
} from "lucide-react";
import type { FlexPayPlanStatus } from "../installments.types";

interface InstallmentStatusBadgeProps {
  status: FlexPayPlanStatus | string;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  ACTIVE: {
    label: "Active",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
    icon: Clock3,
  },

  SHIPPING_DUE: {
    label: "Shipping due",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
    icon: PackageCheck,
  },

  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    icon: CheckCircle2,
  },

  ORDER_FAILED: {
    label: "Order issue",
    className: "bg-red-50 text-red-700 ring-red-600/20",
    icon: CircleAlert,
  },

  CANCELLED: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-600 ring-slate-500/20",
    icon: XCircle,
  },

  EXPIRED: {
    label: "Expired",
    className: "bg-slate-100 text-slate-600 ring-slate-500/20",
    icon: XCircle,
  },
};

export function InstallmentStatusBadge({
  status,
}: InstallmentStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600 ring-slate-500/20",
    icon: Clock3,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}
