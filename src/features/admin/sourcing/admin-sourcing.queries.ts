import { useQuery } from "@tanstack/react-query";

import {
  getAdminSourcingRequest,
  getAdminSourcingRequests,
} from "./admin-sourcing.api";
import { adminSourcingKeys } from "./admin-sourcing.keys";

import type { AdminSourcingListParams } from "./admin-sourcing.types";

// ============================================================
// LIST
// ============================================================

export function useAdminSourcingRequests(
  params?: AdminSourcingListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: adminSourcingKeys.list(params),
    queryFn: () => getAdminSourcingRequests(params),
    staleTime: 30_000,
    retry: false,
    enabled: options?.enabled ?? true,
  });
}

// ============================================================
// DETAIL
// ============================================================

export function useAdminSourcingRequest(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: adminSourcingKeys.detail(id ?? ""),
    queryFn: () => getAdminSourcingRequest(id!),
    staleTime: 30_000,
    retry: false,
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}
