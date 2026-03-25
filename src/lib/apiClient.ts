import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

// Attach JWT on every request — อ่านจาก Zustand store โดยตรง
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { token: currentToken, user, setAuth, clearAuth } =
          useAuthStore.getState();

        const refreshToken = currentToken?.refresh_token;

        if (!refreshToken || !user) {
          useAuthStore.getState().clearAuth();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(err);
        }

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/refresh`,
          { refresh_token: refreshToken },
          { headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY } },
        );

        // อัปเดต token ใน Zustand store (persist จะ sync localStorage ให้เอง)
        setAuth(user, data.token);

        originalRequest.headers.Authorization = `Bearer ${data.token.access_token}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
