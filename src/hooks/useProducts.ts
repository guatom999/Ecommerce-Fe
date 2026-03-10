"use client";
import { useState, useEffect, useCallback } from "react";
import { productsApi } from "@/services/productService";
import { Product, ProductsQuery, PaginatedResponse } from "@/types";
import toast from "react-hot-toast";

export function useProducts(initialQuery?: ProductsQuery) {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<ProductsQuery>(
    initialQuery ?? { page: 1, limit: 10 },
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.getProducts(query);
      setData(res);
    } catch {
      toast.error("โหลดสินค้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { data, loading, query, setQuery, refetch: fetchProducts };
}
