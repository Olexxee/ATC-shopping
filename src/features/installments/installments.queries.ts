import { useQuery } from "@tanstack/react-query";
import { getFlexPayPlan, getFlexPayPlans } from "./installments.api";
import { installmentKeys } from "./installments.keys";

export const useFlexPayPlans = () => {
  return useQuery({
    queryKey: installmentKeys.list(),
    queryFn: getFlexPayPlans,
    staleTime: 30_000,
    retry: false,
  });
};

export const useFlexPayPlan = (planId: string) => {
  return useQuery({
    queryKey: installmentKeys.detail(planId),
    queryFn: () => getFlexPayPlan(planId),
    enabled: Boolean(planId),
    staleTime: 30_000,
    retry: false,
  });
};
