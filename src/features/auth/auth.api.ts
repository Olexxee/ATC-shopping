import { api } from "../../lib/api";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role?: string;
  status?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
}

export const login = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", payload);
  return response.data.data;
};

export const getMe = async (): Promise<AuthUser> => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

