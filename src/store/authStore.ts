import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserToken } from "@/types";

interface AuthState {
  user: User | null;
  token: UserToken | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: UserToken) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", token.access_token);
          localStorage.setItem("refresh_token", token.refresh_token);
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role_id === 2,
        });
      },
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.user && state?.token) {
          state.isAuthenticated = true;
          state.isAdmin = state.user.role_id === 2;
        }
      },
    },
  ),
);
