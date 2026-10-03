import { useQuery } from "@tanstack/react-query";

import {
  getAdminFlexPayPlan,
  getAdminFlexPayPlans,
  getAdminFlexPayPayments,
  getAdminFlexPayStats,
} from "./flexpay.api";

export const adminFlexPayKeys = {
  all: ["admin", "flexpay"] as const,

  lists: () => [...adminFlexPayKeys.all, "list"] as const,

  list: (page: number, limit: number, status?: string, search?: string) =>
    [...adminFlexPayKeys.lists(), { page, limit, status, search }] as const,

  stats: () => [...adminFlexPayKeys.all, "stats"] as const,

  details: () => [...adminFlexPayKeys.all, "detail"] as const,

  detail: (planId: string) => [...adminFlexPayKeys.details(), planId] as const,

  payments: (planId: string) =>
    [...adminFlexPayKeys.all, "payments", planId] as const,
};

export const useAdminFlexPayPlans = ({
  page = 1,
  limit = 20,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
} = {}) =>
  useQuery({
    queryKey: adminFlexPayKeys.list(page, limit, status, search),
    queryFn: () =>
      getAdminFlexPayPlans({
        page,
        limit,
        status,
        search,
      }),
    staleTime: 30_000,
  });

export const useAdminFlexPayStats = () =>
  useQuery({
    queryKey: adminFlexPayKeys.stats(),
    queryFn: getAdminFlexPayStats,
    staleTime: 30_000,
  });

export const useAdminFlexPayPlan = (planId?: string) =>
  useQuery({
    queryKey: adminFlexPayKeys.detail(planId ?? ""),
    queryFn: () => getAdminFlexPayPlan(planId!),
    enabled: Boolean(planId),
    staleTime: 15_000,
  });

export const useAdminFlexPayPayments = (planId?: string) =>
  useQuery({
    queryKey: adminFlexPayKeys.payments(planId ?? ""),
    queryFn: () => getAdminFlexPayPayments(planId!),
    enabled: Boolean(planId),
    staleTime: 15_000,
  });
