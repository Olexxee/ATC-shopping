import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import { login, logout, register, updateMe } from "./auth.api";
import { authKeys } from "./auth.keys";
import { useAuthStore } from "./auth.store";

export function useLogin() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuthenticated(true);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useRegister() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuthenticated(true);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}

export function useLogout() {
  const reset = useAuthStore((state) => state.reset);
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset();
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.removeQueries({
        queryKey: ["cart"],
      });
      queryClient.removeQueries({
        queryKey: ["wishlist"],
      });
    },
  });
}

export function useUpdateMe() {
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
}
