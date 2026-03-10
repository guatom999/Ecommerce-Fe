import api from "@/lib/apiClient";
import {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  PaginatedResponse,
  ProductsQuery,
} from "@/types";

export const productsApi = {
  getProducts: async (query?: ProductsQuery) => {
    const { data } = await api.get<PaginatedResponse<Product>>("/products", {
      params: query,
    });
    return data;
  },

  getProduct: async (productId: string) => {
    const { data } = await api.get<Product>(`/products/${productId}`);
    return data;
  },

  createProduct: async (payload: CreateProductPayload) => {
    const { data } = await api.post<Product>("/products", payload);
    return data;
  },

  updateProduct: async (productId: string, payload: UpdateProductPayload) => {
    const { data } = await api.patch<Product>(
      `/products/${productId}`,
      payload,
    );
    return data;
  },

  deleteProduct: async (productId: string) => {
    const { data } = await api.delete(`/products/${productId}`);
    return data;
  },
};
