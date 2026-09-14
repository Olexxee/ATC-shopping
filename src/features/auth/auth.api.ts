import { api } from "../../lib/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateMePayload,
  User,
} from "../../features/auth/auth.types";


export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/login", payload);

  return response.data.data;
};

export const register = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/register", payload);

  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

export const refreshSession = async (): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/refresh");

  return response.data.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get("/api/auth/me");

  return response.data.data;
};

export const updateMe = async (payload: UpdateMePayload): Promise<User> => {
  const response = await api.patch("/api/auth/me", payload);

  return response.data.data;
};
