import type { FlexPayStatus } from "../../../features/admin/flexpay/flexpay.types";

interface Props {
  status: FlexPayStatus;
}

const statusConfig: Record<
  FlexPayStatus,
  {
    label: string;
    className: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },

  SHIPPING_DUE: {
    label: "Shipping Due",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },

  COMPLETED: {
    label: "Completed",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },

  ORDER_FAILED: {
    label: "Order Failed",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },

  CANCELLED: {
    label: "Cancelled",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  },

  EXPIRED: {
    label: "Expired",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  },
};

export function FlexPayStatusBadge({ status }: Props) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
