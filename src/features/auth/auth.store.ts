import { create } from "zustand";
import { getMe, login, logout } from "./auth.api";
import type { AuthUser, LoginPayload } from "./auth.api";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (payload: LoginPayload) => {
    const result = await login(payload);

    set({
      user: result.user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  loadUser: async () => {
    try {
      const user = await getMe();

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

