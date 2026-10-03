import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAdminFlexPayPlan } from "./flexpay.api";
import { adminFlexPayKeys } from "./flexpay.queries";

export const useCancelAdminFlexPayPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => cancelAdminFlexPayPlan(planId),

    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({
        queryKey: adminFlexPayKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: adminFlexPayKeys.detail(planId),
      });
    },
  });
};
