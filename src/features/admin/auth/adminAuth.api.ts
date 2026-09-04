import { api } from "../../../lib/api";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role?: string;
  status: string;
}

interface AuthResponse {
  user: AdminUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export const loginAdmin = async (
  payload: AdminLoginPayload,
): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/login", payload);

  return response.data.data;
};

export const getCurrentAdmin = async (): Promise<AdminUser> => {
  const response = await api.get("/api/auth/me");

  return response.data.data;
};

export const logoutAdmin = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};
