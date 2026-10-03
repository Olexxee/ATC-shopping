import type { SourcingRequestStatus } from "../sourcing.types";

const STATUS_STYLES: Record<
  SourcingRequestStatus,
  { label: string; className: string }
> = {
  SUBMITTED: {
    label: "Submitted",
    className: "bg-blue-50 text-blue-700",
  },
  IN_REVIEW: {
    label: "In review",
    className: "bg-amber-50 text-amber-700",
  },
  RESPONDED: {
    label: "Responded",
    className: "bg-emerald-50 text-emerald-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-neutral-100 text-neutral-700",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-red-50 text-red-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-neutral-100 text-neutral-500",
  },
};

interface SourcingStatusBadgeProps {
  status: SourcingRequestStatus;
}

export function SourcingStatusBadge({ status }: SourcingStatusBadgeProps) {
  const config = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
