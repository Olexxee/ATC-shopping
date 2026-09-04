import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutAdmin } from "./adminAuth.api";
import { adminAuthKeys } from "./useAdminAuth";

export function useAdminLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAdmin,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: adminAuthKeys.all,
      });
    },
  });
}
