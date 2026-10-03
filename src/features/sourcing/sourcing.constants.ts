import type { SourcingRequestStatus } from "./sourcing.types";

export const ADMIN_SOURCING_PAGE_SIZE = 10;

export const SOURCING_STATUS_OPTIONS: Array<{
  value: SourcingRequestStatus | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "All" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "RESPONDED", label: "Responded" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
  { value: "CANCELLED", label: "Cancelled" },
];
