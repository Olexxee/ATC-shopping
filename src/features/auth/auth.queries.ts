import { useQuery } from "@tanstack/react-query";
import { getMe } from "./auth.api";
import { authKeys } from "./auth.keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,

    retry: false,

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,
  });
}
