import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  isHydrating: boolean;

  setAuthenticated: (value: boolean) => void;
  setHydrating: (value: boolean) => void;

  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isHydrating: true,

  setAuthenticated: (value) =>
    set({
      isAuthenticated: value,
    }),

  setHydrating: (value) =>
    set({
      isHydrating: value,
    }),

  reset: () =>
    set({
      isAuthenticated: false,
      isHydrating: false,
    }),
}));
