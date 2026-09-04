import { useQuery } from "@tanstack/react-query";
import { getCurrentAdmin } from "./adminAuth.api";

export const adminAuthKeys = {
  all: ["admin-auth"] as const,
  currentUser: () => [...adminAuthKeys.all, "current-user"] as const,
};

export function useCurrentAdmin() {
  return useQuery({
    queryKey: adminAuthKeys.currentUser(),
    queryFn: getCurrentAdmin,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}