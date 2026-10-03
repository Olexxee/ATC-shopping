import { useQuery } from "@tanstack/react-query";

import { getMySourcingRequest, getMySourcingRequests } from "./sourcing.api";
import type { SourcingListParams } from "./sourcing.types";

// ============================================================
// QUERY KEYS
// ============================================================

export const sourcingKeys = {
  all: ["sourcing"] as const,

  lists: () => [...sourcingKeys.all, "list"] as const,

  myList: (params?: SourcingListParams) =>
    [...sourcingKeys.lists(), "mine", params] as const,

  myDetail: (id: string) =>
    [...sourcingKeys.all, "mine", "detail", id] as const,
};

// ============================================================
// CUSTOMER
// ============================================================

export function useMySourcingRequests(
  params: SourcingListParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sourcingKeys.myList(params),
    queryFn: () => getMySourcingRequests(params),
    staleTime: 30_000,
    retry: false,
    enabled: options?.enabled ?? true,
  });
}

export function useMySourcingRequest(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: sourcingKeys.myDetail(id ?? ""),
    queryFn: () => getMySourcingRequest(id!),
    staleTime: 30_000,
    retry: false,
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}
