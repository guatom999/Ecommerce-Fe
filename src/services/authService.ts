import api from "@/lib/apiClient";
import { UserPassport } from "@/types";

export const authApi = {
  signUp: async (payload: {
    email: string;
    password: string;
    username: string;
  }) => {
    const { data } = await api.post<UserPassport>("/users/signup", payload);
    return data;
  },

  signIn: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<UserPassport>("/users/signin", payload);
    return data;
  },

  signOut: async (oauthId: string) => {
    const { data } = await api.post("/users/signout", { oauth_id: oauthId });
    return data;
  },

  refresh: async (refreshToken: string) => {
    const { data } = await api.post<UserPassport>("/users/refresh", {
      refresh_token: refreshToken,
    });
    return data;
  },

  getUser: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },

  signUpAdmin: async (payload: {
    email: string;
    password: string;
    username: string;
  }) => {
    const { data } = await api.post<UserPassport>(
      "/users/signup-admin",
      payload,
    );
    return data;
  },

  getAdminSecret: async () => {
    const { data } = await api.get<{ token: string }>("/users/admin/secret");
    return data;
  },
};
