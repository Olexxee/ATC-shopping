import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAdmin, type AdminLoginPayload } from "./adminAuth.api";
import { adminAuthKeys } from "./useAdminAuth";

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminLoginPayload) => loginAdmin(payload),

    onSuccess: (result) => {
      queryClient.setQueryData(adminAuthKeys.currentUser(), result.user);
    },
  });
}
