export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  status: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone?: string | null;
  password: string;
}

export interface UpdateMePayload {
  fullName?: string;
  phone?: string | null;
}

export interface AuthResponse {
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
