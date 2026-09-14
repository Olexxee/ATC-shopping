import { useEffect } from "react";
import { useCurrentUser } from "./auth.queries";
import { useAuthStore } from "./auth.store";

export function AuthBootstrap() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setHydrating = useAuthStore((state) => state.setHydrating);

  useEffect(() => {
    if (isLoading) {
      setHydrating(true);
      return;
    }

    setHydrating(false);
    setAuthenticated(Boolean(user && !isError));
  }, [user, isLoading, isError, setAuthenticated, setHydrating]);

  return null;
}
