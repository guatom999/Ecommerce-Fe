"use client";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/services/authService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useAuth() {
  const { user, token, isAuthenticated, isAdmin, setAuth, clearAuth } =
    useAuthStore();
  const router = useRouter();

  const signIn = async (email: string, password: string) => {
    const passport = await authApi.signIn({ email, password });
    setAuth(passport.user, passport.token);
    return passport;
  };

  const signUp = async (email: string, password: string, username: string) => {
    const passport = await authApi.signUp({ email, password, username });
    return passport;
  };

  const signOut = async () => {
    if (token?.id) {
      try {
        await authApi.signOut(token.id);
      } catch {
        // ignore signout errors
      }
    }
    clearAuth();
    toast.success("ออกจากระบบสำเร็จ");
    router.push("/login");
  };

  return { user, token, isAuthenticated, isAdmin, signIn, signUp, signOut };
}
