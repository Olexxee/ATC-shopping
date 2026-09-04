import { create } from "zustand";
import type { AdminUser } from "../features/admin/auth/adminAuth.api";

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  setUser: (user: AdminUser | null) => void;
  clearAuth: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
