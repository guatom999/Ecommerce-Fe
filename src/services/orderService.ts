import api from "@/lib/apiClient";
import {
  Order,
  CreateOrderPayload,
  UpdateOrderPayload,
  PaginatedResponse,
  OrdersQuery,
} from "@/types";

export const ordersApi = {
  createOrder: async (payload: CreateOrderPayload) => {
    const { data } = await api.post<Order>("/orders", payload);
    return data;
  },

  getOrder: async (userId: string, orderId: string) => {
    const { data } = await api.get<Order>(`/orders/${userId}/${orderId}`);
    return data;
  },

  getOrders: async (query?: OrdersQuery) => {
    const { data } = await api.get<PaginatedResponse<Order>>("/orders", {
      params: query,
    });
    return data;
  },

  updateOrder: async (
    userId: string,
    orderId: string,
    payload: UpdateOrderPayload,
  ) => {
    const { data } = await api.patch<Order>(
      `/orders/${userId}/${orderId}`,
      payload,
    );
    return data;
  },
};
