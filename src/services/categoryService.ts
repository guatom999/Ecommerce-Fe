import api from "@/lib/apiClient";
import { Category } from "@/types";

export const categoriesApi = {
  getCategories: async (title?: string) => {
    const { data } = await api.get<Category[]>("/appinfo/categories", {
      params: title ? { title } : undefined,
    });
    return data;
  },

  createCategory: async (title: string) => {
    const { data } = await api.post<Category>("/appinfo/categories", { title });
    return data;
  },

  deleteCategory: async (categoryId: number) => {
    const { data } = await api.delete(`/appinfo/${categoryId}/categories`);
    return data;
  },

  generateApiKey: async () => {
    const { data } = await api.get<{ api_key: string }>("/appinfo/apikey");
    return data;
  },
};
