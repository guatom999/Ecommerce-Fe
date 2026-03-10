"use client";
import { useState, useEffect, useCallback } from "react";
import { ordersApi } from "@/services/orderService";
import { Order, OrdersQuery, PaginatedResponse } from "@/types";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export function useOrders(adminMode = false) {
  const { user } = useAuthStore();
  const [data, setData] = useState<PaginatedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<OrdersQuery>({ page: 1, limit: 10 });

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (adminMode) {
        const res = await ordersApi.getOrders(query);
        setData(res);
      } else {
        const res = await ordersApi.getOrders({
          ...query,
        });
        setData(res);
      }
    } catch {
      toast.error("โหลดออเดอร์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [user, query, adminMode]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { data, loading, query, setQuery, refetch: fetchOrders };
}
