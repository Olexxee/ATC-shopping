import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { queryClient } from "./queryClient";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

const EXCLUDED_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Ignore non-401s
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Ignore auth endpoints
    if (EXCLUDED_ROUTES.some((route) => originalRequest.url?.includes(route))) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Queue requests while refresh is happening
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/api/auth/refresh");

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      // collapse auth state naturally
      queryClient.setQueryData(["auth", "me"], null);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
